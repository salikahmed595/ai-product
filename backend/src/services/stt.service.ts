// STT Service — Deepgram Live WebSocket (mulaw 8kHz input)

export interface DeepgramSession {
  send: (audio: Buffer) => void;
  close: () => void;
}

export function createDeepgramSession(
  onTranscript: (text: string) => void
): DeepgramSession | null {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ DEEPGRAM_API_KEY not set — STT unavailable');
    return null;
  }

  const url =
    'wss://api.deepgram.com/v1/listen' +
    '?encoding=mulaw&sample_rate=8000&model=nova-2' +
    '&language=en&punctuate=true&interim_results=false&endpointing=500';

  // Node 22 has global WebSocket
  const ws = new (globalThis as any).WebSocket(url, {
    headers: { Authorization: `Token ${apiKey}` },
  });

  ws.onopen = () => console.log('🎤 Deepgram connected');
  ws.onclose = () => console.log('🎤 Deepgram disconnected');
  ws.onerror = (e: any) => console.error('Deepgram WS error:', e.message);

  ws.onmessage = (event: any) => {
    try {
      const data = JSON.parse(event.data);
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      if (transcript && data.is_final && transcript.trim()) {
        onTranscript(transcript.trim());
      }
    } catch (_) {}
  };

  return {
    send: (audio: Buffer) => {
      if (ws.readyState === 1 /* OPEN */) ws.send(audio);
    },
    close: () => {
      if (ws.readyState === 1) ws.close();
    },
  };
}
