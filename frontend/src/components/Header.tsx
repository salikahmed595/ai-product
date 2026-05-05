import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-10" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)", backdropFilter: "blur(12px)" }}>
      {/* Search */}
      <div className="flex items-center px-3 py-2 rounded-xl w-64" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <Search size={15} style={{ color: "var(--text-muted)" }} className="mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm w-full"
          style={{ color: "var(--text-secondary)" }}
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#f43f5e", boxShadow: "0 0 6px rgba(244,63,94,0.6)" }} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white" style={{ background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.4)" }}>
            Dr
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-white leading-none">Dr. Smith</span>
            <span className="text-xs mt-0.5 leading-none" style={{ color: "var(--text-muted)" }}>Clinic Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
