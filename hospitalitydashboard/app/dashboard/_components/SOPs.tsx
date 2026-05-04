"use client";
import { useState } from "react";
import { Card, Badge, PageHeader, SearchInput, TableWrapper, useIsMobile } from "./shared";
import { MOCK } from "../_data/mock";

export default function SOPsPage() {
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

  const filtered = MOCK.sops.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="📋 SOPs" actionLabel="+ Add SOP" />
      <SearchInput value={search} onChange={setSearch} placeholder="Search by title or category..." />

      {/* Mobile — card view */}
      {isMobile ? (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map(s => (
            <Card key={s.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>{s.title}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{s.category} · {s.updated}</div>
                </div>
                <Badge status={s.status === "Active" ? "ok" : "upcoming"} label={s.status} />
              </div>
              <a href={`https://drive.google.com/file/d/${s.driveId}`} target="_blank" rel="noreferrer"
                style={{ color: "#7c6af7", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
                📎 Open in Drive
              </a>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>No SOPs found</div>
          )}
        </div>
      ) : (
        /* Desktop — table view */
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <TableWrapper>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  {["Title", "Category", "Last Updated", "Status", "Drive"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", color: "#64748b", fontSize: 12, textAlign: "left", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} style={{ borderTop: "1px solid #334155" }}>
                    <td style={{ padding: "14px 16px", color: "#f1f5f9", fontWeight: 600 }}>{s.title}</td>
                    <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{s.category}</td>
                    <td style={{ padding: "14px 16px", color: "#94a3b8", whiteSpace: "nowrap" }}>{s.updated}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <Badge status={s.status === "Active" ? "ok" : "upcoming"} label={s.status} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <a href={`https://drive.google.com/file/d/${s.driveId}`} target="_blank" rel="noreferrer"
                        style={{ color: "#7c6af7", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
                        📎 Open in Drive
                      </a>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 32, color: "#475569", textAlign: "center" }}>No SOPs found</td></tr>
                )}
              </tbody>
            </table>
          </TableWrapper>
        </Card>
      )}
    </div>
  );
}