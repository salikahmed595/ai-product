"use client";

import { useState, useEffect } from "react";
import { Phone, Link2, Check, AlertCircle, Eye, EyeOff, ExternalLink, Wifi, WifiOff, RefreshCw } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function PhonePage() {
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/clinic`)
      .then(r => r.json())
      .then(r => {
        if (r.data) {
          setAccountSid(r.data.twilio_account_sid || "");
          setAuthToken(r.data.twilio_auth_token || "");
          setPhoneNumber(r.data.twilio_number || "");
          setConnected(Boolean(r.data.twilio_account_sid && r.data.twilio_auth_token && r.data.twilio_number));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleConnect = async () => {
    setError("");
    if (!accountSid.trim() || !authToken.trim() || !phoneNumber.trim()) {
      setError("All three fields are required to connect your Twilio account.");
      return;
    }
    setSaving(true);
    try {
      const r = await fetch(`${BACKEND_URL}/api/clinic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twilio_account_sid: accountSid.trim(),
          twilio_auth_token: authToken.trim(),
          twilio_number: phoneNumber.trim(),
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error();
      setConnected(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Make sure the backend is running on port 8080.");
    }
    setSaving(false);
  };

  const handleDisconnect = async () => {
    setSaving(true);
    try {
      await fetch(`${BACKEND_URL}/api/clinic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twilio_account_sid: "", twilio_auth_token: "", twilio_number: "" }),
      });
      setAccountSid(""); setAuthToken(""); setPhoneNumber("");
      setConnected(false);
    } catch {}
    setSaving(false);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    borderRadius: "12px",
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Phone Numbers</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Connect your Twilio account to enable AI phone calling
        </p>
      </div>

      {/* Connection Status Banner */}
      <div className="rounded-2xl p-5 mb-6 flex items-center justify-between"
        style={{
          background: connected ? "rgba(16,185,129,0.08)" : "rgba(124,58,237,0.06)",
          border: connected ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(124,58,237,0.2)",
        }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: connected ? "rgba(16,185,129,0.15)" : "rgba(124,58,237,0.15)" }}>
            {connected ? <Wifi size={20} style={{ color: "#10b981" }} /> : <WifiOff size={20} style={{ color: "#a78bfa" }} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {connected ? "Twilio Connected" : "Twilio Not Connected"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {connected ? phoneNumber : "Add your credentials below to enable phone calls"}
            </p>
          </div>
        </div>
        {connected && (
          <button onClick={handleDisconnect} disabled={saving}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            Disconnect
          </button>
        )}
      </div>

      {/* Steps Guide */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: "rgba(17,17,24,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>How to connect</p>
        <div className="space-y-3">
          {[
            { step: "1", text: "Create a free Twilio account at twilio.com" },
            { step: "2", text: 'Buy a phone number in the Twilio console (around $1/month)' },
            { step: "3", text: "Copy your Account SID and Auth Token from the Twilio dashboard" },
            { step: "4", text: "Paste them below and click Connect" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                style={{ background: "rgba(124,58,237,0.4)" }}>{step}</div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{text}</p>
            </div>
          ))}
        </div>
        <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: "#a78bfa" }}>
          Open Twilio Console <ExternalLink size={12} />
        </a>
      </div>

      {/* Credentials Form */}
      <div className="rounded-2xl p-6" style={{ background: "rgba(17,17,24,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 mb-5">
          <Phone size={16} style={{ color: "#a78bfa" }} />
          <h2 className="text-sm font-semibold text-white">Twilio Credentials</h2>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Account SID */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Account SID
            </label>
            <input
              value={accountSid}
              onChange={e => setAccountSid(e.target.value)}
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 text-sm font-mono"
              style={inputStyle}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Found on your Twilio Console dashboard
            </p>
          </div>

          {/* Auth Token */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Auth Token
            </label>
            <div className="relative">
              <input
                value={authToken}
                onChange={e => setAuthToken(e.target.value)}
                type={showToken ? "text" : "password"}
                placeholder="••••••••••••••••••••••••••••••••"
                className="w-full px-4 py-3 text-sm font-mono pr-20"
                style={inputStyle}
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}>
                {showToken ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
              </button>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Found next to your Account SID — keep this secret
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Twilio Phone Number
            </label>
            <input
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="+15551234567"
              className="w-full px-4 py-3 text-sm font-mono"
              style={inputStyle}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Include country code — e.g. +1 for US numbers
            </p>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={saving}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 mt-2 transition-all"
            style={{
              background: saved
                ? "rgba(16,185,129,0.7)"
                : saving
                ? "rgba(124,58,237,0.4)"
                : "var(--accent, #7c3aed)",
            }}>
            {saving ? (
              <><RefreshCw size={16} className="animate-spin" /> Connecting...</>
            ) : saved ? (
              <><Check size={16} /> Connected Successfully!</>
            ) : (
              <><Link2 size={16} /> {connected ? "Update Connection" : "Connect Twilio Account"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
