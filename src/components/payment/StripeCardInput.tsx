"use client";

import { useState } from "react";
import {
  CardBrand,
  detectBrand,
  formatCardNumber,
  formatExpiry,
  maxCardLength,
  luhnCheck,
  isExpiryValid,
  BRAND_COLORS,
  BRAND_LABELS,
} from "./cardUtils";

export interface CardData {
  name: string;
  number: string;       // raw digits only
  expiry: string;       // MM/YY
  cvv: string;
  brand: CardBrand;
  isValid: boolean;
}

interface Props {
  onChange: (data: CardData) => void;
  disabled?: boolean;
}

export default function StripeCardInput({ onChange, disabled }: Props) {
  const [name, setName]         = useState("");
  const [number, setNumber]     = useState("");  // formatted display
  const [expiry, setExpiry]     = useState("");
  const [cvv, setCvv]           = useState("");
  const [focused, setFocused]   = useState<string | null>(null);
  const [touched, setTouched]   = useState<Record<string, boolean>>({});

  const brand = detectBrand(number);
  const rawDigits = number.replace(/\s/g, "");
  const maxLen = maxCardLength(brand);

  const errors = {
    name:   touched.name   && !name.trim()                          ? "Name is required"          : "",
    number: touched.number && (!luhnCheck(rawDigits) || rawDigits.length < maxLen)
                                                                    ? "Invalid card number"        : "",
    expiry: touched.expiry && !isExpiryValid(expiry)                ? "Invalid or expired date"   : "",
    cvv:    touched.cvv    && cvv.length < (brand === "amex" ? 4 : 3) ? "Invalid CVV"             : "",
  };

  const isValid =
    !!name.trim() &&
    luhnCheck(rawDigits) &&
    rawDigits.length === maxLen &&
    isExpiryValid(expiry) &&
    cvv.length >= (brand === "amex" ? 4 : 3);

  const emit = (n: string, num: string, exp: string, c: string, b: CardBrand) => {
    onChange({
      name: n,
      number: num.replace(/\s/g, ""),
      expiry: exp,
      cvv: c,
      brand: b,
      isValid:
        !!n.trim() &&
        luhnCheck(num.replace(/\s/g, "")) &&
        num.replace(/\s/g, "").length === maxCardLength(b) &&
        isExpiryValid(exp) &&
        c.length >= (b === "amex" ? 4 : 3),
    });
  };

  const handleNumber = (raw: string) => {
    const b = detectBrand(raw);
    const formatted = formatCardNumber(raw, b);
    setNumber(formatted);
    emit(name, formatted, expiry, cvv, b);
  };

  const handleExpiry = (raw: string) => {
    const formatted = formatExpiry(raw);
    setExpiry(formatted);
    emit(name, number, formatted, cvv, brand);
  };

  const handleCvv = (raw: string) => {
    const clean = raw.replace(/\D/g, "").slice(0, brand === "amex" ? 4 : 3);
    setCvv(clean);
    emit(name, number, expiry, clean, brand);
  };

  const handleName = (v: string) => {
    setName(v);
    emit(v, number, expiry, cvv, brand);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1.5px solid ${
      errors[field as keyof typeof errors]
        ? "#fca5a5"
        : focused === field
        ? "#1e3a8a"
        : "#e2e8f0"
    }`,
    fontSize: 15,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
    background: disabled ? "#f8fafc" : "#fff",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxShadow: focused === field ? "0 0 0 3px rgba(30,58,138,0.10)" : "none",
    letterSpacing: field === "number" ? "1.5px" : "normal",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* ── Visual card preview ── */}
      <CardPreview name={name} number={number} expiry={expiry} brand={brand} />

      {/* ── Cardholder name ── */}
      <div>
        <label style={labelStyle}>Cardholder name</label>
        <input
          style={inputStyle("name")}
          placeholder="Full name as on card"
          value={name}
          disabled={disabled}
          onChange={(e) => handleName(e.target.value)}
          onFocus={() => setFocused("name")}
          onBlur={() => { setFocused(null); setTouched((t) => ({ ...t, name: true })); }}
          autoComplete="cc-name"
        />
        {errors.name && <span style={errStyle}>{errors.name}</span>}
      </div>

      {/* ── Card number ── */}
      <div>
        <label style={labelStyle}>Card number</label>
        <div style={{ position: "relative" }}>
          <input
            style={{ ...inputStyle("number"), paddingRight: 70 }}
            placeholder="1234 5678 9012 3456"
            value={number}
            disabled={disabled}
            onChange={(e) => handleNumber(e.target.value)}
            onFocus={() => setFocused("number")}
            onBlur={() => { setFocused(null); setTouched((t) => ({ ...t, number: true })); }}
            autoComplete="cc-number"
            inputMode="numeric"
          />
          {/* Brand badge */}
          {brand !== "unknown" && (
            <span style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              fontSize: 11, fontWeight: 800, letterSpacing: "0.5px",
              color: BRAND_COLORS[brand],
              background: `${BRAND_COLORS[brand]}15`,
              padding: "3px 8px", borderRadius: 6,
            }}>
              {BRAND_LABELS[brand]}
            </span>
          )}
        </div>
        {errors.number && <span style={errStyle}>{errors.number}</span>}
        {/* Luhn valid indicator */}
        {rawDigits.length === maxLen && luhnCheck(rawDigits) && (
          <span style={{ fontSize: 12, color: "#16a34a", marginTop: 4, display: "block" }}>
            ✓ Valid card number
          </span>
        )}
      </div>

      {/* ── Expiry + CVV row ── */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Expiry date</label>
          <input
            style={inputStyle("expiry")}
            placeholder="MM/YY"
            value={expiry}
            disabled={disabled}
            onChange={(e) => handleExpiry(e.target.value)}
            onFocus={() => setFocused("expiry")}
            onBlur={() => { setFocused(null); setTouched((t) => ({ ...t, expiry: true })); }}
            autoComplete="cc-exp"
            inputMode="numeric"
          />
          {errors.expiry && <span style={errStyle}>{errors.expiry}</span>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            CVV
            <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6, fontWeight: 400 }}>
              {brand === "amex" ? "(4 digits)" : "(3 digits)"}
            </span>
          </label>
          <input
            style={inputStyle("cvv")}
            placeholder={brand === "amex" ? "••••" : "•••"}
            value={cvv}
            disabled={disabled}
            onChange={(e) => handleCvv(e.target.value)}
            onFocus={() => setFocused("cvv")}
            onBlur={() => { setFocused(null); setTouched((t) => ({ ...t, cvv: true })); }}
            autoComplete="cc-csc"
            inputMode="numeric"
            type="password"
          />
          {errors.cvv && <span style={errStyle}>{errors.cvv}</span>}
        </div>
      </div>
    </div>
  );
}

// ── Visual card preview ────────────────────────────────────────────
function CardPreview({ name, number, expiry, brand }: {
  name: string; number: string; expiry: string; brand: CardBrand;
}) {
  const masked = number
    ? number.padEnd(brand === "amex" ? 17 : 19, "•").slice(0, brand === "amex" ? 17 : 19)
    : "•••• •••• •••• ••••";

  const gradient = brand === "visa"
    ? "linear-gradient(135deg, #1a1f71 0%, #2563eb 100%)"
    : brand === "mastercard"
    ? "linear-gradient(135deg, #1a1a2e 0%, #eb001b 100%)"
    : brand === "amex"
    ? "linear-gradient(135deg, #007bc1 0%, #00b4d8 100%)"
    : brand === "discover"
    ? "linear-gradient(135deg, #ff6600 0%, #ffb347 100%)"
    : "linear-gradient(135deg, #0d2158 0%, #1e3a8a 100%)";

  return (
    <div style={{
      background: gradient,
      borderRadius: 14,
      padding: "20px 22px",
      color: "#fff",
      fontFamily: "'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
      minHeight: 120,
      boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
    }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", top: 20, right: 30, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

      {/* Brand label */}
      {brand !== "unknown" && (
        <div style={{ position: "absolute", top: 16, right: 20, fontSize: 14, fontWeight: 800, letterSpacing: "1px", color: "rgba(255,255,255,0.90)" }}>
          {BRAND_LABELS[brand]}
        </div>
      )}

      {/* Chip */}
      <div style={{ width: 32, height: 24, borderRadius: 4, background: "rgba(255,215,0,0.75)", marginBottom: 16, border: "1px solid rgba(255,215,0,0.4)" }} />

      {/* Card number */}
      <div style={{ fontSize: 16, letterSpacing: "2px", marginBottom: 14, color: "rgba(255,255,255,0.95)" }}>
        {masked}
      </div>

      {/* Name + Expiry */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: "1px", marginBottom: 2 }}>CARD HOLDER</div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "rgba(255,255,255,0.95)", textTransform: "uppercase" }}>
            {name || "YOUR NAME"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: "1px", marginBottom: 2 }}>EXPIRES</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.95)" }}>
            {expiry || "MM/YY"}
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};

const errStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "#dc2626",
  marginTop: 4,
};


