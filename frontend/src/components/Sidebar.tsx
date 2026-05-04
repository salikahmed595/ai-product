"use client";

import Link from "next/link";
import { LayoutDashboard, Users, UserCog, Home, Bot } from "lucide-react";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: <Home size={20} /> },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/agents", label: "Agents", icon: <Bot size={20} /> },
    { href: "/templates", label: "Templates", icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border h-screen sticky top-0 flex flex-col p-4 shadow-sm">
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
          A
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">Aesthetic AI</span>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              {icon}
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pb-4">
        <div className="px-3 py-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-sm font-medium text-foreground">Aesthetic MVP</p>
          <p className="text-xs text-muted-foreground mt-1">Ready for calling</p>
        </div>
      </div>
    </aside>
  );
}
