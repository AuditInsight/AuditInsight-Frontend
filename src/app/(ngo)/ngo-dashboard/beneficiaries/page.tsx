"use client";

import { useState } from "react";
import NGOPageLayout from "@/components/ngo-dashboard/NGOPageLayout";
import { useNGOToast } from "@/components/ngo-dashboard/NGOPageLayout";
import { ProtectedRoute } from "@/components/Guards";
import { Users, Search, Download, Plus, MapPin, Phone } from "lucide-react";

const BENEFICIARIES = [
  { id: "BEN-001", name: "Uwimana Marie",    project: "Girls Education Programme",  district: "Kigali",    phone: "+250 78x xxx xxx", status: "Active",   amount: "RWF 80,000" },
  { id: "BEN-002", name: "Habimana Jean",    project: "Community Health Outreach",  district: "Musanze",   phone: "+250 72x xxx xxx", status: "Active",   amount: "RWF 0" },
  { id: "BEN-003", name: "Mukamana Alice",   project: "Girls Education Programme",  district: "Huye",      phone: "+250 73x xxx xxx", status: "Active",   amount: "RWF 80,000" },
  { id: "BEN-004", name: "Niyonzima Paul",   project: "Food Security Project",      district: "Nyamagabe", phone: "+250 78x xxx xxx", status: "Active",   amount: "RWF 16,000" },
  { id: "BEN-005", name: "Ingabire Diane",   project: "Girls Education Programme",  district: "Kigali",    phone: "+250 72x xxx xxx", status: "Inactive", amount: "RWF 80,000" },
  { id: "BEN-006", name: "Bizimana Eric",    project: "Food Security Project",      district: "Gisagara",  phone: "+250 73x xxx xxx", status: "Active",   amount: "RWF 16,000" },
  { id: "BEN-007", name: "Uwase Claudine",   project: "Community Health Outreach",  district: "Rubavu",    phone: "+250 78x xxx xxx", status: "Active",   amount: "RWF 0" },
  { id: "BEN-008", name: "Nkurunziza David", project: "Clean Water Initiative",     district: "Musanze",   phone: "+250 72x xxx xxx", status: "Active",   amount: "RWF 0" },
  { id: "BEN-009", name: "Mukandori Rose",   project: "Girls Education Programme",  district: "Nyanza",    phone: "+250 73x xxx xxx", status: "Active",   amount: "RWF 80,000" },
  { id: "BEN-010", name: "Gasana Patrick",   project: "Food Security Project",      district: "Muhanga",   phone: "+250 78x xxx xxx", status: "Active",   amount: "RWF 16,000" },
];

const PROJECTS = Array.from(new Set(BENEFICIARIES.map(b => b.project)));

export default function BeneficiariesPage() {
  const [search, setSearch]   = useState("");
  const [project, setProject] = useState("ALL");
  const toast = useNGOToast();

  const filtered = BENEFICIARIES.filter(b => {
    if (project !== "ALL" && b.project !== project) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.district.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    }
    return true;
  });

  const active   = BENEFICIARIES.filter(b => b.status === "Active").length;
  const inactive = BENEFICIARIES.filter(b => b.status === "Inactive").length;

  return (
    <ProtectedRoute>
      <NGOPageLayout pageTitle="Beneficiary Registers" pageSub="Manage and verify beneficiary records across all projects.">
        {/* Stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Beneficiaries", value: BENEFICIARIES.length, color: "#1e3a8a" },
            { label: "Active",              value: active,               color: "#16a34a" },
            { label: "Inactive",            value: inactive,             color: "#94a3b8" },
            { label: "Projects Covered",    value: PROJECTS.length,      color: "#7c3aed" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex: 1, minWidth: 130, background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12.5, color: "#64748b" }}>{label}</span>
                <Users size={16} style={{ color }} />
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
            <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <Search size={13} style={{ color: "#94a3b8" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, district…"
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, fontFamily: "inherit", width: "100%" }} />
            </div>
            <select value={project} onChange={e => setProject(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
              <option value="ALL">All Projects</option>
              {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
              <button onClick={() => toast.warning("Coming soon", "Export will be available once connected to backend.")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                <Download size={13} /> Export
              </button>
              <button onClick={() => toast.warning("Coming soon", "Add beneficiary form will be available soon.")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: "none", background: "#0f172a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <Plus size={13} /> Add Beneficiary
              </button>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                {["ID", "Name", "Project", "District", "Contact", "Support Amount", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                    No beneficiaries match your search.
                  </td>
                </tr>
              ) : filtered.map((b, i) => (
                <tr key={b.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>{b.id}</span>
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 600, color: "#0f172a" }}>{b.name}</td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 12.5, color: "#475569" }}>{b.project}</td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#475569" }}>
                      <MapPin size={12} style={{ color: "#94a3b8" }} />{b.district}
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#475569" }}>
                      <Phone size={12} style={{ color: "#94a3b8" }} />{b.phone}
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 600, color: "#0f172a" }}>{b.amount}</td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, color: b.status === "Active" ? "#16a34a" : "#94a3b8", background: b.status === "Active" ? "#f0fdf4" : "#f8fafc", border: `1px solid ${b.status === "Active" ? "#bbf7d0" : "#e2e8f0"}` }}>{b.status}</span>
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <button onClick={() => toast.success("Opening record", `Viewing profile for ${b.name}`)} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", fontSize: 12.5, color: "#94a3b8" }}>
            Showing {filtered.length} of {BENEFICIARIES.length} beneficiaries
          </div>
        </div>
      </NGOPageLayout>
    </ProtectedRoute>
  );
}
