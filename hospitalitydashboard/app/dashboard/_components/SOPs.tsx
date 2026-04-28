"use client";
import { useState } from "react";
import { Card, Badge, PageHeader, SearchInput } from "./shared";
import { MOCK } from "../_data/mock";

const TH_STYLE: React.CSSProperties = {
  padding: "12px 16px", color: "#64748b", fontSize: 12,
  textAlign: "left", fontWeight: 600, textTransform: "uppercase",
};

const TD_STYLE: React.CSSProperties = {
  padding: "14px 16px",
};

export default function SOPsPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK.sops.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="📋 SOPs" actionLabel="+ Add SOP" />
      <SearchInput value={search} onChange={setSearch} placeholder="Search by title or category..." />

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              <th style={TH_STYLE}>Title</th>
              <th style={TH_STYLE}>Category</th>
              <th style={TH_STYLE}>Last Updated</th>
              <th style={TH_STYLE}>Status</th>
              <th style={TH_STYLE}>Drive File</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderTop: "1px solid #334155" }}>
                <td style={{ ...TD_STYLE, color: "#f1f5f9", fontWeight: 600 }}>{s.title}</td>
                <td style={{ ...TD_STYLE, color: "#94a3b8" }}>{s.category}</td>
                <td style={{ ...TD_STYLE, color: "#94a3b8" }}>{s.updated}</td>
                <td style={TD_STYLE}>
                  <Badge
                    status={s.status === "Active" ? "ok" : "upcoming"}
                    label={s.status}
                  />
                </td>
                <td style={TD_STYLE}>
                  <a
                    href={`https://drive.google.com/file/d/${s.driveId}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#7c6af7", fontSize: 13, textDecoration: "none", fontWeight: 600 }}
                  >
                    📎 Open in Drive
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...TD_STYLE, color: "#475569", textAlign: "center", padding: 32 }}>
                  No SOPs found matching "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}