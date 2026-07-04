"use client";

import { useState } from "react";
import { Building2, AlertCircle } from "lucide-react";

interface OrgData {
  orgName: string;
  industry: string;
  employeeCount: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  currencies: string[];
}

interface Props {
  onNext: (data: OrgData) => void;
}

const INDUSTRIES = [
  "NGO / Non-Governmental Organisation",
  "Private Company",
];

const COMMON_CURRENCIES = ["USD", "EUR", "GBP", "RWF", "KES", "ZAR", "NGN", "GHS", "UGX", "TZS"];

// MM-dd format validation
const MM_DD = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export default function OrganisationSetupStep({ onNext }: Props) {
  const [orgName,         setOrgName]         = useState("");
  const [industry,        setIndustry]        = useState("");
  const [fiscalYearStart, setFiscalYearStart] = useState("01-01");
  const [fiscalYearEnd,   setFiscalYearEnd]   = useState("12-31");
  const [employeeCount,   setEmployeeCount]   = useState("");
  const [currencies,      setCurrencies]      = useState<string[]>(["USD"]);
  const [error,           setError]           = useState("");

  const toggleCurrency = (c: string) => {
    setCurrencies((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleNext = () => {
    if (!orgName.trim())              { setError("Organisation name is required."); return; }
    if (!industry)                    { setError("Please select your industry."); return; }
    if (!MM_DD.test(fiscalYearStart)) { setError("Fiscal year start must be in MM-DD format (e.g. 01-01)."); return; }
    if (!MM_DD.test(fiscalYearEnd))   { setError("Fiscal year end must be in MM-DD format (e.g. 12-31)."); return; }
    if (!employeeCount.trim())         { setError("Number of employees is required."); return; }
    if (currencies.length === 0)        { setError("Please select at least one currency."); return; }
    setError("");
    onNext({ orgName: orgName.trim(), industry, employeeCount: employeeCount.trim(), fiscalYearStart, fiscalYearEnd, currencies });
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

      {/* Org name */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Organisation name <span style={s.req}>*</span></label>
        <input style={s.input} placeholder="e.g. Acme Corp" value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          onFocus={(e) => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
          onBlur={(e)  => Object.assign(e.currentTarget.style, { borderColor: "#e2e8f0", boxShadow: "none" })} />
      </div>

      {/* Industry */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Industry <span style={s.req}>*</span></label>
        <select style={s.select} value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="">Select industry</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      {/* Number of employees */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Number of employees <span style={s.req}>*</span></label>
        <select style={s.select} value={employeeCount} onChange={(e) => setEmployeeCount(e.target.value)}>
          <option value="">Select range</option>
          <option value="1–10">1 – 10</option>
          <option value="11–50">11 – 50</option>
          <option value="51–100">51 – 100</option>
          <option value="101–250">101 – 250</option>
          <option value="251–500">251 – 500</option>
          <option value="501–1000">501 – 1,000</option>
          <option value="1001+">1,001+</option>
        </select>
      </div>

      {/* Fiscal year */}
      <div style={s.row}>
        <div style={{ ...s.fieldGroup, flex: 1 }}>
          <label style={s.label}>Fiscal year start <span style={s.req}>*</span></label>
          <input style={s.input} placeholder="01-01" value={fiscalYearStart}
            onChange={(e) => setFiscalYearStart(e.target.value)}
            onFocus={(e) => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
            onBlur={(e)  => Object.assign(e.currentTarget.style, { borderColor: "#e2e8f0", boxShadow: "none" })} />
          <span style={s.hint}>MM-DD format</span>
        </div>
        <div style={{ ...s.fieldGroup, flex: 1 }}>
          <label style={s.label}>Fiscal year end <span style={s.req}>*</span></label>
          <input style={s.input} placeholder="12-31" value={fiscalYearEnd}
            onChange={(e) => setFiscalYearEnd(e.target.value)}
            onFocus={(e) => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
            onBlur={(e)  => Object.assign(e.currentTarget.style, { borderColor: "#e2e8f0", boxShadow: "none" })} />
          <span style={s.hint}>MM-DD format</span>
        </div>
      </div>

      {/* Currencies */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Currencies <span style={s.req}>*</span></label>
        <div style={s.currencyGrid}>
          {COMMON_CURRENCIES.map((c) => {
            const selected = currencies.includes(c);
            return (
              <button key={c} type="button" onClick={() => toggleCurrency(c)}
                style={{ ...s.currencyBtn, ...(selected ? s.currencyBtnActive : {}) }}>
                {c}
              </button>
            );
          })}
        </div>
        {currencies.length > 0 && (
          <span style={s.hint}>Selected: {currencies.join(", ")}</span>
        )}
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
  heading: { fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.4px", textAlign: "center" },
  sub: { fontSize: 14, color: "#64748b", margin: "0 0 28px", textAlign: "center", lineHeight: 1.6 },
  errBanner: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 10, padding: "10px 14px", fontSize: 13.5, marginBottom: 18, width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 8 },
  fieldGroup: { marginBottom: 16, width: "100%" },
  row: { display: "flex", gap: 12, width: "100%" },
  label: { display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 6 },
  req: { color: "#ef4444" },
  hint: { display: "block", fontSize: 11.5, color: "#94a3b8", marginTop: 4 },
  input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff", transition: "border-color 0.15s" },
  select: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" },
  currencyGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  currencyBtn: { padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit" },
  currencyBtnActive: { border: "1.5px solid #1e3a8a", background: "rgba(30,58,138,0.06)", color: "#1e3a8a", fontWeight: 700 },
  btn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 8, fontFamily: "inherit", letterSpacing: "0.2px" },
};
