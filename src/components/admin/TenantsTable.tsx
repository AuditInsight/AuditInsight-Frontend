"use client";

import { useState } from "react";
import { MockTenant } from "@/mock/admin.mock";

interface Props {
  tenants: MockTenant[];
}

export default function TenantsTable({ tenants }: Props) {
  const [data, setData] = useState(tenants);

  const toggleBlock = (id: string) => {
    setData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isBlocked: !t.isBlocked } : t))
    );
  };

  return (
    <div style={tableWrap}>
      <table style={table}>
        <thead>
          <tr style={headRow}>
            <th style={th}>Company</th>
            <th style={th}>Industry</th>
            <th style={th}>Owner Email</th>
            <th style={th}>Registered</th>
            <th style={th}>Billing</th>
            <th style={th}>Status</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((t) => (
            <tr key={t.id} style={row}>
              <td style={td}>{t.name}</td>
              <td style={td}>{t.industry}</td>
              <td style={td}>{t.ownerEmail}</td>
              <td style={td}>{t.createdAt}</td>
              <td style={td}>
                <span style={{ ...billingBadge, background: t.billingStatus === "PAID" ? "#dcfce7" : "#fee2e2", color: t.billingStatus === "PAID" ? "#15803d" : "#b91c1c" }}>
                  {t.billingStatus === "PAID" ? "🟢 PAID" : "🔴 UNPAID"}
                </span>
              </td>
              <td style={td}>
                <span style={{ ...statusBadge, background: t.isBlocked ? "#fef9c3" : "#f0fdf4", color: t.isBlocked ? "#92400e" : "#166534" }}>
                  {t.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td style={td}>
                <button onClick={() => toggleBlock(t.id)} style={{ ...actionBtn, background: t.isBlocked ? "#1e3a8a" : "#ef4444" }}>
                  {t.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableWrap: React.CSSProperties = { overflowX: "auto", borderRadius: 12, border: "1px solid #e5e7eb" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const headRow: React.CSSProperties = { background: "#f8fafc" };
const th: React.CSSProperties = { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" };
const row: React.CSSProperties = { borderBottom: "1px solid #f1f5f9" };
const td: React.CSSProperties = { padding: "12px 16px", color: "#1f2937" };
const billingBadge: React.CSSProperties = { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 };
const statusBadge: React.CSSProperties = { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 };
const actionBtn: React.CSSProperties = { padding: "5px 14px", borderRadius: 8, border: "none", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 };


