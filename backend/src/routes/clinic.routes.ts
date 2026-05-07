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

      const clinicData: Record<string, any> = { slot_duration: 30 };

      if (body.name !== undefined) clinicData.name = body.name;
      if (body.services !== undefined) {
        const raw = body.services;
        clinicData.services = Array.isArray(raw)
          ? raw.map((s: string) => s.trim()).filter(Boolean)
          : raw.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (body.timezone !== undefined) clinicData.timezone = body.timezone;
      if (body.operatingDays !== undefined) clinicData.operating_days = body.operatingDays;
      if (body.workingHours !== undefined) clinicData.working_hours = body.workingHours;
      if (body.system_prompt !== undefined) clinicData.system_prompt = body.system_prompt;
      if (body.voice_id !== undefined) clinicData.voice_id = body.voice_id;
      if (body.model !== undefined) clinicData.llm_model = body.model;
      if (body.twilio_account_sid !== undefined) clinicData.twilio_account_sid = body.twilio_account_sid;
      if (body.twilio_auth_token !== undefined) clinicData.twilio_auth_token = body.twilio_auth_token;
      if (body.twilio_number !== undefined) clinicData.twilio_number = body.twilio_number;

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
