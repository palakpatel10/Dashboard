"use client";
import { Card, Badge, PageHeader, TableWrapper, useIsMobile } from "./shared";
import { MOCK } from "../_data/mock";

const TH: React.CSSProperties = {
  padding: "12px 16px", color: "#64748b", fontSize: 12,
  textAlign: "left", fontWeight: 600, textTransform: "uppercase",
  whiteSpace: "nowrap",
};
const TD: React.CSSProperties = { padding: "14px 16px", whiteSpace: "nowrap" };

export default function EmployeesPage() {
  const isMobile = useIsMobile();

  return (
    <div>
      <PageHeader title="👥 Employees" actionLabel="+ Add Employee" />

      {/* Mobile — card view */}
      {isMobile ? (
        <div style={{ display: "grid", gap: 12 }}>
          {MOCK.employees.map(e => {
            const gross = e.payType === "hourly"
              ? `$${(e.rate * (e.hours ?? 0)).toLocaleString()}`
              : `$${e.rate.toLocaleString()}`;
            return (
              <Card key={e.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>{e.name}</div>
                    <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{e.role}</div>
                  </div>
                  <Badge status="ok" label={e.payType} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Rate</div>
                    <div style={{ color: "#f1f5f9", fontSize: 14 }}>
                      {e.payType === "hourly" ? `$${e.rate}/hr` : `$${e.rate.toLocaleString()}/2wk`}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Hours</div>
                    <div style={{ color: "#94a3b8", fontSize: 14 }}>{e.hours ? `${e.hours} hrs` : "Salaried"}</div>
                  </div>
                  <div>
                    <div style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Gross Pay</div>
                    <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 16 }}>{gross}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Desktop — table view */
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <TableWrapper>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  <th style={TH}>Name</th>
                  <th style={TH}>Role</th>
                  <th style={TH}>Pay Type</th>
                  <th style={TH}>Rate</th>
                  <th style={TH}>Hours</th>
                  <th style={TH}>Gross Pay</th>
                </tr>
              </thead>
              <tbody>
                {MOCK.employees.map(e => {
                  const gross = e.payType === "hourly"
                    ? `$${(e.rate * (e.hours ?? 0)).toLocaleString()}`
                    : `$${e.rate.toLocaleString()}`;
                  return (
                    <tr key={e.id} style={{ borderTop: "1px solid #334155" }}>
                      <td style={{ ...TD, color: "#f1f5f9", fontWeight: 600 }}>{e.name}</td>
                      <td style={{ ...TD, color: "#94a3b8" }}>{e.role}</td>
                      <td style={TD}><Badge status="ok" label={e.payType} /></td>
                      <td style={{ ...TD, color: "#f1f5f9" }}>
                        {e.payType === "hourly" ? `$${e.rate}/hr` : `$${e.rate.toLocaleString()}/2wk`}
                      </td>
                      <td style={{ ...TD, color: "#94a3b8" }}>{e.hours ? `${e.hours} hrs` : "Salaried"}</td>
                      <td style={{ ...TD, color: "#4ade80", fontWeight: 700 }}>{gross}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrapper>
        </Card>
      )}
    </div>
  );
}