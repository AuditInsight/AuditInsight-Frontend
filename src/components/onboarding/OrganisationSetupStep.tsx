"use client";

import { useState } from "react";
import { Building2, AlertCircle } from "lucide-react";

interface OrgData {
  orgName: string;
  industry: string;
  size: string;
  country: string;
}

interface Props {
  onNext: (data: OrgData) => void;
}

const INDUSTRIES = [
  "Financial Services", "Healthcare", "Technology", "Retail",
  "Manufacturing", "Government", "Education", "Real Estate", "Non-profit", "Other",
];

const ORG_SIZES = [
  "1–10 employees", "11–50 employees", "51–200 employees",
  "201–500 employees", "500+ employees",
];

export default function OrganisationSetupStep({ onNext }: Props) {
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!orgName.trim()) { setError("Organisation name is required."); return; }
    if (!industry) { setError("Please select your industry."); return; }
    if (!size) { setError("Please select your organisation size."); return; }
    setError("");
    onNext({ orgName: orgName.trim(), industry, size, country: country || "Not specified" });
  };

  return (
    <div style={s.wrap}>
      <div style={s.iconWrap}>
        <Building2 size={28} color="#1e3a8a" strokeWidth={1.5} />
      </div>
      <h2 style={s.heading}>Set up your organisation</h2>
      <p style={s.sub}>Tell us about your company so we can personalise your experience.</p>

      {error && (
        <div style={s.errBanner}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      <div style={s.fieldGroup}>
        <label style={s.label}>Organisation name <span style={s.req}>*</span></label>
        <input
          style={s.input}
          placeholder="e.g. Acme Corp"
          value={orgName}
          onChange={e => setOrgName(e.target.value)}
          onFocus={e => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
          onBlur={e => Object.assign(e.currentTarget.style, { borderColor: "#E2E8F0", boxShadow: "none" })}
        />
      </div>

      <div style={s.row}>
        <div style={{ ...s.fieldGroup, flex: 1 }}>
          <label style={s.label}>Industry <span style={s.req}>*</span></label>
          <select style={s.select} value={industry} onChange={e => setIndustry(e.target.value)}>
            <option value="">Select industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div style={{ ...s.fieldGroup, flex: 1 }}>
          <label style={s.label}>Organisation size <span style={s.req}>*</span></label>
          <select style={s.select} value={size} onChange={e => setSize(e.target.value)}>
            <option value="">Select size</option>
            {ORG_SIZES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div style={s.fieldGroup}>
        <label style={s.label}>Country</label>
        <input
          style={s.input}
          placeholder="e.g. South Africa"
          value={country}
          onChange={e => setCountry(e.target.value)}
          onFocus={e => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
          onBlur={e => Object.assign(e.currentTarget.style, { borderColor: "#E2E8F0", boxShadow: "none" })}
        />
      </div>

      <button style={s.btn} onClick={handleNext}>
        Continue to Pricing →
      </button>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 520, margin: "0 auto", width: "100%" },
  iconWrap: { width: 60, height: 60, borderRadius: "50%", background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  heading: { fontSize: 26, fontWeight: 700, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.4px", textAlign: "center" },
  sub: { fontSize: 14, color: "#64748B", margin: "0 0 28px", textAlign: "center", lineHeight: 1.6 },
  errBanner: { background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 14px", fontSize: 13.5, marginBottom: 18, width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 8 },
  fieldGroup: { marginBottom: 16, width: "100%" },
  row: { display: "flex", gap: 12, width: "100%" },
  label: { display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 6 },
  req: { color: "#ef4444" },
  input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff", transition: "border-color 0.15s" },
  select: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" },
  btn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 8, fontFamily: "inherit", letterSpacing: "0.2px" },
};
