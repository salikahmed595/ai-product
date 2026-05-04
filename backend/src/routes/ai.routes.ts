import type { FastifyInstance } from 'fastify';
import { getAIResponse } from '../services/ai.service.js';

export default async function (server: FastifyInstance) {
  server.post('/test', async (request, reply) => {
    try {
      const body = request.body as any;
      const { message, history, config } = body;
      
      if (!message) {
        return reply.status(400).send({ error: 'Message is required' });
      }

      // Convert history to OpenAI format
      const formattedHistory = (history || []).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Map config to the format expected by ai.service
      const clinicContext = {
        name: config.name || "Aesthetic Clinic",
        services: Array.isArray(config.services) ? config.services : config.services.split(','),
        timezone: config.timezone || "America/New_York",
        operating_days: config.operatingDays || [],
        working_hours: config.workingHours || "09:00-17:00",
        system_prompt: config.system_prompt
      };

      const responseText = await getAIResponse(message, formattedHistory, clinicContext);
      
      return reply.send({ response: responseText });
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'LLM test failed' });
    }
  });

  server.post('/tts', async (request, reply) => {
    try {
      const { text, voice_id } = request.body as any;
      if (!text) return reply.status(400).send({ error: 'Text is required' });

      // Call ElevenLabs API directly for testing
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) return reply.status(500).send({ error: 'Missing ElevenLabs API Key' });

      const voice = voice_id || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: { stability: 0.5, similarity_boost: 0.5 },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      return reply.send({ audio: `data:audio/mpeg;base64,${base64Audio}` });
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'TTS test failed' });
    }
  });
}
