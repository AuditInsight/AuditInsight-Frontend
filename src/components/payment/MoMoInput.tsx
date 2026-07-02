"use client";

import { useState } from "react";
import {
  MoMoData,
  MoMoProvider,
  detectProvider,
  formatPhone,
  isPhoneValid,
  PROVIDER_COLORS,
  PROVIDER_BG,
  PROVIDER_LABELS,
  PROVIDER_EMOJI,
} from "./momoUtils";

interface Props {
  onChange: (data: MoMoData) => void;
  disabled?: boolean;
}

export default function MoMoInput({ onChange, disabled }: Props) {
  const [phone, setPhone]   = useState("");
  const [name, setName]     = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const provider  = detectProvider(phone);
  const phoneValid = isPhoneValid(phone);

  const errors = {
    phone: touched.phone && !phoneValid ? "Enter a valid 10-digit phone number" : "",
    name:  touched.name  && !name.trim() ? "Account holder name is required"    : "",
  };

  const emit = (p: string, n: string) => {
    onChange({
      phone: p.replace(/\D/g, ""),
      provider: detectProvider(p),
      name: n,
      isValid: isPhoneValid(p) && !!n.trim(),
    });
  };

  const handlePhone = (raw: string) => {
    const formatted = formatPhone(raw);
    setPhone(formatted);
    emit(formatted, name);
  };

  const handleName = (v: string) => {
    setName(v);
    emit(phone, v);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1.5px solid ${
      errors[field as keyof typeof errors]
        ? "#fca5a5"
        : focused === field
        ? PROVIDER_COLORS[provider] !== "#94a3b8" ? PROVIDER_COLORS[provider] : "#1e3a8a"
        : "#e2e8f0"
    }`,
    fontSize: 15,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
    background: disabled ? "#f8fafc" : "#fff",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxShadow:
      focused === field
        ? `0 0 0 3px ${PROVIDER_BG[provider]}`
        : "none",
    letterSpacing: field === "phone" ? "1px" : "normal",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Provider banner — shows when detected ── */}
      {provider !== "unknown" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: PROVIDER_BG[provider],
          border: `1.5px solid ${PROVIDER_COLORS[provider]}40`,
          borderRadius: 12, padding: "12px 16px",
        }}>
          <span style={{ fontSize: 24 }}>{PROVIDER_EMOJI[provider]}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
              {PROVIDER_LABELS[provider]} detected
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              A USSD push notification will be sent to this number to confirm payment.
            </div>
          </div>
          <div style={{
            marginLeft: "auto",
            width: 10, height: 10, borderRadius: "50%",
            background: PROVIDER_COLORS[provider],
            boxShadow: `0 0 0 3px ${PROVIDER_COLORS[provider]}30`,
          }} />
        </div>
      )}

      {/* ── Account holder name ── */}
      <div>
        <label style={labelStyle}>Account holder name</label>
        <input
          style={inputStyle("name")}
          placeholder="Full name registered on MoMo"
          value={name}
          disabled={disabled}
          onChange={(e) => handleName(e.target.value)}
          onFocus={() => setFocused("name")}
          onBlur={() => { setFocused(null); setTouched((t) => ({ ...t, name: true })); }}
          autoComplete="name"
        />
        {errors.name && <span style={errStyle}>{errors.name}</span>}
      </div>

      {/* ── Phone number ── */}
      <div>
        <label style={labelStyle}>Mobile Money number</label>
        <div style={{ position: "relative" }}>
          {/* Country flag + code */}
          <div style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "#64748b", fontWeight: 600,
            borderRight: "1px solid #e2e8f0", paddingRight: 10,
            pointerEvents: "none",
          }}>
            🇷🇼 +250
          </div>
          <input
            style={{ ...inputStyle("phone"), paddingLeft: 90 }}
            placeholder="078 123 4567"
            value={phone}
            disabled={disabled}
            onChange={(e) => handlePhone(e.target.value)}
            onFocus={() => setFocused("phone")}
            onBlur={() => { setFocused(null); setTouched((t) => ({ ...t, phone: true })); }}
            inputMode="tel"
            autoComplete="tel"
          />
          {/* Valid checkmark */}
          {phoneValid && (
            <span style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              fontSize: 16, color: "#16a34a",
            }}>✓</span>
          )}
        </div>
        {errors.phone && <span style={errStyle}>{errors.phone}</span>}
        {phoneValid && (
          <span style={{ fontSize: 12, color: "#16a34a", marginTop: 4, display: "block" }}>
            ✓ Valid number
          </span>
        )}
      </div>

      {/* ── How it works ── */}
      <div style={howItWorks}>
        <div style={howTitle}>How Mobile Money payment works</div>
        <div style={howStep}><span style={stepNum}>1</span> Enter your MoMo number above</div>
        <div style={howStep}><span style={stepNum}>2</span> Click &quot;Pay with MoMo&quot;</div>
        <div style={howStep}><span style={stepNum}>3</span> You will receive a USSD push on your phone</div>
        <div style={howStep}><span style={stepNum}>4</span> Enter your MoMo PIN to confirm</div>
        <div style={howStep}><span style={stepNum}>5</span> Payment confirmed — your plan activates instantly</div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600,
  color: "#374151", marginBottom: 6,
};

const errStyle: React.CSSProperties = {
  display: "block", fontSize: 12, color: "#dc2626", marginTop: 4,
};

const howItWorks: React.CSSProperties = {
  background: "#f8fafc", border: "1px solid #e2e8f0",
  borderRadius: 12, padding: "14px 16px",
};

const howTitle: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: "#64748b",
  textTransform: "uppercase", letterSpacing: "0.5px",
  marginBottom: 10,
};

const howStep: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10,
  fontSize: 13, color: "#374151", marginBottom: 6,
};

const stepNum: React.CSSProperties = {
  width: 20, height: 20, borderRadius: "50%",
  background: "#1e3a8a", color: "#fff",
  fontSize: 11, fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
};
