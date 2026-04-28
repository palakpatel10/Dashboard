"use client";
import { useState } from "react";
import { Card } from "./shared";

// ── Make sure this file starts here — no NAV array, no Sidebar code ───────

// ── Mock AI responses keyed by keyword ────────────────────────────────────
const AI_RESPONSES: Record<string, { answer: string; steps?: string[]; note?: string; sources: string[] }> = {
  default: {
    answer: "I found relevant information in your knowledge base. Here's what I know based on your SOPs and manuals.",
    sources: ["SOP Library", "General Manual"],
  },
  hvac: {
    answer: "This has happened twice before — most recently March 2023. Root cause is the pressure sensor on the secondary compressor losing calibration after cold weather exposure.",
    steps: [
      "Power cycle the unit — wait 90 seconds before restart",
      "Access panel B3, check pressure sensor connector P7 for corrosion",
      "If fault persists, call CoolTech Services (ref: CT-2891) — ask for Dave, not the general line",
      "Part needed if replacing: Honeywell C7335A1004 (~£34, 2-day delivery)",
    ],
    note: "Annual HVAC inspection for Building 3 is due in 47 days — consider bundling this fix with the inspection visit.",
    sources: ["Fault Log #2891", "HVAC SOP v3.2", "CoolTech Vendor Card"],
  },
  "fire alarm": {
    answer: "Your fire alarm inspection with ABC Fire Protection is overdue. Last inspection was March 15, 2024. Certificate expires soon.",
    steps: [
      "Contact ABC Fire Protection at (555) 234-5678",
      "Request annual suppression system inspection",
      "Ensure all exit signs and emergency lights are tested",
      "Update inspection report in Drive after completion",
    ],
    note: "This is a compliance requirement — reschedule immediately to avoid penalties.",
    sources: ["Inspection Log", "Fire Safety SOP", "ABC Fire Protection Card"],
  },
  onboard: {
    answer: "The guest check-in procedure has been updated recently. Here's the current onboarding flow for new clients.",
    steps: [
      "Greet guest and verify reservation in POS system",
      "Collect valid photo ID and scan into system",
      "Process payment method and obtain authorization",
      "Issue key cards — program for room + amenity access",
      "Provide welcome packet and explain hotel amenities",
    ],
    note: "GDPR step added by Mike on Apr 21 — ensure guest consents to data processing.",
    sources: ["Guest Check-In SOP v4.1", "GDPR Policy Doc"],
  },
  electrician: {
    answer: "Your emergency electrician contact is Sparks Electrical. They provide 24/7 emergency service for your property.",
    steps: [
      "Emergency line: (555) 987-6543 — available 24/7",
      "Contact person: Dave Morrison (Senior Electrician)",
      "Reference your account number: SPK-2024-441",
      "For non-emergency work, submit request 48hrs in advance",
    ],
    sources: ["Vendor Card — Sparks Electrical", "Emergency Contacts SOP"],
  },
};

const SUGGESTED = [
  "How do I onboard a new client?",
  "Fire alarm inspection overdue?",
  "Who's our emergency electrician?",
  "Reset password for billing system",
  "New employee checklist",
  "Server room access procedure",
];

const ACTIVITY = [
  { user: "Sarah", color: "#7c6af7", action: "added fault solution for Printer Offline Error on Floor 2", time: "1 hour ago" },
  { user: "James", color: "#4ade80", action: "completed Warehouse A safety walkthrough SOP", time: "Yesterday" },
  { user: "AI",    color: "#f97316", action: "auto-captured new vendor: Greenfield Waste Management", time: "2 days ago" },
  { user: "Mike",  color: "#22d3ee", action: "updated Client Onboarding SOP — added GDPR step", time: "3 days ago" },
];

function getResponse(query: string) {
  const q = query.toLowerCase();
  if (q.includes("hvac") || q.includes("e-47") || q.includes("fault") || q.includes("noise")) return AI_RESPONSES.hvac;
  if (q.includes("fire") || q.includes("alarm") || q.includes("suppression")) return AI_RESPONSES["fire alarm"];
  if (q.includes("onboard") || q.includes("check-in") || q.includes("checkin")) return AI_RESPONSES.onboard;
  if (q.includes("electrician") || q.includes("electric")) return AI_RESPONSES.electrician;
  return AI_RESPONSES.default;
}

interface Message { role: "user" | "ai"; text: string; response?: typeof AI_RESPONSES.default }

export default function AskAIPage() {
  const [input, setInput]     = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (query: string) => {
    if (!query.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: query }]);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const response = getResponse(query);
    setMessages(prev => [...prev, { role: "ai", text: response.answer, response }]);
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, height: "calc(100vh - 56px)" }}>

      {/* Center — Chat */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[{ v: "847", l: "Knowledge Items", c: "#7c6af7" }, { v: "124", l: "SOPs Documented", c: "#22d3ee" }, { v: "3", l: "Inspections Due", c: "#f97316" }].map(s => (
            <Card key={s.l} style={{ textAlign: "center", padding: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>{s.l}</div>
            </Card>
          ))}
        </div>

        {/* Messages */}
        <Card style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#475569", marginTop: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>Ask anything about your business</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>Try: "HVAC unit showing E-47 fault" or "fire inspection due"</div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i}>
              {m.role === "user" ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: "#7c6af7", color: "#fff", borderRadius: "12px 12px 2px 12px", padding: "10px 16px", maxWidth: "70%", fontSize: 14 }}>
                    {m.text}
                  </div>
                </div>
              ) : (
                <div style={{ background: "#0f172a", borderRadius: 12, padding: 16, border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ color: "#7c6af7", fontWeight: 700, fontSize: 14 }}>✨ AI Assistant</div>
                    <div style={{ color: "#475569", fontSize: 12 }}>From knowledge base</div>
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7, marginBottom: m.response?.steps ? 12 : 0 }}>
                    {m.response?.answer}
                  </div>
                  {m.response?.steps && (
                    <ol style={{ margin: "12px 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                      {m.response.steps.map((s, j) => (
                        <li key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <span style={{ background: "#1e293b", color: "#7c6af7", borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{j + 1}</span>
                          <span style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>{s}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {m.response?.note && (
                    <div style={{ background: "#422006", border: "1px solid #92400e", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#fbbf24", marginTop: 12 }}>
                      ⚠️ {m.response.note}
                    </div>
                  )}
                  {/* Sources */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                    {m.response?.sources.map(s => (
                      <span key={s} style={{ background: "#1e293b", color: "#64748b", fontSize: 12, padding: "3px 10px", borderRadius: 6, border: "1px solid #334155" }}>
                        📎 {s}
                      </span>
                    ))}
                  </div>
                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {["👍 Helpful", "✏️ Edit answer", "➕ Add to knowledge", "🔗 Share"].map(a => (
                      <button key={a} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12 }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ background: "#0f172a", borderRadius: 12, padding: 16, border: "1px solid #334155", color: "#64748b", fontSize: 14 }}>
              ✨ Searching knowledge base...
            </div>
          )}
        </Card>

        {/* Suggested questions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SUGGESTED.map(q => (
            <button key={q} onClick={() => handleAsk(q)}
              style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAsk(input)}
            placeholder="Ask anything... 'boiler making noise', 'fire inspection due'"
            style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "12px 16px", color: "#f1f5f9", fontSize: 14 }}
          />
          <button onClick={() => handleAsk(input)}
            style={{ background: "#7c6af7", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", cursor: "pointer", fontWeight: 700 }}>
            Ask
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

        {/* Inspections due */}
        <Card style={{ padding: 16 }}>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>📋 INSPECTIONS DUE</div>
          {[
            { name: "Fire Suppression — Warehouse B", sub: "ABC Fire Protection · Cert expires 15 Mar", days: 12, status: "urgent" },
            { name: "HVAC System — Building 3",       sub: "CoolTech Services · Last: Jan 2024",        days: 47, status: "upcoming" },
            { name: "Electrical Safety Certificate",  sub: "Sparks Electrical · 5-year cycle",          days: 91, status: "ok" },
          ].map(item => (
            <div key={item.name} style={{ marginBottom: 12 }}>
              <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>{item.name}</div>
              <div style={{ color: "#64748b", fontSize: 11, margin: "2px 0 6px" }}>{item.sub}</div>
              <div style={{
                background: item.status === "urgent" ? "#431407" : item.status === "upcoming" ? "#422006" : "#052e16",
                color: item.status === "urgent" ? "#f97316" : item.status === "upcoming" ? "#facc15" : "#4ade80",
                borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600, display: "inline-block",
              }}>
                {item.days} days
              </div>
            </div>
          ))}
        </Card>

        {/* Recent activity */}
        <Card style={{ padding: 16 }}>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>⚡ RECENT ACTIVITY</div>
          {ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {a.user[0]}
              </div>
              <div>
                <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>
                  <strong style={{ color: "#f1f5f9" }}>{a.user}</strong> {a.action}
                </div>
                <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Add Knowledge widget */}
        <Card style={{ padding: 16, background: "#1a1040", border: "1px solid #4c3d9e" }}>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>🪄 Add Knowledge</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 14 }}>
            Speak, type, or upload a doc — AI turns it into searchable knowledge instantly.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["🎙️ Voice", "⌨️ Type", "📁 Upload"].map(b => (
              <button key={b} style={{ flex: 1, background: "#0f172a", border: "1px solid #4c3d9e", color: "#a78bfa", borderRadius: 8, padding: "8px 4px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                {b}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}