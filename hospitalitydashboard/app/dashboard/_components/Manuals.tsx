"use client";
import { useState } from "react";
import { Card, PageHeader, SearchInput } from "./shared";
import { MOCK } from "../_data/mock";

export default function ManualsPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK.manuals.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="📖 Manuals" actionLabel="+ Link Manual" />
      <SearchInput value={search} onChange={setSearch} placeholder="Search by title or category..." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(m => (
          <Card key={m.id}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📖</div>
            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>{m.title}</div>
            <div style={{ color: "#64748b", fontSize: 13, margin: "6px 0 14px" }}>
              {m.category} · Updated {m.updated}
            </div>
            <a
              href={`https://drive.google.com/file/d/${m.driveId}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#7c6af7", fontSize: 13, textDecoration: "none", fontWeight: 600 }}
            >
              📎 Open in Drive →
            </a>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div style={{ color: "#475569", gridColumn: "1/-1", textAlign: "center", padding: 40 }}>
            No manuals found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}