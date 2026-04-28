"use client";
import { useState } from "react";
import { Card } from "./shared";

type Mode = "type" | "upload";

export default function AddKnowledgePage() {
  const [mode, setMode]       = useState<Mode>("type");
  const [title, setTitle]     = useState("");
  const [category, setCategory] = useState("SOPs");
  const [content, setContent] = useState("");
  const [saved, setSaved]     = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleSave = () => {
    if (!title || !content) return;
    // TODO: save to Supabase + index for AI search
    setSaved(true);
    setTimeout(() => { setSaved(false); setTitle(""); setContent(""); }, 2500);
  };

  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>➕ Add Knowledge</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

        {/* Left — input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 0, background: "#0f172a", borderRadius: 10, padding: 4, border: "1px solid #334155", width: "fit-content" }}>
            {(["type", "upload"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  padding: "8px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
                  background: mode === m ? "#7c6af7" : "transparent",
                  color: mode === m ? "#fff" : "#64748b",
                }}>
                {m === "type" ? "⌨️ Type" : "📁 Upload"}
              </button>
            ))}
          </div>

          {mode === "type" ? (
            <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={LABEL}>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Guest WiFi Reset Procedure"
                  style={INPUT} />
              </div>
              <div>
                <label style={LABEL}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={INPUT}>
                  {["SOPs", "Manuals", "Troubleshooting", "Compliance", "Vendors", "General"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={LABEL}>Content</label>
                <textarea value={content} onChange={e => setContent(e.target.value)}
                  placeholder="Describe the procedure, solution, or knowledge item in detail..."
                  rows={10}
                  style={{ ...INPUT, resize: "vertical" as const }} />
              </div>
              <button onClick={handleSave}
                style={{ background: saved ? "#052e16" : "#7c6af7", color: saved ? "#4ade80" : "#fff", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
                {saved ? "✅ Saved to Knowledge Base!" : "Save to Knowledge Base"}
              </button>
            </Card>
          ) : (
            <Card>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); }}
                style={{
                  border: `2px dashed ${dragging ? "#7c6af7" : "#334155"}`,
                  borderRadius: 12, padding: 60, textAlign: "center",
                  background: dragging ? "#1e1b4b" : "transparent",
                  transition: "all 0.2s",
                }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
                <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                  Drop files here
                </div>
                <div style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
                  Supports PDF, DOCX, TXT, PNG — AI will extract and index content automatically
                </div>
                <button style={{ background: "#7c6af7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontWeight: 600 }}>
                  Browse Files
                </button>
              </div>
              <div style={{ marginTop: 16, color: "#64748b", fontSize: 13, textAlign: "center" }}>
                Files will also be saved to your linked Google Drive folder
              </div>
            </Card>
          )}
        </div>

        {/* Right — tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ background: "#1a1040", border: "1px solid #4c3d9e" }}>
            <div style={{ color: "#a78bfa", fontWeight: 700, marginBottom: 10 }}>🪄 How AI Uses This</div>
            <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
              Everything you add becomes instantly searchable. When someone asks a question, AI finds the most relevant knowledge items and builds an answer automatically.
            </div>
          </Card>

          <Card>
            <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 12 }}>📋 What to Add</div>
            {[
              { icon: "📋", text: "Step-by-step procedures" },
              { icon: "🔧", text: "Fault solutions and fixes" },
              { icon: "📞", text: "Vendor contact details" },
              { icon: "⚠️", text: "Safety protocols" },
              { icon: "📖", text: "Training materials" },
              { icon: "🪪", text: "License & permit info" },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e293b", color: "#94a3b8", fontSize: 13 }}>
                <span>{item.icon}</span>{item.text}
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 12 }}>📊 Knowledge Stats</div>
            {[
              { label: "Total items", value: "847" },
              { label: "Added this week", value: "12" },
              { label: "Categories", value: "6" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e293b" }}>
                <div style={{ color: "#64748b", fontSize: 13 }}>{s.label}</div>
                <div style={{ color: "#7c6af7", fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

const LABEL: React.CSSProperties = {
  display: "block", color: "#64748b", fontSize: 12,
  fontWeight: 600, marginBottom: 8, textTransform: "uppercase",
};

const INPUT: React.CSSProperties = {
  width: "100%", background: "#0f172a", border: "1px solid #334155",
  borderRadius: 8, padding: "10px 14px", color: "#f1f5f9",
  fontSize: 14, boxSizing: "border-box",
};