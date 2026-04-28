"use client";
import { useState } from "react";
import { Card, PageHeader, SearchInput } from "./shared";
import { MOCK } from "../_data/mock";

export default function TroubleshootingPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK.troubleshooting.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.symptom.toLowerCase().includes(search.toLowerCase()) ||
    t.solution.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="🔧 Troubleshooting" actionLabel="+ Add Tip" />
      <SearchInput value={search} onChange={setSearch} placeholder="Search by issue, symptom, or fix..." />

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map(t => (
          <Card key={t.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                  {t.title}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ color: "#f97316", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", marginTop: 1 }}>
                    SYMPTOM
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: 13 }}>{t.symptom}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", marginTop: 1 }}>
                    FIX
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: 13 }}>{t.solution}</span>
                </div>
              </div>

              <a
                href={`https://drive.google.com/file/d/${t.driveId}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#7c6af7", fontSize: 13, textDecoration: "none",
                  fontWeight: 600, marginLeft: 24, whiteSpace: "nowrap",
                }}
              >
                📎 Full Guide
              </a>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>
            No tips found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}