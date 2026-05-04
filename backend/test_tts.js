import dotenv from 'dotenv';
dotenv.config();

async function testTTS() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voice = '21m00Tcm4TlvDq8ikWAM';
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;

  console.log("Using API Key:", apiKey ? "Present" : "Missing");

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "hello",
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("ElevenLabs error:", response.status, response.statusText);
      console.error(text);
    } else {
      console.log("Success");
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testTTS();
