-- Clinics Table
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  operating_days TEXT[] NOT NULL DEFAULT '{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}',
  working_hours TEXT NOT NULL DEFAULT '10:00-18:00',
  slot_duration INTEGER NOT NULL DEFAULT 30,
  twilio_number TEXT,
  twilio_account_sid TEXT,
  twilio_auth_token TEXT,
  llm_model TEXT DEFAULT 'gpt-4o-mini',
  google_access_token TEXT,
  google_refresh_token TEXT,
  google_calendar_id TEXT,
  system_prompt TEXT,
  voice_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slot Holds Table (For Double Booking Prevention)
CREATE TABLE slot_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  slot_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  service TEXT NOT NULL,
  slot_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call Logs Table
CREATE TABLE call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  duration INTEGER, -- in seconds
  status TEXT NOT NULL, -- 'answered', 'missed'
  outcome TEXT, -- 'booked', 'no_action', 'dropped'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Allow public access for MVP" ON clinics
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Users can manage slot holds for their clinics" ON slot_holds
  FOR ALL USING (
    clinic_id IN (SELECT id FROM clinics WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage appointments for their clinics" ON appointments
  FOR ALL USING (
    clinic_id IN (SELECT id FROM clinics WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view call logs for their clinics" ON call_logs
  FOR ALL USING (
    clinic_id IN (SELECT id FROM clinics WHERE user_id = auth.uid())
  );
