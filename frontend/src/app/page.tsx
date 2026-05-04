import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-8 flex justify-between items-center border-b border-border/50 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            A
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Aesthetic AI</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-foreground hover:bg-muted px-4 py-2 rounded-xl transition-colors">
            Sign In
          </Link>
          <Link href="/dashboard" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="pt-32 pb-20 px-8 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 border border-primary/20">
            <Sparkles size={16} /> The First AI Receptionist for Aesthetic Clinics
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Never miss a booking. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Automate your clinic.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            Deploy an intelligent AI agent that handles phone calls, answers patient queries, and books appointments 24/7 without double-booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link href="#demo" className="bg-surface text-foreground border border-border px-8 py-4 rounded-full font-bold text-lg hover:bg-muted transition-colors">
              Book a Demo
            </Link>
          </div>
        </section>

        <section className="py-20 px-8 bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              title="24/7 Call Handling" 
              description="Never let a call go to voicemail again. Our AI answers instantly, with zero wait times."
            />
            <FeatureCard 
              title="Smart Booking" 
              description="Seamless integration with your Google Calendar ensures no double bookings, ever."
            />
            <FeatureCard 
              title="Medical Safety" 
              description="Strictly adheres to guidelines. Refers medical questions to your staff while handling admin."
            />
          </div>
        </section>
      </main>
      
      <footer className="py-10 px-8 text-center text-muted-foreground border-t border-border bg-surface">
        <p>&copy; 2026 Aesthetic AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: any) {
  return (
    <div className="bg-background p-8 rounded-3xl border border-border shadow-sm flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
        <CheckCircle2 size={24} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
