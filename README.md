# AestheticAI — The AI Receptionist for Aesthetic Clinics

> *Your clinic never sleeps. Your receptionist does. We fixed that.*

AestheticAI is a full-stack SaaS platform that gives aesthetic clinics a 24/7 AI phone receptionist. It answers calls, books appointments into real calendar slots, sends confirmation emails, and never double-books — all without a human picking up the phone.

Built with Next.js, Fastify, Supabase, Twilio, Deepgram, ElevenLabs, and Claude.

---

## What it actually does

A patient calls the clinic's Twilio number at 11 PM. Instead of voicemail, they hear a natural-sounding AI voice that:

1. Greets them by clinic name
2. Asks what service they need
3. Checks real-time calendar availability
4. Offers specific 30-minute slots
5. Confirms the booking
6. Fires a Google Calendar event with a 24-hour email reminder
7. Sends a notification email to the clinic

No human involved. No double booking. No missed calls.

---

## Architecture

```
                          ┌─────────────────────────────────────────────┐
                          │              PATIENT CALL                    │
                          └────────────────────┬────────────────────────┘
                                               │
                                          Twilio PSTN
                                               │
                          ┌────────────────────▼────────────────────────┐
                          │           Twilio Webhook (POST)              │
                          │         /api/twilio/incoming-call            │
                          └────────────────────┬────────────────────────┘
                                               │
                          ┌────────────────────▼────────────────────────┐
                          │         Fastify Backend (Node.js)            │
                          │              port 8080                       │
                          │                                              │
                          │  ┌─────────────┐   ┌──────────────────────┐ │
                          │  │   WebSocket  │   │   REST API Routes    │ │
                          │  │  Audio Stream│   │  /api/clinic         │ │
                          │  └──────┬──────┘   │  /api/appointments   │ │
                          │         │           │  /api/calendar       │ │
                          │         │           │  /api/calls          │ │
                          │         │           │  /api/knowledge      │ │
                          │         │           └──────────────────────┘ │
                          └─────────┼───────────────────────────────────┘
                                    │
               ┌────────────────────┼────────────────────┐
               │                    │                    │
    ┌──────────▼──────┐  ┌──────────▼──────┐  ┌─────────▼────────┐
    │   Deepgram STT   │  │  Claude (LLM)   │  │  ElevenLabs TTS  │
    │  Speech → Text   │  │  Orchestrator   │  │  Text → Speech   │
    │  < 300ms latency │  │  Booking Logic  │  │  Natural Voice   │
    └─────────────────┘  └────────┬────────┘  └──────────────────┘
                                  │
               ┌──────────────────┼──────────────────┐
               │                  │                  │
    ┌──────────▼──────┐  ┌────────▼────────┐  ┌─────▼──────────┐
    │    Supabase      │  │ Google Calendar │  │    Nodemailer  │
    │   PostgreSQL     │  │   OAuth + API   │  │  Gmail SMTP    │
    │  Bookings, Holds │  │  Events + Reminders│ │ Notifications│
    └─────────────────┘  └─────────────────┘  └────────────────┘
```

---

## Double Booking Prevention

This was the hardest part to get right and the most important.

```
Patient A asks for 2:00 PM slot
        │
        ▼
  ┌─────────────────────────────┐
  │   Slot Hold Created (DB)    │  ← expires in 60 seconds
  │   { slot: "14:00",          │
  │     status: "pending" }     │
  └─────────────┬───────────────┘
                │
  Patient B asks for 2:00 PM while hold exists
                │
                ▼
  ┌─────────────────────────────┐
  │  AI sees slot is held →     │
  │  "That slot just filled up, │
  │   how about 2:30 PM?"       │
  └─────────────────────────────┘
                │
  Patient A confirms → hold removed → booking created
```

The calendar is the source of truth. The DB holds prevent race conditions between concurrent calls.

---

## Slot Scheduling Logic

```
Working Hours: 10:00 - 18:00
Slot Duration: 30 minutes (fixed, always)

allSlots    = [10:00, 10:30, 11:00, ... , 17:30]
bookedSlots = events pulled from Google Calendar
pendingHolds= DB rows with status = "pending"

availableSlots = allSlots - bookedSlots - pendingHolds
```

No arbitrary times. No 15-minute slots. No chaos.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 16 + TypeScript | App Router, SSR auth, fast |
| Backend | Fastify + Node.js | Faster than Express, WebSocket support |
| Database | Supabase (PostgreSQL) | Auth + DB + realtime in one |
| Auth | Supabase SSR + JWT | Server-validated, middleware-level |
| STT | Deepgram | Sub-300ms, streaming |
| LLM | Claude (Anthropic) | Best conversation quality |
| TTS | ElevenLabs | Most natural voices |
| Telephony | Twilio | Industry standard |
| Calendar | Google Calendar API | Full OAuth, real availability |
| Email | Nodemailer + Gmail SMTP | Appointment notifications |
| Scheduling | Calendly (embed) | Optional online booking page |

---

## Project Structure

```
hello/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── clinic.routes.ts        # Clinic config CRUD
│   │   │   ├── appointments.routes.ts  # Booking + holds
│   │   │   ├── calendar.routes.ts      # Google OAuth + event creation
│   │   │   ├── calls.routes.ts         # Call logs
│   │   │   ├── twilio.routes.ts        # Incoming call webhook
│   │   │   ├── ai.routes.ts            # LLM orchestration
│   │   │   ├── voices.routes.ts        # ElevenLabs voice picker
│   │   │   └── knowledge.routes.ts     # Clinic knowledge base
│   │   ├── services/
│   │   │   ├── calendar.service.ts     # Google Calendar events
│   │   │   └── email.service.ts        # Nodemailer notifications
│   │   ├── lib/
│   │   │   └── supabase.ts             # Service role client
│   │   └── server.ts                   # Fastify entry point
│   └── .env
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (dashboard)/
│       │   │   ├── agents/             # Agent builder
│       │   │   ├── calendar/           # Calendar + Calendly
│       │   │   ├── dashboard/          # Analytics
│       │   │   └── phone/              # Twilio numbers
│       │   └── login/                  # Auth page
│       ├── components/
│       │   └── Sidebar.tsx
│       └── middleware.ts               # Edge-level JWT auth guard
│
└── database/
    ├── schema.sql
    └── migration_001 → 004.sql
```

---

## Security

This was not an afterthought.

- **Middleware-level auth** — Every dashboard route runs through Next.js edge middleware. `getUser()` validates the JWT with Supabase auth servers on every request, not just a cookie check.
- **Two-layer guard** — Dashboard layout is an async Server Component that calls `getUser()` a second time as a defense-in-depth layer.
- **Open-redirect protection** — The `?redirectTo=` param only accepts paths starting with `/` and not `//`.
- **Service role key** — Backend Supabase client uses the service role key (bypasses RLS safely server-side). Never exposed to the frontend.
- **HTTP security headers** — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy on all routes.
- **Twilio per-clinic** — Each clinic's Twilio credentials are stored isolated in their own DB row. No shared platform account.

---

## Database Schema (key tables)

```sql
-- Core clinic config
clinics (
  id, name, services[], timezone, operating_days[],
  working_hours, slot_duration,
  twilio_account_sid, twilio_auth_token, twilio_number,
  google_access_token, google_refresh_token, google_calendar_id,
  calendar_email, notification_email,
  calendly_url, system_prompt, voice_id, llm_model,
  language, voice_speed, voice_volume
)

-- Every booking
appointments (
  id, clinic_id, patient_name, patient_phone,
  service, slot_time, status, created_at
)

-- Temporary slot holds (race condition prevention)
slot_holds (
  id, clinic_id, slot_time, status, expires_at
)

-- Call analytics
calls (
  id, clinic_id, phone_number, duration,
  status, outcome, created_at
)
```

---

## Running Locally

You need two terminals.

**Backend** (port 8080):
```bash
cd backend
npm install
npm run dev
```

**Frontend** (port 3000):
```bash
cd frontend
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

**`backend/.env`**
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8080/api/calendar/callback
FRONTEND_URL=http://localhost:3000

EMAIL_USER=
EMAIL_PASS=

ELEVENLABS_API_KEY=
DEEPGRAM_API_KEY=
ANTHROPIC_API_KEY=
```

**`frontend/.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

---

## AI Rules (Hard Constraints)

The AI receptionist has non-negotiable guardrails baked into the system prompt:

- Will **not** give medical advice
- Will **not** diagnose conditions
- Will **not** recommend treatments
- Will **only** book appointments and answer basic service questions
- Redirects every medical question to an in-person consultation

---

## Roadmap

- [ ] Barge-in support (caller interrupts AI mid-sentence)
- [ ] Outbound reminder calls
- [ ] Multi-clinic / multi-tenant
- [ ] SMS follow-ups
- [ ] Analytics dashboard v2
- [ ] Stripe billing

---

## Built by

Salik Ahmed — [salikahmed595@gmail.com](mailto:salikahmed595@gmail.com)

*If you're building something in the AI voice space and want to talk, reach out.*
