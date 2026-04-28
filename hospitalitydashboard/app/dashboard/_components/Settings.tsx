"use client";
import { useState } from "react";
import { Card } from "./shared";

// ── Types ──────────────────────────────────────────────────────────────────
type DriveMode = "self_hosted" | "client_oauth";

interface ClientConfig {
  businessName: string;
  clientId: string;
  driveMode: DriveMode;
  driveFolderId: string;
  accountantEmail: string;
}

// ── Default config (single-client mode) ───────────────────────────────────
// When extending to multi-client: load this from Supabase per client row
const DEFAULT_CONFIG: ClientConfig = {
  businessName:   "Hotel Dashboard",
  clientId:       "client_001",
  driveMode:      "self_hosted",
  driveFolderId:  "YOUR_GOOGLE_DRIVE_FOLDER_ID",
  accountantEmail: "accountant@yourbusiness.com",
};

const ALERT_DEFAULTS = {
  inspectionDays: 30,
  licenseDays:    60,
  payrollWeeks:   2,
};

// ── Component ──────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [config, setConfig]   = useState<ClientConfig>(DEFAULT_CONFIG);
  const [alerts, setAlerts]   = useState(ALERT_DEFAULTS);
  const [saved, setSaved]     = useState(false);

  const update = (key: keyof ClientConfig, val: string) =>
    setConfig(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    // TODO: persist to Supabase
    // await supabase.from("clients").update(config).eq("id", config.clientId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, margin: 0 }}>⚙️ Settings</h2>
        <button
          onClick={handleSave}
          style={{ background: saved ? "#052e16" : "#7c6af7", color: saved ? "#4ade80" : "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}
        >
          {saved ? "✅ Saved!" : "Save Changes"}
        </button>
      </div>

      <div style={{ display: "grid", gap: 16 }}>

        {/* Client Config */}
        <Card>
          <SectionTitle>CLIENT CONFIGURATION</SectionTitle>
          <Field label="Business Name">
            <TextInput value={config.businessName} onChange={v => update("businessName", v)} />
          </Field>
          <Field label="Client ID">
            <TextInput value={config.clientId} onChange={v => update("clientId", v)} disabled />
          </Field>
          <Field label="Accountant Email">
            <TextInput value={config.accountantEmail} onChange={v => update("accountantEmail", v)} />
          </Field>
        </Card>

        {/* Google Drive */}
        <Card>
          <SectionTitle>GOOGLE DRIVE</SectionTitle>
          <Field label="Drive Mode">
            <div style={{ display: "flex", gap: 8 }}>
              {(["self_hosted", "client_oauth"] as DriveMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => update("driveMode", mode)}
                  style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid",
                    borderColor: config.driveMode === mode ? "#7c6af7" : "#334155",
                    background: config.driveMode === mode ? "#1e1b4b" : "#0f172a",
                    color: config.driveMode === mode ? "#7c6af7" : "#64748b",
                    cursor: "pointer", fontWeight: 600, fontSize: 13,
                  }}
                >
                  {mode === "self_hosted" ? "🗄️ Self-Hosted" : "🔗 Client OAuth"}
                </button>
              ))}
            </div>
            <div style={{ color: "#475569", fontSize: 12, marginTop: 8 }}>
              {config.driveMode === "self_hosted"
                ? "Your service account manages Drive. Client doesn't need a Google account."
                : "Client connects their own Google account. Files stay in their Drive."}
            </div>
          </Field>
          <Field label="Drive Folder ID">
            <TextInput
              value={config.driveFolderId}
              onChange={v => update("driveFolderId", v)}
              placeholder="Paste Google Drive folder ID here"
            />
          </Field>
        </Card>

        {/* Notifications */}
        <Card>
          <SectionTitle>ALERT THRESHOLDS</SectionTitle>
          <Field label="Inspection Alert (days before)">
            <NumberInput value={alerts.inspectionDays} onChange={v => setAlerts(p => ({ ...p, inspectionDays: v }))} />
          </Field>
          <Field label="License Alert (days before)">
            <NumberInput value={alerts.licenseDays} onChange={v => setAlerts(p => ({ ...p, licenseDays: v }))} />
          </Field>
          <Field label="Payroll Reminder (every N weeks)">
            <NumberInput value={alerts.payrollWeeks} onChange={v => setAlerts(p => ({ ...p, payrollWeeks: v }))} />
          </Field>
        </Card>

      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: "#7c6af7", fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: 1 }}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: "100%", background: disabled ? "#0a0f1a" : "#0f172a",
        border: "1px solid #334155", borderRadius: 8,
        padding: "9px 12px", color: disabled ? "#475569" : "#f1f5f9",
        fontSize: 14, boxSizing: "border-box",
      }}
    />
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{
        width: 100, background: "#0f172a", border: "1px solid #334155",
        borderRadius: 8, padding: "9px 12px", color: "#f1f5f9", fontSize: 14,
      }}
    />
  );
}