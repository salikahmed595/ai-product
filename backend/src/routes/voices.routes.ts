import { FastifyInstance } from 'fastify';

export async function voicesRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return reply.status(503).send({ error: 'ElevenLabs API key not configured' });
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': apiKey },
      });

      if (!response.ok) {
        return reply.status(response.status).send({ error: 'ElevenLabs API error' });
      }

      const data = (await response.json()) as any;

      const voices = (data.voices || []).map((v: any) => ({
        voice_id: v.voice_id,
        name: v.name,
        preview_url: v.preview_url || null,
        gender: v.labels?.gender || 'unknown',
        accent: v.labels?.accent || '',
        description: v.labels?.description || '',
        age: v.labels?.age || '',
        use_case: v.labels?.use_case || '',
        category: v.category || 'premade',
      }));

      // Sort: known gender first, then alphabetically within gender
      voices.sort((a: any, b: any) => {
        const gOrder: Record<string, number> = { female: 0, male: 1, unknown: 2 };
        const gDiff = (gOrder[a.gender] ?? 2) - (gOrder[b.gender] ?? 2);
        if (gDiff !== 0) return gDiff;
        return a.name.localeCompare(b.name);
      });

      return reply.send({ voices });
    } catch (err) {
      return reply.status(500).send({ error: 'Failed to fetch voices from ElevenLabs' });
    }
  });
}
