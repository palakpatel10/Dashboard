import { Card, Badge } from "./shared";
import { MOCK } from "../_data/mock";

const STATS = [
  { label: "SOPs",            value: 24, color: "#7c6af7" },
  { label: "Licenses",        value: 8,  color: "#22d3ee" },
  { label: "Inspections Due", value: 3,  color: "#f97316" },
  { label: "Employees",       value: 12, color: "#4ade80" },
];

export default function Overview() {
  const urgent = [
    ...MOCK.inspections.filter(i => i.status === "urgent").map(i => ({ ...i, _key: `inspection-${i.id}`, label: i.vendor })),
    ...MOCK.licenses.filter(l => l.status === "urgent").map(l => ({ ...l, _key: `license-${l.id}`, label: l.issuer })),
  ];

  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Welcome back 👋</h2>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {STATS.map(s => (
          <Card key={s.label}>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Urgent items */}
        <Card>
          <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 14, fontSize: 15 }}>⚠️ Urgent — Due Soon</div>
          {urgent.map(i => (
            <div key={i._key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #334155" }}>
              <div>
                <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600 }}>{i.name}</div>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>{i.label}</div>
              </div>
              <Badge status="urgent" label={`${i.daysLeft}d left`} />
            </div>
          ))}
        </Card>

        {/* Recent SOPs */}
        <Card>
          <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 14, fontSize: 15 }}>📋 Recent SOPs</div>
          {MOCK.sops.map(s => (
            <div key={`sop-${s.id}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #334155" }}>
              <div>
                <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600 }}>{s.title}</div>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>{s.category} · {s.updated}</div>
              </div>
              <Badge status={s.status === "Active" ? "ok" : "upcoming"} label={s.status} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}