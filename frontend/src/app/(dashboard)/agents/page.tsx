"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Bot, ChevronRight, Activity, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTwilioWarning, setShowTwilioWarning] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/clinic`)
      .then(res => res.json())
      .then(res => {
        if (res.data) setAgents([res.data]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const hasAgentWithTwilio = agents.some(a => a.twilio_number);

  const handleCreateClick = (e: React.MouseEvent) => {
    if (hasAgentWithTwilio) {
      e.preventDefault();
      setShowTwilioWarning(true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Twilio conflict modal */}
      {showTwilioWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                <AlertTriangle size={20} style={{ color: "#f59e0b" }} />
              </div>
              <div>
                <h3 className="font-bold text-white">One number, one agent</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Twilio limitation</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              Each Twilio phone number can only be connected to <strong className="text-white">one AI agent</strong> at a time. You already have an agent with a connected number.
            </p>
            <div className="rounded-xl p-3 mb-5" style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <p className="text-xs leading-relaxed" style={{ color: "#fbbf24" }}>
                <strong>To create a second agent:</strong> get a new Twilio phone number from your Twilio console, then connect it to the new agent. Multiple numbers = multiple agents.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowTwilioWarning(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)" }}>
                Cancel
              </button>
              <Link href="/agents/default" onClick={() => setShowTwilioWarning(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white text-center"
                style={{ background: "rgba(245,158,11,0.7)" }}>
                Create Anyway
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Build and manage your AI calling agents
          </p>
        </div>
        <Link
          href="/agents/default"
          onClick={handleCreateClick}
          className="btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Create Agent
        </Link>
      </div>

      {/* One-number info strip */}
      {hasAgentWithTwilio && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-xs" style={{ background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.15)", color: "#06b6d4" }}>
          <Info size={13} className="shrink-0" />
          Each Twilio number powers exactly one agent. Need another agent? Get a second number at <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="underline">console.twilio.com</a>.
        </div>
      )}

      {/* Search */}
      <div className="mb-6 flex items-center px-4 py-2.5 rounded-xl w-full max-w-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <Search size={15} className="mr-2 shrink-0" style={{ color: "var(--text-muted)" }} />
        <input type="text" placeholder="Search agents..." className="bg-transparent border-none outline-none text-sm w-full text-white" />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Agent Name", "Model", "Voice", "Phone", "Last Edited", ""].map((h) => (
                <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                    Loading agents...
                  </div>
                </td>
              </tr>
            ) : agents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                      <Bot size={28} style={{ color: "#a78bfa" }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">No agents yet</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Create your first AI agent to get started</p>
                    </div>
                    <Link href="/agents/default" className="btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 mt-2">
                      <Plus size={15} /> Create Agent
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              agents.map((agent, i) => (
                <tr key={agent.id || i} className="group transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.04)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-6 py-4">
                    <Link href={`/agents/${agent.id || 'default'}`} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}>
                        <Bot size={16} style={{ color: "#a78bfa" }} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{agent.name || "Unnamed Agent"}</div>
                        <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "#10b981" }}>
                          <Activity size={10} />
                          Active
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}>
                      {agent.llm_model || "GPT-4o Mini"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: "rgba(167,139,250,0.2)" }}>V</div>
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{agent.voice_id ? "Custom" : "Rachel"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {agent.twilio_number || <span style={{ color: "var(--text-muted)" }}>Not assigned</span>}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                    {agent.updated_at ? new Date(agent.updated_at).toLocaleDateString() : "Just now"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/agents/${agent.id || 'default'}`} className="inline-flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all" style={{ color: "#a78bfa" }}>
                      Edit <ChevronRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
