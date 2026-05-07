"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User";

  return (
    <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-10" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)", backdropFilter: "blur(12px)" }}>
      {/* Left space */}
      <div />

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#f43f5e", boxShadow: "0 0 6px rgba(244,63,94,0.6)" }} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white" style={{ background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.4)" }}>
            {initials}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-white leading-none">{displayName}</span>
            <span className="text-xs mt-0.5 leading-none" style={{ color: "var(--text-muted)" }}>Clinic Admin</span>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
