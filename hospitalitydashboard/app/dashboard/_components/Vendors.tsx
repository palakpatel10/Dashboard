"use client";
import { useState } from "react";
import { Card, PageHeader, SearchInput, Badge } from "./shared";

const VENDORS = [
  { id: 1,  name: "ABC Fire Protection",       category: "Safety",      contact: "Dave Miller",    phone: "(555) 123-4567", email: "dave@abcfire.com",      status: "active", lastUsed: "Mar 2026" },
  { id: 2,  name: "CoolTech Services",          category: "HVAC",        contact: "Sara Johnson",   phone: "(555) 234-5678", email: "sara@cooltech.com",     status: "active", lastUsed: "Jan 2026" },
  { id: 3,  name: "Sparks Electrical",          category: "Electrical",  contact: "Dave Morrison",  phone: "(555) 987-6543", email: "dave@sparks.com",       status: "active", lastUsed: "Feb 2026" },
  { id: 4,  name: "City Health Dept.",          category: "Compliance",  contact: "Inspector Chen", phone: "(555) 345-6789", email: "inspections@city.gov",  status: "active", lastUsed: "Apr 2026" },
  { id: 5,  name: "CleanPro Laundry",           category: "Housekeeping",contact: "Maria Santos",   phone: "(555) 456-7890", email: "maria@cleanpro.com",    status: "active", lastUsed: "Apr 2026" },
  { id: 6,  name: "FreshFoods Supply Co.",      category: "Food",        contact: "Tom Baker",      phone: "(555) 567-8901", email: "tom@freshfoods.com",    status: "active", lastUsed: "Apr 2026" },
  { id: 7,  name: "SecureIT Systems",           category: "Technology",  contact: "Alex Patel",     phone: "(555) 678-9012", email: "alex@secureit.com",     status: "active", lastUsed: "Mar 2026" },
  { id: 8,  name: "Greenfield Waste Mgmt",      category: "Facilities",  contact: "Bob Green",      phone: "(555) 789-0123", email: "bob@greenfield.com",    status: "new",    lastUsed: "Apr 2026" },
];

const CATEGORIES = ["All", "Safety", "HVAC", "Electrical", "Compliance", "Housekeeping", "Food", "Technology", "Facilities"];

export default function VendorsPage() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");

  const filtered = VENDORS.filter(v =>
    (category === "All" || v.category === category) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) ||
     v.category.toLowerCase().includes(search.toLowerCase()) ||
     v.contact.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader title="🏢 Vendors" actionLabel="+ Add Vendor" />

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{
              background: category === c ? "#7c6af7" : "#1e293b",
              color: category === c ? "#fff" : "#64748b",
              border: "1px solid", borderColor: category === c ? "#7c6af7" : "#334155",
              borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>
            {c}
          </button>
        ))}
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search vendors, contacts, categories..." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {filtered.map(v => (
          <Card key={v.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>{v.name}</div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{v.category} · Last used: {v.lastUsed}</div>
              </div>
              <Badge status={v.status === "new" ? "upcoming" : "ok"} label={v.status === "new" ? "🆕 New" : "Active"} />
            </div>
            <div style={{ borderTop: "1px solid #334155", paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>👤 {v.contact}</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>📞 {v.phone}</div>
              <div style={{ color: "#7c6af7", fontSize: 13 }}>✉️ {v.email}</div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div style={{ color: "#475569", gridColumn: "1/-1", textAlign: "center", padding: 40 }}>
            No vendors found
          </div>
        )}
      </div>
    </div>
  );
}