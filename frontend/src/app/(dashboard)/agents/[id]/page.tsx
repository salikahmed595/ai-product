"use client";

import { useState, useEffect } from "react";
import { Mic, Save, Settings, Database, Volume2, PhoneCall, Link as LinkIcon, Bot, ArrowLeft, Puzzle, Book, Type, Phone, FileText, Shield, Globe, Box, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function AgentBuilder({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const templateName = searchParams.get('template');
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("audio"); // 'audio' or 'llm'
  const [testInput, setTestInput] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [testHistory, setTestHistory] = useState<{role: string, content: string}[]>([]);
  const [testing, setTesting] = useState(false);

  const [formData, setFormData] = useState({
    name: templateName || "New Agent",
    services: "Botox, Fillers",
    timezone: "America/New_York",
    operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "10:00-18:00",
    system_prompt: "You are a helpful and polite receptionist...",
    voice_id: "21m00Tcm4TlvDq8ikWAM"
  });

  useEffect(() => {
    // If not creating from template, fetch existing config
    fetch(`${BACKEND_URL}/api/clinic`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setFormData({
            name: res.data.name,
            services: res.data.services.join(", "),
            timezone: res.data.timezone,
            operatingDays: res.data.operating_days || [],
            workingHours: res.data.working_hours,
            system_prompt: res.data.system_prompt || "You are a professional receptionist for an aesthetic clinic.\nResponsibilities: book appointments, answer basic service questions, guide patients politely.\nSTRICT RULES:\n- do NOT give medical advice or diagnose\n- redirect all medical questions to a consultation\n- keep responses short (1-2 sentences max)\n- ask one question at a time\n- confirm all booking details before finalizing\nWhen booking, collect: patient name, service requested, preferred date and time.\nRespond ONLY with what you would say to the patient.",
            voice_id: res.data.voice_id || "21m00Tcm4TlvDq8ikWAM"
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/clinic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save");
      alert("Agent saved successfully!");
    } catch (err) {
      alert("Error saving agent config.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleTestLLM = async () => {
    if (!testInput.trim()) return;
    setTesting(true);
    
    const newHistory = [...testHistory, { role: "user", content: testInput }];
    setTestHistory(newHistory);
    setTestInput("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: testInput,
          history: testHistory,
          config: formData
        })
      });
      const data = await res.json();
      if (data.response) {
        setTestHistory([...newHistory, { role: "assistant", content: data.response }]);
      }
    } catch (err) {
      console.error("LLM Test Error:", err);
      setTestHistory([...newHistory, { role: "assistant", content: "Error communicating with AI service." }]);
    }
    setTesting(false);
  };

  const [ttsInput, setTtsInput] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [testingAudio, setTestingAudio] = useState(false);

  const handleTestAudio = async () => {
    if (!ttsInput.trim()) return;
    setTestingAudio(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ttsInput, voice_id: formData.voice_id })
      });
      const data = await res.json();
      if (data.audio) {
        setAudioUrl(data.audio);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating audio");
    }
    setTestingAudio(false);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)] bg-background">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Link href="/agents" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="font-bold text-xl bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-foreground w-full max-w-[200px] md:max-w-md"
            />
            <span className="text-xs text-muted-foreground">Agent ID: ag_{params.id === 'default' ? 'default_123' : params.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
            {loading ? "Saving..." : <><Save size={16} /> Publish</>}
          </button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden mt-4 gap-6 pb-6 lg:pb-0">
        
        {/* Column 1: System Prompt (Editor) */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[300px] lg:min-h-0">
          <div className="p-3 border-b border-black/5 bg-slate-50/50 flex items-center gap-2 shrink-0">
            <Bot size={16} className="text-muted-foreground"/>
            <span className="font-semibold text-sm">Agent Prompt</span>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Define the identity, style guardrails, and tasks for your AI.</p>
            <textarea 
              className="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 p-0 text-sm font-mono leading-relaxed custom-scrollbar text-foreground/90"
              value={formData.system_prompt}
              onChange={(e) => setFormData({...formData, system_prompt: e.target.value})}
            />
          </div>
        </div>

        {/* Column 2: Settings Accordion */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 lg:overflow-y-auto pr-1 lg:pr-3 custom-scrollbar lg:pb-10 min-h-[400px] lg:min-h-0">
          
          <details className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group">
            <summary className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-50/80 flex items-center justify-between select-none transition-colors">
              <div className="flex items-center gap-3"><Puzzle size={16} className="text-muted-foreground"/> Functions</div>
              <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 border-t border-black/5 bg-slate-50/30 mt-2">
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm px-3 py-2 bg-white border border-black/5 rounded-xl shadow-sm">
                  <span className="font-mono text-xs truncate mr-2">transfer_call</span>
                  <div className="flex gap-2 text-muted-foreground shrink-0">
                    <span className="cursor-pointer hover:text-foreground transition-colors">✏️</span>
                    <span className="cursor-pointer hover:text-red-500 transition-colors">🗑️</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm px-3 py-2 bg-white border border-black/5 rounded-xl shadow-sm">
                  <span className="font-mono text-xs truncate mr-2">end_call</span>
                  <div className="flex gap-2 text-muted-foreground shrink-0">
                    <span className="cursor-pointer hover:text-foreground transition-colors">✏️</span>
                    <span className="cursor-pointer hover:text-red-500 transition-colors">🗑️</span>
                  </div>
                </div>
              </div>
              <button className="text-xs font-medium text-foreground hover:bg-black/5 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-black/5">
                <Plus size={14} /> Add Function
              </button>
            </div>
          </details>

          <details className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group">
            <summary className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-50/80 flex items-center justify-between select-none transition-colors">
              <div className="flex items-center gap-3"><Book size={16} className="text-muted-foreground"/> Knowledge Base</div>
              <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 border-t border-black/5 bg-slate-50/30 mt-2">
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Add documents or URLs. The agent will use them to answer questions.</p>
              <button className="text-xs font-medium text-foreground hover:bg-black/5 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-black/5">
                <Plus size={14} /> Add Document
              </button>
            </div>
          </details>

          <details className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group" open>
            <summary className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-50/80 flex items-center justify-between select-none transition-colors">
              <div className="flex items-center gap-3"><Volume2 size={16} className="text-muted-foreground"/> Speech Settings</div>
              <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-5 pt-0 border-t border-black/5 bg-slate-50/30 space-y-6 mt-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Ambient Sound</label>
                <select className="w-full border border-black/5 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm">
                  <option>None</option>
                  <option>Office Background</option>
                  <option>Cafe</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Responsiveness</label>
                  <span className="text-[10px] font-mono bg-white border border-black/5 px-2 py-0.5 rounded-md text-muted-foreground shadow-sm">600 ms</span>
                </div>
                <input type="range" min="100" max="3000" defaultValue="600" className="w-full accent-black h-1 bg-black/10 rounded-full appearance-none cursor-pointer" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Voice Temperature</label>
                  <span className="text-[10px] font-mono bg-white border border-black/5 px-2 py-0.5 rounded-md text-muted-foreground shadow-sm">0.7</span>
                </div>
                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-black h-1 bg-black/10 rounded-full appearance-none cursor-pointer" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Voice Speed</label>
                  <span className="text-[10px] font-mono bg-white border border-black/5 px-2 py-0.5 rounded-md text-muted-foreground shadow-sm">1.0</span>
                </div>
                <input type="range" min="0.5" max="2" step="0.1" defaultValue="1.0" className="w-full accent-black h-1 bg-black/10 rounded-full appearance-none cursor-pointer" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Volume</label>
                  <span className="text-[10px] font-mono bg-white border border-black/5 px-2 py-0.5 rounded-md text-muted-foreground shadow-sm">1.0</span>
                </div>
                <input type="range" min="0" max="2" step="0.1" defaultValue="1.0" className="w-full accent-black h-1 bg-black/10 rounded-full appearance-none cursor-pointer" />
              </div>
            </div>
          </details>

          <details className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group">
            <summary className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-50/80 flex items-center justify-between select-none transition-colors">
              <div className="flex items-center gap-3"><Type size={16} className="text-muted-foreground"/> Realtime Transcription Settings</div>
              <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-5 pt-0 border-t border-black/5 bg-slate-50/30 mt-4 space-y-5">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Spelling Dictionary</label>
                <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">Help the model recognize custom words.</p>
                <button className="text-xs font-medium text-foreground hover:bg-black/5 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-black/5 bg-white shadow-sm">
                  <Plus size={14} /> Add Word
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-medium text-foreground">Punctuation</label>
                <input type="checkbox" defaultChecked className="toggle w-8 h-4 rounded-full bg-black/10 appearance-none relative checked:bg-black before:content-[''] before:absolute before:w-3.5 before:h-3.5 before:bg-white before:rounded-full before:top-[1px] before:left-[1px] checked:before:translate-x-4 transition-all cursor-pointer shadow-inner shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-medium text-foreground">Profanity Filter</label>
                <input type="checkbox" className="toggle w-8 h-4 rounded-full bg-black/10 appearance-none relative checked:bg-black before:content-[''] before:absolute before:w-3.5 before:h-3.5 before:bg-white before:rounded-full before:top-[1px] before:left-[1px] checked:before:translate-x-4 transition-all cursor-pointer shadow-inner shrink-0" />
              </div>
            </div>
          </details>

          <details className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group">
            <summary className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-50/80 flex items-center justify-between select-none transition-colors">
              <div className="flex items-center gap-3"><Phone size={16} className="text-muted-foreground"/> Call Settings</div>
              <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-5 pt-0 border-t border-black/5 bg-slate-50/30 mt-4 space-y-6">
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">Ringtone</label>
                <select className="w-full border border-black/5 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm">
                  <option>Default Ringtone</option>
                  <option>None</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-foreground">Max Call Duration</label>
                  <span className="text-[10px] font-mono bg-white border border-black/5 px-2 py-0.5 rounded-md text-muted-foreground shadow-sm">30 min</span>
                </div>
                <input type="range" min="1" max="120" defaultValue="30" className="w-full accent-black h-1 bg-black/10 rounded-full appearance-none cursor-pointer" />
              </div>
            </div>
          </details>

          <details className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group">
            <summary className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-50/80 flex items-center justify-between select-none transition-colors">
              <div className="flex items-center gap-3"><FileText size={16} className="text-muted-foreground"/> Post-Call Data Extraction</div>
              <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 border-t border-black/5 bg-slate-50/30 mt-2">
              <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">Define specific data points to extract from the call transcript.</p>
              <button className="text-xs font-medium text-foreground hover:bg-black/5 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-black/5 bg-white shadow-sm">
                <Plus size={14} /> Add Data Point
              </button>
            </div>
          </details>

          <details className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group">
            <summary className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-50/80 flex items-center justify-between select-none transition-colors">
              <div className="flex items-center gap-3"><Shield size={16} className="text-muted-foreground"/> Security & Fallback Settings</div>
              <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 border-t border-black/5 bg-slate-50/30 mt-2">
              <p className="text-[10px] text-muted-foreground">Configure fallback voice and security parameters here.</p>
            </div>
          </details>

          <details className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group">
            <summary className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-50/80 flex items-center justify-between select-none transition-colors">
              <div className="flex items-center gap-3"><Globe size={16} className="text-muted-foreground"/> Webhook Settings</div>
              <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-5 pt-0 border-t border-black/5 bg-slate-50/30 mt-4 space-y-5">
              <div>
                <label className="text-[10px] font-medium text-foreground mb-1 block uppercase tracking-wider">Inbound Call Webhook URL</label>
                <input type="text" className="w-full border border-black/5 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm" placeholder="https://" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-foreground mb-1 block uppercase tracking-wider">Post-Call Webhook URL</label>
                <input type="text" className="w-full border border-black/5 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm" placeholder="https://" />
              </div>
            </div>
          </details>

          <details className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group">
            <summary className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-50/80 flex items-center justify-between select-none transition-colors">
              <div className="flex items-center gap-3"><Box size={16} className="text-muted-foreground"/> MCPs</div>
              <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 border-t border-black/5 bg-slate-50/30 mt-2">
              <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">Enable your agent with Model Context Protocol.</p>
              <button className="text-xs font-medium text-foreground hover:bg-black/5 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-black/5 bg-white shadow-sm">
                <Plus size={14} /> Add MCP
              </button>
            </div>
          </details>

        </div>

        {/* Column 3: Test Pane */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] lg:min-h-0">
          <div className="flex items-center border-b border-black/5 shrink-0">
            <button 
              className={`flex-1 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'audio' ? 'border-black text-black' : 'border-transparent text-muted-foreground hover:bg-slate-50/50'}`}
              onClick={() => setActiveTab('audio')}
            >
              Test Audio
            </button>
            <button 
              className={`flex-1 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'llm' ? 'border-black text-black' : 'border-transparent text-muted-foreground hover:bg-slate-50/50'}`}
              onClick={() => setActiveTab('llm')}
            >
              Test LLM
            </button>
          </div>

          {/* Test Content Area */}
          <div className="flex-1 flex flex-col p-5 bg-slate-50/30 overflow-hidden">
            {activeTab === 'audio' ? (
              <div className="flex-1 flex flex-col h-full justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">Voice Testing</h3>
                  <p className="text-xs text-muted-foreground mb-5 leading-relaxed">Type something to hear how your agent sounds using ElevenLabs.</p>
                  
                  <textarea 
                    value={ttsInput}
                    onChange={(e) => setTtsInput(e.target.value)}
                    placeholder="Hello! Welcome to the Aesthetic Clinic. How can I help you today?"
                    className="w-full h-36 border border-black/5 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 bg-white resize-none shadow-sm custom-scrollbar"
                  />
                  
                  <button 
                    onClick={handleTestAudio}
                    disabled={testingAudio || !ttsInput.trim()}
                    className="mt-5 w-full sm:w-auto justify-center bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2 shadow-md hover:bg-black/90 transition-all shrink-0"
                  >
                    {testingAudio ? "Generating..." : <><Volume2 size={16} /> Generate Speech</>}
                  </button>
                </div>

                {audioUrl && (
                  <div className="mt-8 p-4 bg-white border border-black/5 rounded-xl shadow-sm">
                    <p className="text-[10px] font-medium text-muted-foreground mb-3 uppercase tracking-wider">Audio Preview</p>
                    <audio controls src={audioUrl} className="w-full h-8" autoPlay />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                  {testHistory.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-xs text-center px-8">
                      Type a message to test the LLM logic without text-to-speech latency.
                    </div>
                  ) : (
                    testHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-black text-white rounded-br-sm' 
                            : 'bg-white text-foreground rounded-bl-sm border border-black/5'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {testing && (
                    <div className="flex justify-start">
                      <div className="bg-white text-muted-foreground rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex items-center gap-2 border border-black/5 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-auto shrink-0">
                  <input 
                    type="text" 
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTestLLM()}
                    placeholder="Type a message..."
                    className="flex-1 border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 bg-white shadow-sm min-w-0"
                  />
                  <button 
                    onClick={handleTestLLM}
                    disabled={testing || !testInput.trim()}
                    className="bg-black text-white px-5 py-3 rounded-xl text-sm font-medium disabled:opacity-50 shadow-md hover:bg-black/90 transition-all shrink-0"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
