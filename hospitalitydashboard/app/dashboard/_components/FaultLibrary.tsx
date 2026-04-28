"use client";
import { useState } from "react";
import { Card, PageHeader, SearchInput, Badge } from "./shared";

const FAULTS = [
  { id: 1,  code: "HVAC-E47", title: "HVAC E-47 Fault Code",          area: "HVAC",        severity: "high",   symptom: "Grinding noise on startup",        fix: "Pressure sensor calibration — check connector P7", occurrences: 3, lastSeen: "Mar 2026" },
  { id: 2,  code: "POS-001",  title: "POS System Black Screen",        area: "Technology",  severity: "medium", symptom: "Screen won't turn on after restart", fix: "Power cycle unit, check HDMI cable connection",    occurrences: 5, lastSeen: "Apr 2026" },
  { id: 3,  code: "KEY-002",  title: "Key Card Reader Failure",        area: "Front Desk",  severity: "medium", symptom: "Card reader flashes red continuously",fix: "Re-encode card at front desk terminal",            occurrences: 8, lastSeen: "Apr 2026" },
  { id: 4,  code: "ELEC-003", title: "Breaker Trip — Floor 2",        area: "Electrical",  severity: "high",   symptom: "Lights off in rooms 201-210",       fix: "Reset breaker B2 in utility room",                 occurrences: 2, lastSeen: "Feb 2026" },
  { id: 5,  code: "HEAT-004", title: "Hot Water Pressure Drop",        area: "Plumbing",    severity: "high",   symptom: "Low pressure in guest showers",     fix: "Check valve V3, call plumber if persists",         occurrences: 1, lastSeen: "Jan 2026" },
  { id: 6,  code: "WIFI-005", title: "Guest WiFi Authentication Loop", area: "Technology",  severity: "low",    symptom: "Guests can't connect to network",   fix: "Restart router in IT closet Floor 1",              occurrences: 12,lastSeen: "Apr 2026" },
];

const SEVERITY_MAP: Record<string, string> = { high: "urgent", medium: "upcoming", low: "ok" };

export default function FaultLibraryPage() {
  const [search, setSearch]   = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = FAULTS.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.code.toLowerCase().includes(search.toLowerCase()) ||
    f.area.toLowerCase().includes(search.toLowerCase()) ||
    f.symptom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="⚡ Fault Library" actionLabel="+ Log Fault" />
      <SearchInput value={search} onChange={setSearch} placeholder="Search by code, area, or symptom..." />

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map(f => (
          <Card key={f.id} style={{ cursor: "pointer" }} >
            <div
              onClick={() => setExpanded(expanded === f.id ? null : f.id)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ background: "#0f172a", color: "#7c6af7", fontFamily: "monospace", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6, border: "1px solid #334155" }}>
                  {f.code}
                </span>
                <div>
                  <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 15 }}>{f.title}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{f.area} · {f.occurrences}x reported · Last: {f.lastSeen}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Badge status={SEVERITY_MAP[f.severity]} label={f.severity} />
                <span style={{ color: "#475569", fontSize: 18 }}>{expanded === f.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {expanded === f.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #334155" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ color: "#f97316", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>SYMPTOM</div>
                    <div style={{ color: "#94a3b8", fontSize: 14 }}>{f.symptom}</div>
                  </div>
                  <div>
                    <div style={{ color: "#4ade80", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>FIX</div>
                    <div style={{ color: "#94a3b8", fontSize: 14 }}>{f.fix}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button style={{ background: "#0f172a", border: "1px solid #334155", color: "#7c6af7", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    📎 View Full Report
                  </button>
                  <button style={{ background: "#0f172a", border: "1px solid #334155", color: "#94a3b8", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
                    ✏️ Edit Solution
                  </button>
                  <button style={{ background: "#0f172a", border: "1px solid #334155", color: "#94a3b8", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
                    ➕ Add to Knowledge Base
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}