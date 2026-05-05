"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Phone, Calendar, Shield, Zap, Star, TrendingUp, Users, Clock, ChevronRight, Play, Check } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: "#050508", color: "#f8fafc" }}>

      {/* ── NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between glass-card rounded-2xl px-6 py-3" style={{ backdropFilter: "blur(24px)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center text-white font-black text-sm">A</div>
            <span className="font-bold text-lg tracking-tight text-white">Aesthetic<span className="text-gradient ml-1">AI</span></span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {["Features", "How it works", "Pricing", "Testimonials"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="hover:text-white transition-colors duration-200 cursor-pointer">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-200 hover:text-white" style={{ color: "var(--text-secondary)" }}>
              Sign In
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm font-semibold text-white px-5 py-2.5 rounded-xl flex items-center gap-2">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center gradient-mesh grid-lines px-6 pt-24">
        {/* Orbs */}
        <div className="absolute top-32 left-1/4 w-96 h-96 rounded-full pulse-glow pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-32 right-1/4 w-64 h-64 rounded-full pulse-glow pointer-events-none" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", filter: "blur(40px)", animationDelay: "2s" }} />

        <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-8">
          {/* Badge */}
          <div className="badge-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold animated-border">
            <Sparkles size={14} />
            The First AI Receptionist for Aesthetic Clinics
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white">
            Never miss<br />
            <span className="text-gradient">a booking.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Deploy an intelligent AI agent that handles phone calls, answers patient queries,
            and books appointments <span className="text-white font-semibold">24/7 without double-booking</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link href="/dashboard" className="btn-primary text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-base">
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <button className="btn-secondary text-white font-semibold px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-base">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Play size={14} className="ml-0.5" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Social Proof Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <div className="flex -space-x-3">
              {["#7c3aed","#06b6d4","#f43f5e","#10b981","#f59e0b"].map((c, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ background: c, borderColor: "var(--bg-base)" }}>
                  {["J","M","S","L","K"][i]}
                </div>
              ))}
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="text-white font-semibold">500+ clinics</span> already use Aesthetic AI
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" className="text-yellow-500" />)}
              <span className="text-sm font-semibold text-white ml-1">4.9</span>
              <span className="text-sm ml-1" style={{ color: "var(--text-secondary)" }}>(127 reviews)</span>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative w-full max-w-4xl mt-12 float-slow">
            <div className="glass-card rounded-3xl p-1 glow-ring">
              <div className="rounded-[22px] overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid rgba(255,255,255,0.04)" }}>
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-4 bg-white/5 rounded-lg px-4 py-1.5 text-xs text-center" style={{ color: "var(--text-muted)" }}>
                    app.aesthetic-ai.com/dashboard
                  </div>
                </div>
                {/* Fake Dashboard Content */}
                <div className="p-6 grid grid-cols-3 gap-4 text-left">
                  {[
                    { label: "Calls Today", val: "47", trend: "+12%", color: "#7c3aed" },
                    { label: "Booked", val: "23", trend: "+8%", color: "#06b6d4" },
                    { label: "Revenue Saved", val: "$4.2k", trend: "+34%", color: "#10b981" },
                  ].map((s) => (
                    <div key={s.label} className="glass-card rounded-2xl p-4">
                      <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                      <div className="text-2xl font-black text-white">{s.val}</div>
                      <div className="text-xs font-semibold mt-1" style={{ color: s.color }}>{s.trend} this week</div>
                    </div>
                  ))}
                  <div className="col-span-3 glass-card rounded-2xl p-4">
                    <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Recent Calls</div>
                    {[
                      { name: "Sarah M.", service: "Botox Consultation", time: "2m ago", status: "Booked" },
                      { name: "Jennifer L.", service: "Filler Treatment", time: "15m ago", status: "Booked" },
                      { name: "Unknown", service: "General Inquiry", time: "32m ago", status: "Handled" },
                    ].map((call) => (
                      <div key={call.name} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full" style={{ background: "rgba(124,58,237,0.2)" }}>
                            <div className="w-full h-full rounded-full flex items-center justify-center text-[10px] font-bold text-purple-400">{call.name[0]}</div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{call.name}</div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{call.service}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>{call.status}</div>
                          <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{call.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6 relative">
        <div className="section-divider mb-20" />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: "99.9%", label: "Uptime SLA", icon: Zap, color: "#7c3aed" },
            { num: "< 2s", label: "Call Answer Time", icon: Clock, color: "#06b6d4" },
            { num: "500+", label: "Active Clinics", icon: Users, color: "#f43f5e" },
            { num: "4.2M+", label: "Calls Handled", icon: TrendingUp, color: "#10b981" },
          ].map((s, i) => (
            <div key={i} className="reveal text-center" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4" style={{ background: `${s.color}18` }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <div className="stat-num text-white">{s.num}</div>
              <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="section-divider mt-20" />
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Sparkles size={12} /> Everything you need
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Built for aesthetic clinics</h2>
            <p className="text-lg mt-4 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Every feature designed with one goal — more bookings, zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Phone,
                title: "24/7 Call Handling",
                desc: "Never let a call go to voicemail. Your AI receptionist answers instantly, in your clinic's voice, around the clock.",
                color: "#7c3aed",
                delay: 0,
              },
              {
                icon: Calendar,
                title: "Smart Scheduling",
                desc: "Deep Google Calendar integration prevents double-bookings. Sends reminders and handles rescheduling automatically.",
                color: "#06b6d4",
                delay: 100,
              },
              {
                icon: Shield,
                title: "Medical Safe",
                desc: "Strict guardrails prevent any medical advice. Complex questions are routed to your licensed staff every time.",
                color: "#f43f5e",
                delay: 200,
              },
            ].map((f, i) => (
              <div key={i} className="reveal noise-card glass-card glass-card-hover rounded-3xl p-8" style={{ transitionDelay: `${f.delay}ms` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                  <f.icon size={26} style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold cursor-pointer hover:gap-3 transition-all" style={{ color: f.color }}>
                  Learn more <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16 reveal">
            <div className="badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Zap size={12} /> Simple setup
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Live in under 10 minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (hidden on mobile) */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.6), rgba(6,182,212,0.6))" }} />
            {[
              { step: "01", title: "Tell it about your clinic", desc: "Set your services, hours, and tone in minutes using our intuitive builder." },
              { step: "02", title: "Connect your calendar", desc: "One-click Google Calendar integration. Your AI checks real-time availability instantly." },
              { step: "03", title: "Go live", desc: "Forward your clinic number or deploy on WhatsApp. Watch bookings roll in automatically." },
            ].map((s, i) => (
              <div key={i} className="reveal text-center relative" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="w-20 h-20 rounded-3xl glass-card glow-ring mx-auto flex items-center justify-center mb-6 font-black text-2xl text-gradient">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Star size={12} fill="currentColor" /> Loved by clinics
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Don't take our word for it</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Dr. Sarah Mitchell", role: "Medical Director, Glow Clinic", text: "We were losing 30% of calls to voicemail. Since deploying Aesthetic AI, we've captured every single inquiry. Revenue up 40% in 3 months.", rating: 5, color: "#7c3aed", delay: 0 },
              { name: "James Thornton", role: "Owner, Revive Aesthetics", text: "The setup took 8 minutes. I'm not kidding. Within the first week it had already booked 18 appointments we would have missed.", rating: 5, color: "#06b6d4", delay: 100 },
              { name: "Dr. Priya Sharma", role: "Founder, Luminous Med Spa", text: "My front desk team now focuses on in-clinic experience. The AI handles all the scheduling perfectly, never double-books, always professional.", rating: 5, color: "#f43f5e", delay: 200 },
            ].map((t, i) => (
              <div key={i} className="reveal noise-card glass-card glass-card-hover rounded-3xl p-8" style={{ transitionDelay: `${t.delay}ms` }}>
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" className="text-yellow-500" />)}
                </div>
                <p className="leading-relaxed mb-6 italic" style={{ color: "var(--text-secondary)" }}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: `${t.color}30`, border: `1px solid ${t.color}40` }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              Simple pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Pay as you grow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$99", period: "/mo", features: ["500 calls/month", "1 AI Agent", "Google Calendar", "Email support"], cta: "Start Free", highlight: false, delay: 0 },
              { name: "Growth", price: "$249", period: "/mo", features: ["2,500 calls/month", "3 AI Agents", "Google Calendar + CRM", "Post-call analytics", "Priority support"], cta: "Start Free Trial", highlight: true, badge: "Most Popular", delay: 100 },
              { name: "Scale", price: "$599", period: "/mo", features: ["Unlimited calls", "10 AI Agents", "Custom integrations", "Dedicated account manager", "White-label option"], cta: "Contact Sales", highlight: false, delay: 200 },
            ].map((plan, i) => (
              <div key={i} className={`reveal noise-card rounded-3xl p-8 relative ${plan.highlight ? "glow-ring" : "glass-card"}`}
                style={{ transitionDelay: `${plan.delay}ms`, background: plan.highlight ? "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(109,40,217,0.1) 100%)" : undefined, border: plan.highlight ? "1px solid rgba(124,58,237,0.5)" : undefined }}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-pill text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>{plan.name}</div>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    <span className="text-lg mb-1" style={{ color: "var(--text-secondary)" }}>{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <Check size={15} className="shrink-0" style={{ color: plan.highlight ? "#a78bfa" : "#10b981" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className={`block text-center font-bold py-3 rounded-xl transition-all ${plan.highlight ? "btn-primary text-white" : "btn-secondary text-white"}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto reveal">
          <div className="noise-card glass-card rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                Ready to automate<br />
                <span className="text-gradient">your front desk?</span>
              </h2>
              <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
                Join 500+ aesthetic clinics. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="btn-primary text-white font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg">
                  Start Free Trial <ArrowRight size={20} />
                </Link>
                <Link href="/dashboard" className="btn-secondary text-white font-semibold px-10 py-4 rounded-2xl text-lg">
                  Book a Demo
                </Link>
              </div>
              <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>14-day free trial · No credit card · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center text-white font-black text-sm">A</div>
              <span className="font-bold tracking-tight text-white">Aesthetic<span className="text-gradient ml-1">AI</span></span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              © 2026 Aesthetic AI. Built for aesthetic clinics worldwide.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
              {["Privacy", "Terms", "Contact"].map((item) => (
                <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
