"use client";

import { Settings, Save, Calendar, Phone } from "lucide-react";
import { useState, useEffect } from "react";

export default function AgentConfig() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Aesthetic Beauty Clinic",
    services: "Botox, Dermal Fillers, Laser Hair Removal, Skin Assessment",
    timezone: "America/New_York",
    operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "10:00-18:00"
  });

  useEffect(() => {
    // Fetch existing config
    fetch("http://localhost:8080/api/clinic")
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setFormData({
            name: res.data.name,
            services: res.data.services.join(", "),
            timezone: res.data.timezone,
            operatingDays: res.data.operating_days,
            workingHours: res.data.working_hours
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return alert("Clinic name is required.");
    if (!formData.services.trim()) return alert("At least one service is required.");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        alert("Configuration saved successfully!");
      } else {
        alert("Error saving configuration: " + data.error);
      }
    } catch (error) {
      alert("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Agent Configuration</h1>
        <p className="text-muted-foreground mt-1">Setup and customize your aesthetic clinic AI receptionist.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-foreground">Clinic Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Clinic Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Services Offered (comma separated)</label>
                <textarea 
                  rows={3}
                  value={formData.services}
                  onChange={(e) => setFormData({...formData, services: e.target.value})}
                  className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                  <select 
                    value={formData.timezone}
                    onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground appearance-none">
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Chicago">America/Chicago (CST)</option>
                    <option value="America/Denver">America/Denver (MST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Slot Duration</label>
                  <select className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground appearance-none" disabled>
                    <option>30 Minutes (Fixed)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">Required by system</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Phone size={64} />
            </div>
            <h2 className="text-xl font-bold mb-2">Twilio Number</h2>
            <p className="text-primary-foreground/80 text-sm mb-6">Your AI receptionist phone number is active and ready to receive calls.</p>
            <div className="bg-white/20 px-4 py-3 rounded-xl font-mono text-lg tracking-wider font-bold mb-4">
              +1 (555) 019-2834
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
            <Save size={20} />
            {loading ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
