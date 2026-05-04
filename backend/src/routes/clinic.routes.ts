import type { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export default async function (server: FastifyInstance) {
  // GET existing clinic config
  server.get('/', async (request, reply) => {
    const { data, error } = await supabase.from('clinics').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') {
      server.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch clinic configuration' });
    }
    return { data };
  });

  // POST new clinic config
  server.post('/', async (request, reply) => {
    try {
      const body = request.body as any;
      const rawServices = body.services;
      const clinicData = {
        name: body.name,
        services: Array.isArray(rawServices)
          ? rawServices.map((s: string) => s.trim()).filter(Boolean)
          : rawServices.split(',').map((s: string) => s.trim()).filter(Boolean),
        timezone: body.timezone,
        operating_days: body.operatingDays,
        working_hours: body.workingHours,
        slot_duration: 30,
      };

      // Check if one exists
      const { data: existing } = await supabase.from('clinics').select('id').limit(1).single();

      let result;
      if (existing) {
        // Update
        result = await supabase.from('clinics').update(clinicData).eq('id', existing.id).select().single();
      } else {
        // Insert (No auth user linking for MVP since auth is skipped, or we can just leave user_id null for now)
        result = await supabase.from('clinics').insert([clinicData]).select().single();
      }

      if (result.error) {
        server.log.error(result.error);
        return reply.status(500).send({ error: 'Failed to save clinic configuration' });
      }

      return reply.send({ success: true, data: result.data });
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
