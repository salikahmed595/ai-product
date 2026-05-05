"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Home, Bot, Zap, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agents", label: "Agents", icon: Bot },
    { href: "/templates", label: "Templates", icon: Users },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col p-4" style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--border-subtle)" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center text-white font-black text-sm">A</div>
        <span className="font-bold text-lg tracking-tight text-white">
          Aesthetic<span className="text-gradient ml-1">AI</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? "text-white"
                  : "hover:text-white"
              }`}
              style={
                isActive
                  ? { background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }
                  : { color: "var(--text-secondary)", border: "1px solid transparent" }
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#a78bfa" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom status card */}
      <div className="mt-auto pb-2">
        <div className="rounded-2xl p-4" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-sm font-semibold text-white">Aesthetic MVP</p>
          </div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Ready for calling</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#a78bfa" }}>
            <Zap size={11} />
            <span>AI Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
