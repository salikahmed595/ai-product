import type { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export default async function (server: FastifyInstance) {
  // GET recent appointments
  server.get('/', async (request, reply) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('slot_time', { ascending: false })
      .limit(50);

    if (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch appointments' });
    }
    return { data };
  });

  // POST a new appointment (called by the booking engine)
  server.post('/', async (request, reply) => {
    try {
      const body = request.body as any;
      const { data: clinic } = await supabase.from('clinics').select('id').limit(1).single();
      if (!clinic) return reply.status(404).send({ error: 'No clinic configured' });

      // Prevent double booking — check if slot is already taken
      const { data: existing } = await supabase
        .from('appointments')
        .select('id')
        .eq('clinic_id', clinic.id)
        .eq('slot_time', body.slot_time)
        .eq('status', 'confirmed')
        .limit(1)
        .single();

      if (existing) {
        return reply.status(409).send({ error: 'Slot already booked' });
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          clinic_id: clinic.id,
          patient_name: body.patient_name,
          patient_phone: body.patient_phone,
          service: body.service,
          slot_time: body.slot_time,
          status: 'confirmed',
        }])
        .select()
        .single();

      if (error) {
        server.log.error(error);
        return reply.status(500).send({ error: 'Failed to create appointment' });
      }
      server.log.info(`✅ Appointment booked: ${body.patient_name} for ${body.service} at ${body.slot_time}`);
      return reply.status(201).send({ success: true, data });
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
