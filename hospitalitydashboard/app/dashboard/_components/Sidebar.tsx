"use client";

const NAV = [
  { section: "MAIN", items: [
    { id: "ask",            icon: "✨", label: "Ask AI",        badge: null },
    { id: "sops",           icon: "📋", label: "SOPs",          badge: null },
    { id: "faultlibrary",   icon: "⚡", label: "Fault Library", badge: null },
    { id: "configurations", icon: "⚙️", label: "Configurations",badge: null },
  ]},
  { section: "BUSINESS", items: [
    { id: "vendors",     icon: "🏢", label: "Vendors",     badge: 24 },
    { id: "inspections", icon: "🔍", label: "Inspections", badge: 3  },
    { id: "manuals",     icon: "📖", label: "Manuals",     badge: null },
    { id: "troubleshooting", icon: "🔧", label: "Troubleshooting", badge: null },
    { id: "licenses",    icon: "🪪", label: "Licenses",    badge: null },
  ]},
  { section: "PEOPLE", items: [
    { id: "employees", icon: "👥", label: "Employees",    badge: null },
    { id: "payroll",   icon: "💸", label: "Payroll Email",badge: null },
  ]},
  { section: "MANAGE", items: [
    { id: "knowledge",  icon: "➕", label: "Add Knowledge", badge: null },
    { id: "analytics",  icon: "📊", label: "Analytics",     badge: null },
    { id: "settings",   icon: "🔧", label: "Settings",      badge: null },
  ]},
];

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
}

export default function Sidebar({ active, setActive }: SidebarProps) {
  return (
    <div style={{ width: 220, background: "#0c1526", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px" }}>
        <div style={{ color: "#7c6af7", fontWeight: 800, fontSize: 18 }}>🏨 HospitalityOS</div>
        <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>Living Knowledge Base</div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        {NAV.map(group => (
          <div key={group.section} style={{ marginBottom: 8 }}>
            <div style={{ color: "#334155", fontSize: 10, fontWeight: 700, padding: "8px 8px 4px", letterSpacing: 1 }}>
              {group.section}
            </div>
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: active === item.id ? "#1e293b" : "transparent",
                  color: active === item.id ? "#f1f5f9" : "#64748b",
                  fontSize: 14, fontWeight: active === item.id ? 600 : 400,
                  textAlign: "left", marginBottom: 2,
                }}
              >
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ background: "#f97316", color: "#fff", borderRadius: 99, fontSize: 11, fontWeight: 700, padding: "1px 7px" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Drive mode */}
      <div style={{ padding: 12, borderTop: "1px solid #1e293b" }}>
        <div style={{ background: "#1e293b", borderRadius: 8, padding: 10, fontSize: 12, color: "#64748b" }}>
          <div style={{ color: "#7c6af7", fontWeight: 700, marginBottom: 4 }}>Drive Mode</div>
          <div>🗄️ Self-Hosted</div>
          <div style={{ color: "#334155", marginTop: 2 }}>Ready for hybrid ↗</div>
        </div>
      </div>
    </div>
  );
}