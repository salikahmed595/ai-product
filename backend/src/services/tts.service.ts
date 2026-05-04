// TTS Service — ElevenLabs, returns mulaw-8000 Buffer for Twilio

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1/text-to-speech';

export async function textToSpeech(text: string): Promise<Buffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

  if (!apiKey) {
    console.warn('⚠️ ELEVENLABS_API_KEY not set — TTS skipped');
    return null;
  }

  try {
    const res = await fetch(`${ELEVENLABS_BASE}/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/basic',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2',
        output_format: 'ulaw_8000',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!res.ok) {
      console.error('ElevenLabs error:', res.status, await res.text());
      return null;
    }

    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error('TTS fetch error:', err);
    return null;
  }
}
