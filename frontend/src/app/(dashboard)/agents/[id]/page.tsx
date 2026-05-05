"use client";
import { useState, useEffect, useRef } from "react";
import { Save, ArrowLeft, Volume2, Bot, Plus, X, ChevronDown, Sparkles, Copy, Check } from "lucide-react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const MODELS = [
  { id: "gpt-4o-mini", label: "GPT-4o Mini", badge: "Default", color: "#10b981" },
  { id: "gpt-4o", label: "GPT-4o", badge: "Powerful", color: "#7c3aed" },
  { id: "gpt-4-turbo", label: "GPT-4 Turbo", badge: "Fast", color: "#06b6d4" },
  { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", badge: "Economy", color: "#f59e0b" },
];

const DEFAULT_VARIABLES = [
  { key: "patient_name", label: "Patient Name", example: "Sarah Johnson" },
  { key: "clinic_name", label: "Clinic Name", example: "Glow Aesthetics" },
  { key: "phone_number", label: "Phone Number", example: "+1 555-0123" },
  { key: "services", label: "Services Offered", example: "Botox, Fillers" },
  { key: "address", label: "Clinic Address", example: "123 Main St, NYC" },
  { key: "working_hours", label: "Working Hours", example: "Mon-Fri 9am-6pm" },
];

const CARD = { background: "rgba(17,17,24,0.9)", border: "1px solid rgba(255,255,255,0.07)" };
const MUTED = "var(--text-secondary)";

export default function AgentBuilder({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"llm"|"audio">("llm");
  const [model, setModel] = useState("gpt-4o-mini");
  const [modelOpen, setModelOpen] = useState(false);
  const [variables, setVariables] = useState(DEFAULT_VARIABLES);
  const [newVarKey, setNewVarKey] = useState("");
  const [newVarExample, setNewVarExample] = useState("");
  const [addingVar, setAddingVar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [testHistory, setTestHistory] = useState<{role:string;content:string}[]>([]);
  const [ttsInput, setTtsInput] = useState("Hello! Welcome to our clinic. How can I help you today?");
  const [audioUrl, setAudioUrl] = useState("");
  const [testingAudio, setTestingAudio] = useState(false);
  const [copied, setCopied] = useState("");
  const [prompt, setPrompt] = useState(
`You are a professional receptionist for {{clinic_name}}.

Your responsibilities:
- Book appointments for services: {{services}}
- Answer questions about the clinic at {{address}}
- Available hours: {{working_hours}}

When a patient calls:
1. Greet them warmly and ask for their name
2. Understand what service they need
3. Check availability and book their appointment
4. Confirm all details before ending the call

STRICT RULES:
- Never give medical advice
- Keep responses concise (1-2 sentences)
- Always collect: patient name, service, preferred date/time`
  );
  const [formData, setFormData] = useState({ name: "My Agent", voice_id: "21m00Tcm4TlvDq8ikWAM" });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/clinic`).then(r => r.json()).then(r => {
      if (r.data) {
        setFormData({ name: r.data.name || "My Agent", voice_id: r.data.voice_id || "21m00Tcm4TlvDq8ikWAM" });
        if (r.data.system_prompt) setPrompt(r.data.system_prompt);
        if (r.data.model) setModel(r.data.model);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [testHistory]);

  const insertVariable = (key: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const tag = `{{${key}}}`;
    setPrompt(prompt.slice(0, start) + tag + prompt.slice(end));
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + tag.length; ta.focus(); }, 0);
  };

  const copyTag = (key: string) => {
    navigator.clipboard.writeText(`{{${key}}}`);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${BACKEND_URL}/api/clinic`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, system_prompt: prompt, model }),
    }).catch(() => {});
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const handleTestLLM = async () => {
    if (!testInput.trim() || testing) return;
    const msg = testInput; setTestInput("");
    const hist = [...testHistory, { role: "user", content: msg }];
    setTestHistory(hist); setTesting(true);
    try {
      const r = await fetch(`${BACKEND_URL}/api/ai/test`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: testHistory, config: { system_prompt: prompt, model } }),
      });
      const d = await r.json();
      setTestHistory([...hist, { role: "assistant", content: d.response || "Error" }]);
    } catch { setTestHistory([...hist, { role: "assistant", content: "Connection error." }]); }
    setTesting(false);
  };

  const handleTestAudio = async () => {
    if (!ttsInput.trim() || testingAudio) return;
    setTestingAudio(true);
    try {
      const r = await fetch(`${BACKEND_URL}/api/ai/tts`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ttsInput, voice_id: formData.voice_id }),
      });
      const d = await r.json();
      if (d.audio) setAudioUrl(d.audio);
    } catch {}
    setTestingAudio(false);
  };

  const addVariable = () => {
    if (!newVarKey.trim()) return;
    setVariables([...variables, { key: newVarKey.replace(/\s+/g, "_").toLowerCase(), label: newVarKey, example: newVarExample }]);
    setNewVarKey(""); setNewVarExample(""); setAddingVar(false);
  };

  const removeVariable = (key: string) => setVariables(variables.filter(v => v.key !== key));
  const selectedModel = MODELS.find(m => m.id === model) || MODELS[0];

  const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", outline: "none", borderRadius: "12px" };
  const labelStyle = { color: "var(--text-muted)", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.08em", fontWeight: 600 };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <Link href="/agents" className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)", color: MUTED }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="font-bold text-lg bg-transparent border-none focus:outline-none text-white p-0 w-48" />
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>ID: ag_{params.id}</div>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg" style={{ background: `${selectedModel.color}18`, color: selectedModel.color, border: `1px solid ${selectedModel.color}30` }}>
            {selectedModel.label}
          </span>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          {saved ? <><Check size={15} /> Saved!</> : saving ? "Saving..." : <><Save size={15} /> Publish</>}
        </button>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-1 gap-5 overflow-hidden">

        {/* COL 1: Prompt Editor */}
        <div className="flex flex-col rounded-2xl overflow-hidden" style={{ width: "38%", ...CARD }}>
          <div className="px-4 py-3 flex items-center gap-2 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Bot size={15} style={{ color: "#a78bfa" }} />
            <span className="text-sm font-semibold text-white">System Prompt</span>
          </div>

          {/* Variable Insert Bar */}
          <div className="px-3 py-2 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={11} style={{ color: "#a78bfa" }} />
              <span style={{ ...labelStyle }}>Insert Variable</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {variables.map(v => (
                <button key={v.key} onClick={() => insertVariable(v.key)}
                  className="group flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5"
                  style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}>
                  {`{{${v.key}}}`}
                </button>
              ))}
            </div>
          </div>

          <textarea ref={textareaRef} value={prompt} onChange={e => setPrompt(e.target.value)}
            className="flex-1 p-4 bg-transparent text-sm font-mono leading-relaxed resize-none focus:outline-none custom-scrollbar"
            style={{ color: "#e2e8f0" }} placeholder="Write your system prompt here..." />
        </div>

        {/* COL 2: Settings */}
        <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar" style={{ width: "28%", paddingRight: "4px" }}>

          {/* Model Selector */}
          <div className="rounded-2xl p-4" style={CARD}>
            <div style={labelStyle} className="mb-3">AI Model</div>
            <div className="relative">
              <button onClick={() => setModelOpen(!modelOpen)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-white transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: selectedModel.color }} />
                  {selectedModel.label}
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${selectedModel.color}20`, color: selectedModel.color }}>{selectedModel.badge}</span>
                </div>
                <ChevronDown size={14} style={{ color: MUTED, transform: modelOpen ? "rotate(180deg)" : "none", transition: "0.2s" }} />
              </button>
              {modelOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20" style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {MODELS.map(m => (
                    <button key={m.id} onClick={() => { setModel(m.id); setModelOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
                      style={{ color: model === m.id ? "white" : MUTED }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                        {m.label}
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${m.color}20`, color: m.color }}>{m.badge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variables Manager */}
          <div className="rounded-2xl p-4" style={CARD}>
            <div className="flex items-center justify-between mb-3">
              <div style={labelStyle}>Variables</div>
              <button onClick={() => setAddingVar(true)} className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-colors hover:text-white" style={{ color: "#a78bfa", background: "rgba(124,58,237,0.1)" }}>
                <Plus size={11} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {variables.map(v => (
                <div key={v.key} className="flex items-center justify-between rounded-lg px-3 py-2 group" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-purple-400 truncate">{`{{${v.key}}}`}</div>
                    <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>e.g. {v.example}</div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyTag(v.key)} className="p-1 rounded hover:bg-white/10 transition-colors" style={{ color: MUTED }}>
                      {copied === v.key ? <Check size={11} style={{ color: "#10b981" }} /> : <Copy size={11} />}
                    </button>
                    {!DEFAULT_VARIABLES.find(d => d.key === v.key) && (
                      <button onClick={() => removeVariable(v.key)} className="p-1 rounded hover:bg-red-500/10 transition-colors" style={{ color: "var(--text-muted)" }}>
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {addingVar && (
                <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <input value={newVarKey} onChange={e => setNewVarKey(e.target.value)} placeholder="variable_name" className="w-full px-3 py-2 text-xs rounded-lg"
                    style={{ ...inputStyle, fontFamily: "monospace" }} />
                  <input value={newVarExample} onChange={e => setNewVarExample(e.target.value)} placeholder="Example value" className="w-full px-3 py-2 text-xs rounded-lg" style={inputStyle} />
                  <div className="flex gap-2">
                    <button onClick={addVariable} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "rgba(124,58,237,0.6)" }}>Add</button>
                    <button onClick={() => setAddingVar(false)} className="flex-1 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.05)", color: MUTED }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voice Settings */}
          <div className="rounded-2xl p-4" style={CARD}>
            <div style={labelStyle} className="mb-3">Voice Settings</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs mb-1.5 text-white">Voice ID</div>
                <input value={formData.voice_id} onChange={e => setFormData({ ...formData, voice_id: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl font-mono" style={inputStyle} placeholder="ElevenLabs voice ID" />
              </div>
              {[{ label: "Speed", min: 0.5, max: 2, step: 0.1, default: 1 }, { label: "Stability", min: 0, max: 1, step: 0.1, default: 0.7 }].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-white">{s.label}</span>
                    <span className="text-xs font-mono" style={{ color: "#a78bfa" }}>{s.default}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} defaultValue={s.default} className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#7c3aed" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Call Settings */}
          <div className="rounded-2xl p-4" style={CARD}>
            <div style={labelStyle} className="mb-3">Call Settings</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white">Max Duration</span>
                  <span className="text-xs font-mono" style={{ color: "#a78bfa" }}>30 min</span>
                </div>
                <input type="range" min={1} max={120} defaultValue={30} className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#7c3aed" }} />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white">Responsiveness</span>
                  <span className="text-xs font-mono" style={{ color: "#a78bfa" }}>600ms</span>
                </div>
                <input type="range" min={100} max={3000} defaultValue={600} className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#7c3aed" }} />
              </div>
            </div>
          </div>
        </div>

        {/* COL 3: Test Pane */}
        <div className="flex flex-col rounded-2xl overflow-hidden" style={{ flex: 1, ...CARD }}>
          {/* Tab Header */}
          <div className="flex shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {(["llm", "audio"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 py-3.5 text-sm font-semibold transition-all"
                style={{ color: activeTab === tab ? "white" : MUTED, borderBottom: `2px solid ${activeTab === tab ? "#7c3aed" : "transparent"}`, background: "transparent" }}>
                {tab === "llm" ? "Test LLM" : "Test Audio"}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {activeTab === "llm" ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-3">
                  {testHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                        <Bot size={22} style={{ color: "#a78bfa" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Test your agent</p>
                        <p className="text-xs mt-1" style={{ color: MUTED }}>Chat to see how your agent responds based on the system prompt</p>
                      </div>
                    </div>
                  )}
                  {testHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                        style={msg.role === "user"
                          ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", borderBottomRightRadius: "4px" }
                          : { background: "rgba(255,255,255,0.06)", color: "#e2e8f0", borderBottomLeftRadius: "4px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {testing && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {[0, 0.15, 0.3].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#a78bfa", animationDelay: `${d}s` }} />)}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2 shrink-0">
                  <input value={testInput} onChange={e => setTestInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleTestLLM()}
                    placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl text-sm min-w-0"
                    style={{ ...inputStyle }} />
                  <button onClick={handleTestLLM} disabled={testing || !testInput.trim()}
                    className="btn-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 shrink-0">
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Voice Testing</p>
                  <p className="text-xs mb-3" style={{ color: MUTED }}>Type text to hear how your agent sounds</p>
                  <textarea value={ttsInput} onChange={e => setTtsInput(e.target.value)} rows={4}
                    className="w-full px-4 py-3 text-sm rounded-xl resize-none focus:outline-none custom-scrollbar"
                    style={{ ...inputStyle }} />
                  <button onClick={handleTestAudio} disabled={testingAudio || !ttsInput.trim()}
                    className="btn-primary text-white w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-3 disabled:opacity-40">
                    <Volume2 size={16} />
                    {testingAudio ? "Generating..." : "Generate Speech"}
                  </button>
                </div>
                {audioUrl && (
                  <div className="p-4 rounded-xl" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: "#a78bfa" }}>AUDIO PREVIEW</p>
                    <audio controls src={audioUrl} autoPlay className="w-full h-8" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
