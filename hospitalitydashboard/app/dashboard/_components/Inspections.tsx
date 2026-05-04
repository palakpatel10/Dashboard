"use client";
import { Card, Badge, PageHeader, useIsMobile } from "./shared";
import { MOCK } from "../_data/mock";

export default function InspectionsPage() {
  const isMobile = useIsMobile();

  return (
    <div>
      <PageHeader title="🔍 Inspections" actionLabel="+ Add Inspection" />

      <div style={{ display: "grid", gap: 12 }}>
        {MOCK.inspections.map(i => (
          <Card key={i.id}>
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 12 : 0,
            }}>
              {/* Left — info */}
              <div>
                <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>{i.name}</div>
                <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
                  {i.vendor} · Due: {i.due}
                </div>
              </div>

              {/* Right — badge + action */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <Badge
                  status={i.status}
                  label={i.status === "urgent" ? `⚠️ ${i.daysLeft} days` : `${i.daysLeft} days`}
                />
                <a
                  href={`https://drive.google.com/file/d/INSPECTION_REPORT_${i.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#0f172a", border: "1px solid #334155",
                    color: "#94a3b8", borderRadius: 8, padding: "6px 12px",
                    cursor: "pointer", fontSize: 13, textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  📎 Report
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}