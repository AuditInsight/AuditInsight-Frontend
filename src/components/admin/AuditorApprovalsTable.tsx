"use client";

import { useState } from "react";
import { MockPendingAuditor } from "@/mock/admin.mock";

interface Props {
  auditors: MockPendingAuditor[];
}

export default function AuditorApprovalsTable({ auditors }: Props) {
  const [data, setData] = useState(auditors);

  const approve = (id: number) =>
    setData((prev) => prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a)));

  const reject = (id: number) =>
    setData((prev) => prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" } : a)));

  return (
    <div style={tableWrap}>
      <table style={table}>
        <thead>
          <tr style={headRow}>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>License / Cert #</th>
            <th style={th}>Submitted</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr key={a.id} style={row}>
              <td style={td}>{a.firstName} {a.lastName}</td>
              <td style={td}>{a.email}</td>
              <td style={td}><code style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>{a.certificationNumber}</code></td>
              <td style={td}>{a.submittedAt.split("T")[0]}</td>
              <td style={td}>
                <span style={{ ...badge, ...statusColor[a.status] }}>
                  {a.status}
                </span>
              </td>
              <td style={td}>
                {a.status === "PENDING" ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => approve(a.id)} style={{ ...btn, background: "#16a34a" }}>Approve</button>
                    <button onClick={() => reject(a.id)} style={{ ...btn, background: "#dc2626" }}>Reject</button>
                  </div>
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: 13 }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const statusColor: Record<string, React.CSSProperties> = {
  PENDING:  { background: "#fef3c7", color: "#92400e" },
  APPROVED: { background: "#dcfce7", color: "#15803d" },
  REJECTED: { background: "#fee2e2", color: "#b91c1c" },
};

const tableWrap: React.CSSProperties = { overflowX: "auto", borderRadius: 12, border: "1px solid #e5e7eb" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const headRow: React.CSSProperties = { background: "#f8fafc" };
const th: React.CSSProperties = { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" };
const row: React.CSSProperties = { borderBottom: "1px solid #f1f5f9" };
const td: React.CSSProperties = { padding: "12px 16px", color: "#1f2937" };
const badge: React.CSSProperties = { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 };
const btn: React.CSSProperties = { padding: "5px 14px", borderRadius: 8, border: "none", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 };


