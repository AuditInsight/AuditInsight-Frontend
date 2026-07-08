"use client";

import NGOPageLayout from "@/components/ngo/NGOPageLayout";
import { ProtectedRoute } from "@/components/Guards";
import { NGO_TRANSACTIONS } from "@/mock/ngo.mock";
import { FolderOpen, DollarSign, CheckCircle2, Clock, Users } from "lucide-react";

const PROJECTS = Array.from(new Set(NGO_TRANSACTIONS.map(t => t.projectName))).map(name => {
  const txns    = NGO_TRANSACTIONS.filter(t => t.projectName === name);
  const donor   = txns[0]?.donor ?? "—";
  const budget  = txns.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const spent   = txns.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const burn    = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const flagged = txns.filter(t => t.status === "FLAGGED").length;
  const pending = txns.filter(t => t.status === "PENDING").length;
  const complete = txns.filter(t => t.status === "COMPLETED").length;
  const status  = flagged > 0 ? "AT RISK" : pending > 0 ? "IN PROGRESS" : "ON TRACK";
  const statusColor = flagged > 0 ? "#dc2626" : pending > 0 ? "#d97706" : "#16a34a";
  const statusBg    = flagged > 0 ? "#fef2f2" : pending > 0 ? "#fffbeb" : "#f0fdf4";
  return { name, donor, budget, spent, burn, flagged, pending, complete, txns: txns.length, status, statusColor, statusBg };
});

const ACTIVITIES = [
  { project: "Community Health Outreach",  activity: "Q3 Medical Supply Distribution",    date: "2024-07-02", status: "Completed", beneficiaries: 1240 },
  { project: "Community Health Outreach",  activity: "Community Health Worker Training",  date: "2024-07-05", status: "Flagged",   beneficiaries: 48 },
  { project: "Girls Education Programme",  activity: "Term 2 Scholarship Disbursement",   date: "2024-07-08", status: "Completed", beneficiaries: 120 },
  { project: "Girls Education Programme",  activity: "Programme Officer Payroll — July",  date: "2024-07-10", status: "Pending",   beneficiaries: 0 },
  { project: "Clean Water Initiative",     activity: "Borehole Drilling — Musanze",       date: "2024-07-12", status: "Completed", beneficiaries: 3500 },
  { project: "Clean Water Initiative",     activity: "Water Purification Equipment",      date: "2024-07-14", status: "Flagged",   beneficiaries: 0 },
  { project: "Food Security Project",      activity: "Food Distribution — 350 HH",       date: "2024-07-15", status: "Pending",   beneficiaries: 350 },
  { project: "Food Security Project",      activity: "M&E Field Visit — Southern Province", date: "2024-07-17", status: "Flagged", beneficiaries: 0 },
];

const ACT_CFG = {
  Completed: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  Pending:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Flagged:   { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

export default function ProjectsPage() {
  const totalBeneficiaries = ACTIVITIES.reduce((s, a) => s + a.beneficiaries, 0);

  return (
    <ProtectedRoute>
      <NGOPageLayout pageTitle="Project Activities" pageSub="Monitor progress, budgets, and activities across all active projects.">
        {/* Summary */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Active Projects",    value: PROJECTS.length,    color: "#1e3a8a", icon: <FolderOpen size={16} /> },
            { label: "Total Budget",       value: `RWF ${(PROJECTS.reduce((s, p) => s + p.budget, 0) / 1_000_000).toFixed(0)}M`, color: "#7c3aed", icon: <DollarSign size={16} /> },
            { label: "Beneficiaries",      value: totalBeneficiaries.toLocaleString(), color: "#0891b2", icon: <Users size={16} /> },
            { label: "Completed Activities", value: ACTIVITIES.filter(a => a.status === "Completed").length, color: "#16a34a", icon: <CheckCircle2 size={16} /> },
          ].map(({ label, value, color, icon }) => (
            <div key={label} style={{ flex: 1, minWidth: 140, background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12.5, color: "#64748b" }}>{label}</span>
                <span style={{ color }}>{icon}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Project cards */}
        <div>
          <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Project Overview</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {PROJECTS.map(p => (
              <div key={p.name} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
                <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.name}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b" }}>Donor: {p.donor}</p>
                    </div>
                    <span style={{ padding: "3px 9px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, color: p.statusColor, background: p.statusBg, whiteSpace: "nowrap" as const }}>{p.status}</span>
                  </div>
                </div>
                <div style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Budget utilisation</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{p.burn}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: "#f1f5f9", overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ height: "100%", width: `${p.burn}%`, background: p.burn > 90 ? "#dc2626" : "#1e3a8a", borderRadius: 999 }} />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[
                      { label: "Transactions", value: p.txns },
                      { label: "Complete",     value: p.complete, color: "#16a34a" },
                      { label: "Pending",      value: p.pending,  color: "#d97706" },
                      { label: "Flagged",      value: p.flagged,  color: "#dc2626" },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ flex: 1, textAlign: "center" as const }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: color ?? "#0f172a" }}>{value}</div>
                        <div style={{ fontSize: 10.5, color: "#94a3b8" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Activity Log</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#64748b" }}>All recorded project activities and their current status.</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                {["Activity", "Project", "Date", "Beneficiaries", "Status"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTIVITIES.map((a, i) => {
                const cfg = ACT_CFG[a.status as keyof typeof ACT_CFG];
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13.5, fontWeight: 500, color: "#0f172a" }}>{a.activity}</td>
                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 12.5, color: "#475569" }}>{a.project}</td>
                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 12.5, color: "#475569", whiteSpace: "nowrap" as const }}>{new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{a.beneficiaries > 0 ? a.beneficiaries.toLocaleString() : "—"}</td>
                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{a.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </NGOPageLayout>
    </ProtectedRoute>
  );
}


