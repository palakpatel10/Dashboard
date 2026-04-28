"use client";
import { Card } from "./shared";

const BAR_DATA = [
  { label: "Mon", sops: 12, faults: 3 },
  { label: "Tue", sops: 19, faults: 5 },
  { label: "Wed", sops: 8,  faults: 2 },
  { label: "Thu", sops: 24, faults: 7 },
  { label: "Fri", sops: 31, faults: 4 },
  { label: "Sat", sops: 14, faults: 1 },
  { label: "Sun", sops: 6,  faults: 0 },
];

const TOP_QUERIES = [
  { q: "How to reset POS system",       count: 34 },
  { q: "Fire inspection procedure",     count: 28 },
  { q: "Guest check-in SOP",           count: 22 },
  { q: "HVAC fault codes",             count: 19 },
  { q: "Emergency contact list",        count: 15 },
];

const KNOWLEDGE_STATS = [
  { label: "Total Knowledge Items", value: 847,  color: "#7c6af7" },
  { label: "SOPs Documented",       value: 124,  color: "#22d3ee" },
  { label: "Faults Resolved",       value: 56,   color: "#4ade80" },
  { label: "AI Queries This Month", value: 312,  color: "#f97316" },
];

const maxSops = Math.max(...BAR_DATA.map(d => d.sops));

export default function AnalyticsPage() {
  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📊 Analytics</h2>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {KNOWLEDGE_STATS.map(s => (
          <Card key={s.label}>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Bar chart — knowledge activity */}
        <Card>
          <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 20 }}>Knowledge Activity — This Week</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
            {BAR_DATA.map(d => (
              <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                <div style={{ fontSize: 11, color: "#64748b" }}>{d.sops}</div>
                <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end" }}>
                  <div style={{ flex: 1, background: "#7c6af7", borderRadius: "4px 4px 0 0", height: `${(d.sops / maxSops) * 120}px` }} />
                  <div style={{ flex: 1, background: "#f97316", borderRadius: "4px 4px 0 0", height: `${(d.faults / maxSops) * 120}px` }} />
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{d.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
              <div style={{ width: 10, height: 10, background: "#7c6af7", borderRadius: 2 }} /> SOP Lookups
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
              <div style={{ width: 10, height: 10, background: "#f97316", borderRadius: 2 }} /> Fault Reports
            </div>
          </div>
        </Card>

        {/* Top queries */}
        <Card>
          <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 16 }}>Top AI Queries This Month</div>
          {TOP_QUERIES.map((q, i) => (
            <div key={q.q} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>
                  <span style={{ color: "#475569", marginRight: 8 }}>#{i + 1}</span>{q.q}
                </div>
                <div style={{ color: "#7c6af7", fontWeight: 700, fontSize: 13 }}>{q.count}</div>
              </div>
              <div style={{ background: "#0f172a", borderRadius: 99, height: 4 }}>
                <div style={{ background: "#7c6af7", borderRadius: 99, height: 4, width: `${(q.count / TOP_QUERIES[0].count) * 100}%` }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Compliance overview */}
        <Card>
          <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 16 }}>Compliance Health</div>
          {[
            { label: "Licenses Active",       pct: 75, color: "#4ade80" },
            { label: "Inspections Up to Date", pct: 60, color: "#facc15" },
            { label: "SOPs Reviewed < 90d",    pct: 85, color: "#7c6af7" },
            { label: "Vendor Contacts Current", pct: 90, color: "#22d3ee" },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>{item.label}</div>
                <div style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{item.pct}%</div>
              </div>
              <div style={{ background: "#0f172a", borderRadius: 99, height: 6 }}>
                <div style={{ background: item.color, borderRadius: 99, height: 6, width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Recent activity summary */}
        <Card>
          <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 16 }}>Knowledge Growth</div>
          {[
            { label: "Items added this week",    value: "12 new items" },
            { label: "Items updated this week",  value: "8 updates" },
            { label: "Faults resolved",          value: "5 resolved" },
            { label: "Avg AI response quality",  value: "94% helpful" },
            { label: "Most active user",         value: "Sarah (24 actions)" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #334155" }}>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>{row.label}</div>
              <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13 }}>{row.value}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}