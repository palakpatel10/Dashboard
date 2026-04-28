"use client";
import { Card, Badge, PageHeader } from "./shared";
import { MOCK } from "../_data/mock";

const TH: React.CSSProperties = {
  padding: "12px 16px", color: "#64748b", fontSize: 12,
  textAlign: "left", fontWeight: 600, textTransform: "uppercase",
};

const TD: React.CSSProperties = { padding: "14px 16px" };

export default function EmployeesPage() {
  return (
    <div>
      <PageHeader title="👥 Employees" actionLabel="+ Add Employee" />

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              <th style={TH}>Name</th>
              <th style={TH}>Role</th>
              <th style={TH}>Pay Type</th>
              <th style={TH}>Rate</th>
              <th style={TH}>Hours This Period</th>
              <th style={TH}>Gross Pay</th>
            </tr>
          </thead>
          <tbody>
            {MOCK.employees.map(e => {
              const gross =
                e.payType === "hourly"
                  ? `$${(e.rate * (e.hours ?? 0)).toLocaleString()}`
                  : `$${e.rate.toLocaleString()}`;

              return (
                <tr key={e.id} style={{ borderTop: "1px solid #334155" }}>
                  <td style={{ ...TD, color: "#f1f5f9", fontWeight: 600 }}>{e.name}</td>
                  <td style={{ ...TD, color: "#94a3b8" }}>{e.role}</td>
                  <td style={TD}>
                    <Badge status="ok" label={e.payType} />
                  </td>
                  <td style={{ ...TD, color: "#f1f5f9" }}>
                    {e.payType === "hourly"
                      ? `$${e.rate}/hr`
                      : `$${e.rate.toLocaleString()}/2wk`}
                  </td>
                  <td style={{ ...TD, color: "#94a3b8" }}>
                    {e.hours ? `${e.hours} hrs` : "Salaried"}
                  </td>
                  <td style={{ ...TD, color: "#4ade80", fontWeight: 700 }}>{gross}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}