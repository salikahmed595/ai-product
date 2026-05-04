"use client";

import { PhoneCall, PhoneMissed, PhoneIncoming, Clock, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function Dashboard() {
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, answered: 0, missed: 0, avgDuration: "—" });

  useEffect(() => {
    // Fetch call logs
    fetch(`${BACKEND_URL}/api/calls`)
      .then(r => r.json())
      .then(d => {
        const logs = d.data || [];
        setCallLogs(logs.slice(0, 5));
        const answered = logs.filter((l: any) => l.status === "answered").length;
        const missed = logs.filter((l: any) => l.status === "missed").length;
        const durations = logs.filter((l: any) => l.duration).map((l: any) => l.duration);
        const avg = durations.length ? Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length) : 0;
        const mins = Math.floor(avg / 60);
        const secs = avg % 60;
        setMetrics({ total: logs.length, answered, missed, avgDuration: logs.length ? `${mins}m ${secs}s` : "—" });
      })
      .catch(() => {}); // Gracefully fail if backend is not running

    // Fetch appointments
    fetch(`${BACKEND_URL}/api/appointments`)
      .then(r => r.json())
      .then(d => setAppointments((d.data || []).slice(0, 5)))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your clinic's AI receptionist performance.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Calls" value={String(metrics.total)} icon={<PhoneCall className="text-primary" />} />
        <MetricCard title="Answered" value={String(metrics.answered)} icon={<PhoneIncoming className="text-green-500" />} />
        <MetricCard title="Missed" value={String(metrics.missed)} icon={<PhoneMissed className="text-red-500" />} trendDown />
        <MetricCard title="Avg Duration" value={metrics.avgDuration} icon={<Clock className="text-blue-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments Table */}
        <div className="bg-surface rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Appointments</h2>
            <button className="text-sm text-primary font-medium hover:underline flex items-center">
              View all <ArrowUpRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 rounded-r-lg font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground text-sm">No appointments yet</td></tr>
                ) : appointments.map((a: any) => (
                  <TableRow key={a.id} patient={a.patient_name} service={a.service} time={new Date(a.slot_time).toLocaleString()} status={a.status} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call Logs Table */}
        <div className="bg-surface rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Call Logs</h2>
            <button className="text-sm text-primary font-medium hover:underline flex items-center">
              View all <ArrowUpRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg font-medium">Phone Number</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 rounded-r-lg font-medium">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {callLogs.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground text-sm">No call logs yet</td></tr>
                ) : callLogs.map((log: any) => {
                  const mins = Math.floor((log.duration || 0) / 60);
                  const secs = (log.duration || 0) % 60;
                  return <CallRow key={log.id} phone={log.phone_number} duration={log.duration ? `${mins}m ${secs}s` : "—"} outcome={log.outcome || log.status} />;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, trendDown = false }: any) {
  return (
    <div className="bg-surface p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-muted rounded-xl">{icon}</div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendDown ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
      </div>
    </div>
  );
}

function TableRow({ patient, service, time, status }: any) {
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-4 font-medium text-foreground">{patient}</td>
      <td className="px-4 py-4 text-muted-foreground">{service}</td>
      <td className="px-4 py-4 text-muted-foreground">{time}</td>
      <td className="px-4 py-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

function CallRow({ phone, duration, outcome }: any) {
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-4 font-medium text-foreground">{phone}</td>
      <td className="px-4 py-4 text-muted-foreground">{duration}</td>
      <td className="px-4 py-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          outcome === 'Booked' ? 'bg-primary/10 text-primary' : 
          outcome === 'Dropped' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {outcome}
        </span>
      </td>
    </tr>
  );
}
