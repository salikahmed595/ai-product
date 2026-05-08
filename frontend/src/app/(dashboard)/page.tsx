"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Bot, LayoutDashboard, CalendarDays, Phone, ChevronRight,
  Zap, Shield, Clock, Globe, CheckCircle2, ArrowRight,
  Mic, Brain, PhoneCall, Star, Sparkles, Play, Users,
} from "lucide-react";

// ─── Gradient orb background ────────────────────────────────────────────────
function Orb({ x, y, size, color, opacity }: { x: string; y: string; size: number; color: string; opacity: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: color, opacity,
        filter: `blur(${size * 0.55}px)`,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

// ─── Feature card (clickable) ────────────────────────────────────────────────
function FeatureCard({
  href, icon: Icon, iconColor, iconBg, label, desc, badge,
}: {
  href: string; icon: any; iconColor: string; iconBg: string;
  label: string; desc: string; badge?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col p-6 rounded-2xl transition-all duration-300"
      style={{
        background: hovered ? "rgba(139,92,246,0.09)" : "rgba(27,24,64,0.6)",
        border: `1px solid ${hovered ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.12)"}`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 60px rgba(139,92,246,0.18)" : "none",
      }}>
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)" }}>
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: iconBg, border: `1px solid ${iconColor}30` }}>
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>{label}</h3>
      <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{desc}</p>
      <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold transition-all duration-200"
        style={{ color: hovered ? "#c4b5fd" : "rgba(139,92,246,0.5)" }}>
        Open <ChevronRight size={13} className={`transition-transform duration-200 ${hovered ? "translate-x-1" : ""}`} />
      </div>
    </Link>
  );
}

// ─── Step card ───────────────────────────────────────────────────────────────
function StepCard({ number, title, desc, icon: Icon, color, done }: {
  number: number; title: string; desc: string; icon: any; color: string; done?: boolean;
}) {
  return (
    <div className="relative flex gap-4">
      {/* connector line */}
      {number < 5 && (
        <div className="absolute left-5 top-12 w-px h-full"
          style={{ background: "linear-gradient(to bottom, rgba(139,92,246,0.3), transparent)" }} />
      )}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm z-10"
        style={{
          background: done ? "rgba(16,185,129,0.15)" : `${color}18`,
          border: `2px solid ${done ? "#10b981" : color}`,
          color: done ? "#10b981" : color,
        }}>
        {done ? <CheckCircle2 size={16} /> : number}
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={14} style={{ color }} />
          <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{title}</h4>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ value, label, icon: Icon, color }: { value: string; label: string; icon: any; color: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
      style={{ background: "rgba(27,24,64,0.7)", border: "1px solid rgba(139,92,246,0.15)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div className="font-black text-xl" style={{ color: "var(--text-primary)" }}>{value}</div>
        <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Pipeline step ───────────────────────────────────────────────────────────
function PipeStep({ label, sub, color }: { label: string; sub: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-full py-2.5 px-3 rounded-xl text-center"
        style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
        <div className="text-xs font-bold" style={{ color }}>{label}</div>
        <div className="text-[9px] mt-0.5" style={{ color: `${color}90` }}>{sub}</div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const callStatuses = ["Booking appointment...", "Checking availability...", "Confirming 3 PM slot...", "Sending calendar invite..."];

  return (
    <div className="relative max-w-7xl mx-auto space-y-16 pb-16 overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <Orb x="15%" y="20%" size={500} color="#7c3aed" opacity={0.06} />
        <Orb x="80%" y="10%" size={400} color="#4f46e5" opacity={0.05} />
        <Orb x="50%" y="60%" size={600} color="#7c3aed" opacity={0.04} />
        <Orb x="90%" y="80%" size={350} color="#06b6d4" opacity={0.04} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 pt-4">
          <div className="flex-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.28)" }}>
              <Sparkles size={11} style={{ color: "#c4b5fd" }} />
              <span className="text-xs font-bold" style={{ color: "#c4b5fd" }}>AI Calling Agent Platform</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6" style={{ color: "var(--text-primary)" }}>
              Your business<br />
              <span style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 40%, #c4b5fd 70%, #06b6d4 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                never misses a call
              </span>
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "var(--text-secondary)" }}>
              AestheticAI gives any business a 24/7 AI phone receptionist that answers calls, books appointments, syncs your calendar, and sends reminders — all without a human picking up the phone.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/agents"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}>
                <Zap size={15} /> Build Your Agent
              </Link>
              <Link href="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }}>
                <LayoutDashboard size={15} /> View Dashboard
              </Link>
            </div>
          </div>

          {/* Live call card */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(27,24,64,0.85)", border: "1px solid rgba(139,92,246,0.2)", boxShadow: "0 24px 80px rgba(124,58,237,0.2)" }}>
              {/* Header */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold" style={{ color: "#10b981" }}>Live Call Active</span>
                <span className="ml-auto text-xs tabular-nums font-mono" style={{ color: "var(--text-muted)" }}>00:01:47</span>
              </div>

              {/* Waveform */}
              <div className="flex items-center justify-center gap-0.5 mb-5 h-10">
                {Array.from({ length: 32 }).map((_, i) => {
                  const h = 8 + Math.sin((i + tick * 2) * 0.6) * 12 + Math.random() * 6;
                  return (
                    <div key={i} className="w-1 rounded-full transition-all duration-300"
                      style={{ height: `${h}px`, background: `rgba(139,92,246,${0.4 + Math.sin(i * 0.4) * 0.3})` }} />
                  );
                })}
              </div>

              {/* AI status */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
                <Brain size={13} style={{ color: "#a78bfa" }} />
                <span className="text-xs font-medium" style={{ color: "#c4b5fd" }}>
                  {callStatuses[tick % callStatuses.length]}
                </span>
              </div>

              {/* Pipeline */}
              <div className="flex items-center gap-1 mt-4">
                <PipeStep label="Twilio" sub="PSTN" color="#f59e0b" />
                <ArrowRight size={10} style={{ color: "rgba(139,92,246,0.3)", flexShrink: 0 }} />
                <PipeStep label="Deepgram" sub="STT" color="#06b6d4" />
                <ArrowRight size={10} style={{ color: "rgba(139,92,246,0.3)", flexShrink: 0 }} />
                <PipeStep label="Claude" sub="LLM" color="#8b5cf6" />
                <ArrowRight size={10} style={{ color: "rgba(139,92,246,0.3)", flexShrink: 0 }} />
                <PipeStep label="ElevenLabs" sub="TTS" color="#10b981" />
              </div>
            </div>
          </div>
        </div>

        {/* ── PROBLEM STATEMENT ─────────────────────────────────────────────── */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black mb-3" style={{ color: "var(--text-primary)" }}>
              Businesses lose revenue every day to missed calls
            </h2>
            <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              62% of callers who can't reach someone on the first try never call back.
              Every unanswered call is a lost booking, a lost patient, a lost client.
              We built the system that answers every single one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                problem: "Missed calls after hours",
                solution: "AI answers 24/7 — 2 AM, weekends, holidays",
                icon: Clock, color: "#f59e0b",
              },
              {
                problem: "Double bookings & scheduling chaos",
                solution: "Real-time slot holds prevent race conditions",
                icon: Shield, color: "#10b981",
              },
              {
                problem: "Receptionists cost $3,500/month",
                solution: "AI receptionist at a fraction of the cost",
                icon: Star, color: "#8b5cf6",
              },
            ].map(({ problem, solution, icon: Icon, color }) => (
              <div key={problem} className="rounded-2xl p-5"
                style={{ background: "rgba(27,24,64,0.6)", border: "1px solid rgba(139,92,246,0.12)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-sm" style={{ color: "#f87171" }}>✕</div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{problem}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={14} style={{ color, marginTop: "1px", flexShrink: 0 }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          <StatPill value="< 2s" label="AI response time" icon={Zap} color="#8b5cf6" />
          <StatPill value="24/7" label="Always available" icon={Clock} color="#10b981" />
          <StatPill value="0" label="Double bookings" icon={Shield} color="#06b6d4" />
          <StatPill value="100%" label="Calls answered" icon={PhoneCall} color="#f59e0b" />
        </div>

        {/* ── WHAT'S INSIDE ─────────────────────────────────────────────────── */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>Everything in one platform</h2>
          </div>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            One login. Every tool your business needs to automate inbound calls.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <FeatureCard
              href="/dashboard"
              icon={LayoutDashboard}
              iconColor="#8b5cf6"
              iconBg="rgba(139,92,246,0.12)"
              label="Analytics Dashboard"
              desc="See total calls, answered vs missed, average duration, recent bookings, and call logs — all in real time."
              badge="Live"
            />
            <FeatureCard
              href="/agents"
              icon={Bot}
              iconColor="#06b6d4"
              iconBg="rgba(6,182,212,0.12)"
              label="AI Agent Builder"
              desc="Configure your AI receptionist. Set services, working hours, voice, language, system prompt, and Twilio credentials."
              badge="Core"
            />
            <FeatureCard
              href="/calendar"
              icon={CalendarDays}
              iconColor="#10b981"
              iconBg="rgba(16,185,129,0.12)"
              label="Calendar & Scheduling"
              desc="Connect Google Calendar for automatic event creation. Embed Calendly for online booking. View all appointments in a month grid."
            />
            <FeatureCard
              href="/phone"
              icon={Phone}
              iconColor="#f59e0b"
              iconBg="rgba(245,158,11,0.12)"
              label="Twilio Phone Numbers"
              desc="Connect your own Twilio account. Get a dedicated phone number. Every call to that number routes through your AI agent."
            />
          </div>
        </div>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <div className="mt-16">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>How a call works</h2>
              <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                From ring to booked appointment in under 3 minutes, fully automated.
              </p>

              <div className="space-y-0">
                {[
                  { step: "Patient calls your Twilio number", desc: "Twilio sends a webhook to your backend and opens a real-time audio stream.", icon: PhoneCall, color: "#f59e0b" },
                  { step: "Deepgram converts speech to text", desc: "Sub-300ms streaming transcription. The AI hears every word instantly.", icon: Mic, color: "#06b6d4" },
                  { step: "Claude processes intent & books slot", desc: "The LLM extracts service, preferred time, patient name. Checks real availability. Creates a slot hold to prevent double-booking.", icon: Brain, color: "#8b5cf6" },
                  { step: "ElevenLabs speaks the response", desc: "Natural-sounding voice confirms the appointment back to the caller in their language.", icon: Globe, color: "#10b981" },
                  { step: "Google Calendar event + email fired", desc: "Appointment appears in your calendar with a 24-hour reminder. Notification email goes to the clinic.", icon: CalendarDays, color: "#a78bfa" },
                ].map(({ step, desc, icon, color }, i) => (
                  <StepCard key={step} number={i + 1} title={step} desc={desc} icon={icon} color={color} />
                ))}
              </div>
            </div>

            {/* ── GETTING STARTED GUIDE ────────────────────────────────────── */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="rounded-2xl p-6 sticky top-6"
                style={{ background: "rgba(27,24,64,0.85)", border: "1px solid rgba(139,92,246,0.22)", boxShadow: "0 24px 80px rgba(124,58,237,0.15)" }}>
                <div className="flex items-center gap-2 mb-5">
                  <Play size={14} style={{ color: "#c4b5fd" }} />
                  <h3 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    Launch your first agent in 5 steps
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      n: 1, href: "/agents", label: "Create an agent",
                      desc: "Go to Agents → Create Agent. Name it, pick a voice, set working hours.",
                      color: "#8b5cf6",
                    },
                    {
                      n: 2, href: "/agents", label: "Connect Twilio",
                      desc: "Paste your Twilio Account SID, Auth Token, and phone number into the agent settings.",
                      color: "#f59e0b",
                    },
                    {
                      n: 3, href: "/calendar", label: "Connect Google Calendar",
                      desc: "Go to Calendar → Connect with Google. OAuth flow takes 30 seconds.",
                      color: "#10b981",
                    },
                    {
                      n: 4, href: "/agents", label: "Write your system prompt",
                      desc: "Tell the AI your clinic name, services, and how to greet callers.",
                      color: "#06b6d4",
                    },
                    {
                      n: 5, href: "/dashboard", label: "Make a test call",
                      desc: "Call your Twilio number. Watch the booking appear in Dashboard → Appointments.",
                      color: "#a78bfa",
                    },
                  ].map(({ n, href, label, desc, color }) => (
                    <Link key={n} href={href}
                      className="flex gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.01] block"
                      style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.1)" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.1)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.04)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.1)";
                      }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
                        style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
                        {n}
                      </div>
                      <div>
                        <div className="text-xs font-bold mb-0.5 flex items-center gap-1" style={{ color: "var(--text-primary)" }}>
                          {label} <ChevronRight size={10} style={{ color }} />
                        </div>
                        <div className="text-[10px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link href="/agents"
                  className="mt-5 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white w-full transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
                  <Zap size={14} /> Start Building Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── WHO IS THIS FOR ───────────────────────────────────────────────── */}
        <div className="mt-16">
          <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Built for any service business</h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            If you have a phone number and appointments, we automate your inbound calls.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Aesthetic Clinics", emoji: "💆" },
              { label: "Dental Practices", emoji: "🦷" },
              { label: "Hair & Beauty", emoji: "💇" },
              { label: "Law Firms", emoji: "⚖️" },
              { label: "Physiotherapy", emoji: "🏃" },
              { label: "Any Business", emoji: "🏢" },
            ].map(({ label, emoji }) => (
              <div key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all duration-200 hover:scale-105 cursor-default"
                style={{ background: "rgba(27,24,64,0.6)", border: "1px solid rgba(139,92,246,0.12)" }}>
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-semibold leading-tight" style={{ color: "var(--text-secondary)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TECH TRUST ────────────────────────────────────────────────────── */}
        <div className="mt-16 rounded-2xl p-8 text-center"
          style={{ background: "rgba(27,24,64,0.6)", border: "1px solid rgba(139,92,246,0.15)" }}>
          <p className="text-xs font-semibold mb-5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Powered by world-class AI infrastructure
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { name: "Twilio", sub: "Telephony", color: "#f22f46" },
              { name: "Deepgram", sub: "Speech-to-Text", color: "#06b6d4" },
              { name: "Claude", sub: "LLM", color: "#8b5cf6" },
              { name: "ElevenLabs", sub: "Text-to-Speech", color: "#10b981" },
              { name: "Google Calendar", sub: "Scheduling", color: "#4285f4" },
              { name: "Supabase", sub: "Database", color: "#3ecf8e" },
            ].map(({ name, sub, color }) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                  style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
                  {name[0]}
                </div>
                <div className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{name}</div>
                <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
        <div className="mt-12 rounded-2xl p-10 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(79,70,229,0.12) 100%)", border: "1px solid rgba(139,92,246,0.28)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <Orb x="20%" y="50%" size={300} color="#7c3aed" opacity={0.12} />
            <Orb x="80%" y="50%" size={300} color="#4f46e5" opacity={0.1} />
          </div>
          <div className="relative">
            <Users size={32} className="mx-auto mb-4" style={{ color: "#a78bfa" }} />
            <h2 className="text-2xl font-black mb-3" style={{ color: "var(--text-primary)" }}>
              Ready to never miss a call again?
            </h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Set up your AI receptionist in under 10 minutes. No coding required.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/agents"
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 8px 24px rgba(124,58,237,0.5)" }}>
                <Bot size={16} /> Create Agent
              </Link>
              <Link href="/dashboard"
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-primary)" }}>
                <LayoutDashboard size={15} /> Go to Dashboard
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
