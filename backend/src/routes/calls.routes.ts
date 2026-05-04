import type { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase.js';

export default async function (server: FastifyInstance) {
  // GET recent call logs
  server.get('/', async (request, reply) => {
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch call logs' });
    }
    return { data };
  });

  // POST a new call log (called by the call engine)
  server.post('/', async (request, reply) => {
    try {
      const body = request.body as any;
      const { data: clinic } = await supabase.from('clinics').select('id').limit(1).single();
      if (!clinic) return reply.status(404).send({ error: 'No clinic configured' });

      const { data, error } = await supabase
        .from('call_logs')
        .insert([{
          clinic_id: clinic.id,
          phone_number: body.phone_number,
          duration: body.duration,
          status: body.status,
          outcome: body.outcome,
        }])
        .select()
        .single();

      if (error) {
        server.log.error(error);
        return reply.status(500).send({ error: 'Failed to save call log' });
      }
      server.log.info(`📋 Call log saved: ${body.status} from ${body.phone_number}`);
      return reply.send({ success: true, data });
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
