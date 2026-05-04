"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/clinic`)
      .then(res => res.json())
      .then(res => {
        // We currently only have 1 clinic supported in backend GET route, 
        // but we'll map it to an array for the table view.
        if (res.data) {
          setAgents([res.data]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-border/50">
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
          All Agents
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <Link
            href="/templates"
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            Create an Agent
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground font-medium border-b border-border/50 bg-gray-50/50">
            <tr>
              <th className="px-6 py-4">Agent Name</th>
              <th className="px-6 py-4">Agent Type</th>
              <th className="px-6 py-4">Voice</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Edited by</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  Loading agents...
                </td>
              </tr>
            ) : agents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No agents found. Click "Create an Agent" to get started.
                </td>
              </tr>
            ) : (
              agents.map((agent, i) => (
                <tr key={agent.id || i} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/agents/${agent.id || 'default'}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <span className="font-medium text-foreground hover:underline">{agent.name || "Unnamed Agent"}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">Single Prompt</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                        V
                      </div>
                      <span className="text-foreground">{agent.voice_id ? "Custom" : "Rachel"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{agent.twilio_number || "Not assigned"}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {agent.updated_at ? new Date(agent.updated_at).toLocaleString() : "Just now"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-5 h-5" />
                    </button>
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
