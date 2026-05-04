import type { FastifyInstance } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { supabase } from '../lib/supabase.js';
import { getAIResponse, type Message } from '../services/ai.service.js';
import { textToSpeech } from '../services/tts.service.js';
import { createDeepgramSession } from '../services/stt.service.js';

interface CallSession {
  streamSid: string;
  clinicId: string;
  clinicConfig: any;
  history: Message[];
  dgSession: ReturnType<typeof createDeepgramSession>;
  isProcessing: boolean;
  callStart: number;
}

const sessions = new Map<string, CallSession>();

function sendMedia(ws: WebSocket, streamSid: string, audioBuffer: Buffer) {
  if (ws.readyState !== 1) return;
  ws.send(JSON.stringify({
    event: 'media',
    streamSid,
    media: { payload: audioBuffer.toString('base64') },
  }));
}

export default async function (server: FastifyInstance) {
  // POST /api/twilio/incoming-call — Twilio calls this when a call comes in
  server.post('/incoming-call', async (request, reply) => {
    server.log.info('📞 Incoming Twilio call');
    const host = process.env.BACKEND_PUBLIC_URL
      ? process.env.BACKEND_PUBLIC_URL.replace(/^https?:\/\//, '')
      : request.headers.host;

    reply.type('text/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Connect>\n    <Stream url="wss://${host}/api/twilio/stream" />\n  </Connect>\n</Response>`
    );
  });

  // GET /api/twilio/stream — Twilio media stream WebSocket
  server.get('/stream', { websocket: true }, (socket: WebSocket, _req) => {
    server.log.info('🔌 Twilio media stream connected');
    let session: CallSession | null = null;

    socket.on('message', async (raw: Buffer) => {
      let data: any;
      try { data = JSON.parse(raw.toString()); } catch { return; }

      // ── START event ──
      if (data.event === 'start') {
        const streamSid: string = data.start.streamSid;
        server.log.info(`▶️  Stream started: ${streamSid}`);

        const { data: clinic, error } = await supabase
          .from('clinics').select('*').limit(1).single();

        if (error || !clinic) {
          server.log.error('No clinic configured for incoming call');
          socket.close();
          return;
        }

        const dgSession = createDeepgramSession(async (transcript: string) => {
          if (!session || session.isProcessing) return;
          server.log.info(`🗣️  User: "${transcript}"`);
          session.isProcessing = true;
          session.history.push({ role: 'user', content: transcript });

          try {
            const aiText = await getAIResponse(transcript, session.history, {
              name: clinic.name,
              services: clinic.services,
              timezone: clinic.timezone,
              operating_days: clinic.operating_days,
              working_hours: clinic.working_hours,
            });
            server.log.info(`🤖 AI: "${aiText}"`);
            session.history.push({ role: 'assistant', content: aiText });

            const audio = await textToSpeech(aiText);
            if (audio) sendMedia(socket, streamSid, audio);
          } catch (err: unknown) {
            server.log.error({ err }, 'Pipeline error');
          } finally {
            if (session) session.isProcessing = false;
          }
        });

        session = {
          streamSid, clinicId: clinic.id, clinicConfig: clinic,
          history: [], dgSession, isProcessing: false, callStart: Date.now(),
        };
        sessions.set(streamSid, session);

        // Send greeting
        const greeting = `Hello! Thank you for calling ${clinic.name}. I'm your AI receptionist. How can I help you today?`;
        session.history.push({ role: 'assistant', content: greeting });
        const greetAudio = await textToSpeech(greeting);
        if (greetAudio) sendMedia(socket, streamSid, greetAudio);
      }

      // ── MEDIA event ── forward audio to Deepgram
      else if (data.event === 'media' && session?.dgSession) {
        const audio = Buffer.from(data.media.payload, 'base64');
        session.dgSession.send(audio);
      }

      // ── STOP event ──
      else if (data.event === 'stop' && session) {
        server.log.info('⏹️  Stream stopped');
        session.dgSession?.close();
        const duration = Math.round((Date.now() - session.callStart) / 1000);
        await supabase.from('call_logs').insert([{
          clinic_id: session.clinicId,
          phone_number: data.stop?.from ?? 'unknown',
          duration,
          status: 'answered',
          outcome: session.history.some(m => m.role === 'user') ? 'no_action' : 'dropped',
        }]);
        sessions.delete(session.streamSid);
        session = null;
      }
    });

    socket.on('close', () => {
      server.log.info('❌ WebSocket closed');
      if (session) {
        session.dgSession?.close();
        sessions.delete(session.streamSid);
        session = null;
      }
    });
  });
}
