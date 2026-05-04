// Booking Service — slot generation, availability, hold system, confirmation
import { supabase } from '../lib/supabase.js';

// Generate 30-min slots between start and end times for a given date (YYYY-MM-DD)
export function generateSlots(date: string, workingHours: string): string[] {
  const parts = workingHours.split('-');
  const startParts = (parts[0] ?? '10:00').split(':');
  const endParts = (parts[1] ?? '18:00').split(':');
  let h = parseInt(startParts[0] ?? '10', 10);
  let m = parseInt(startParts[1] ?? '0', 10);
  const eH = parseInt(endParts[0] ?? '18', 10);
  const eM = parseInt(endParts[1] ?? '0', 10);

  const slots: string[] = [];
  while (h * 60 + m < eH * 60 + eM) {
    slots.push(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
    m += 30;
    if (m >= 60) { h++; m -= 60; }
  }
  return slots;
}

// Returns true if the slot is free (no booking AND no active hold)
export async function isSlotAvailable(clinicId: string, slotTime: string): Promise<boolean> {
  const [{ data: appt }, { data: hold }] = await Promise.all([
    supabase.from('appointments').select('id').eq('clinic_id', clinicId).eq('slot_time', slotTime).eq('status', 'confirmed').limit(1),
    supabase.from('slot_holds').select('id').eq('clinic_id', clinicId).eq('slot_time', slotTime).eq('status', 'pending').gt('expires_at', new Date().toISOString()).limit(1),
  ]);
  return !(appt?.length || hold?.length);
}

// Creates a 60-second temporary hold — returns holdId or null
export async function createHold(clinicId: string, slotTime: string): Promise<string | null> {
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  const { data, error } = await supabase
    .from('slot_holds')
    .insert([{ clinic_id: clinicId, slot_time: slotTime, status: 'pending', expires_at: expiresAt }])
    .select('id')
    .single();
  if (error) { console.error('Hold error:', error); return null; }
  return data?.id ?? null;
}

// Releases a hold
export async function releaseHold(holdId: string): Promise<void> {
  await supabase.from('slot_holds').delete().eq('id', holdId);
}

// Confirms booking: re-checks availability, inserts appointment, releases hold
export async function confirmBooking(params: {
  clinicId: string; holdId: string;
  patientName: string; patientPhone: string;
  service: string; slotTime: string;
}): Promise<boolean> {
  const available = await isSlotAvailable(params.clinicId, params.slotTime);
  if (!available) { await releaseHold(params.holdId); return false; }

  const { error } = await supabase.from('appointments').insert([{
    clinic_id: params.clinicId,
    patient_name: params.patientName,
    patient_phone: params.patientPhone,
    service: params.service,
    slot_time: params.slotTime,
    status: 'confirmed',
  }]);

  if (error) { console.error('Booking error:', error); return false; }
  await releaseHold(params.holdId);
  console.log(`✅ Booked: ${params.patientName} — ${params.service} at ${params.slotTime}`);
  return true;
}
