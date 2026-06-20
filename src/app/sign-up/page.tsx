"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, Building2, ClipboardCheck, Check, Loader2 } from "lucide-react";
import { buildSignupOtpMeta } from "@/mock/auth.mock";

type UserRole = "CLIENT" | "AUDITOR";

function getStrength(p: string) {
  if (!p) return { score: 0, label: "", color: "" };
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[@$!%*?&]/.test(p)) s++;
  if (s <= 1) return { score: s, label: "Weak", color: "#ef4444" };
  if (s === 2) return { score: s, label: "Fair", color: "#f97316" };
  if (s === 3) return { score: s, label: "Good", color: "#eab308" };
  return { score: s, label: "Strong", color: "#22c55e" };
}

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ROLE_CONTENT: Record<UserRole, { heading: string; desc: string; bullets: string[] }> = {
  CLIENT: {
    heading: "Manage your organisation's finances",
    desc: "AuditInsight gives your team a single workspace to upload evidence, track transactions, and stay audit-ready.",
    bullets: ["Upload & organise financial evidence", "Invite auditors & accountants directly", "Track transaction status in real time", "Respond to auditor review requests"],
  },
  AUDITOR: {
    heading: "Conduct audits with precision",
    desc: "Review financial data, flag compliance issues, and manage your audit queue — all in one place.",
    bullets: ["Access client transaction history", "Flag issues and manage review queues", "Upload and validate evidence documents", "Deliver findings with a full audit trail"],
  },
};

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("CLIENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const strength = getStrength(password);
  const content = ROLE_CONTENT[role];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim()) { setError("Please enter your first and last name."); return; }
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!PASSWORD_PATTERN.test(password)) { setError("Password must be 8+ chars with uppercase, number and symbol (@$!%*?&)."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setIsSubmitting(true);
    const trimmedEmail = email.trim().toLowerCase();
    localStorage.setItem("signup_email", trimmedEmail);
    localStorage.setItem("signup_role", role);
    localStorage.setItem("signup_name", `${firstName.trim()} ${lastName.trim()}`);
    localStorage.setItem("signup_password", password);
    if (role === "CLIENT") {
      localStorage.setItem("signup_otp_meta", JSON.stringify(buildSignupOtpMeta(trimmedEmail)));
    }
    await new Promise((r) => setTimeout(r, 600));
    if (role === "CLIENT") {
      router.push(`/verify-otp?email=${encodeURIComponent(trimmedEmail)}&next=/onboarding`);
    } else {
      router.push("/log-in?registered=auditor");
    }
    setIsSubmitting(false);
  };

  return (
    <div style={s.shell}>
      {/* LEFT */}
      <div style={s.left}>
        <div style={s.logoRow}>
          <div style={s.logoMark}><Shield size={18} strokeWidth={2} /></div>
          <span style={s.logoText}>AuditInsight</span>
        </div>
        <div style={s.leftBody}>
          <h2 style={s.leftHeading}>{content.heading}</h2>
          <p style={s.leftDesc}>{content.desc}</p>
          <ul style={s.bullets}>
            {content.bullets.map((b) => (
              <li key={b} style={s.bulletItem}>
                <span style={s.checkBadge}><Check size={11} strokeWidth={3} /></span>
                <span style={s.bulletText}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        {role === "AUDITOR" && (
          <div style={s.approvalNote}>
            <strong>Note:</strong> Auditor accounts are reviewed and approved by an admin before access is granted.
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div style={s.right}>
        <div style={s.formBox}>
          <div style={s.formHeader}>
            <h2 style={s.formTitle}>Create your account</h2>
            <p style={s.formSubtitle}>Join your team on AuditInsight</p>
          </div>

          {error && (
            <div style={s.errorBanner}>
              <Shield size={14} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSignup} noValidate style={{ display: "flex", flexDirection: "column" }}>
            {/* Role tabs */}
            <div style={s.roleTabs}>
              {(["CLIENT", "AUDITOR"] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  style={{ ...s.roleTab, ...(role === r ? s.roleTabActive : {}) }}>
                  <span style={{ color: "#64748b", display: "flex" }}>
                    {r === "CLIENT" ? <Building2 size={20} /> : <ClipboardCheck size={20} />}
                  </span>
                  <span style={s.roleTabContent}>
                    <span style={s.roleTabTitle}>{r === "CLIENT" ? "Organisation Admin" : "Auditor"}</span>
                    <span style={s.roleTabDesc}>{r === "CLIENT" ? "Register & manage my organisation" : "Conduct audits"}</span>
                  </span>
                  {role === r && <span style={s.roleTabCheck}><Check size={11} strokeWidth={3} /></span>}
                </button>
              ))}
            </div>

            {/* Name row */}
            <div style={{ display: "flex", gap: 12 }}>
              {[["First name", "First", firstName, setFirstName, "given-name"], ["Last name", "Last", lastName, setLastName, "family-name"]].map(([label, placeholder, value, setter, autoComplete]) => (
                <div key={label as string} style={{ flex: 1, marginBottom: 16 }}>
                  <label style={s.label}>{label as string}</label>
                  <input type="text" placeholder={placeholder as string} value={value as string}
                    onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                    style={s.input} autoComplete={autoComplete as string}
                    onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, s.input)} />
                </div>
              ))}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Work email</label>
              <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)}
                style={s.input} autoComplete="email"
                onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, s.input)} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} placeholder="Create a strong password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  style={{ ...s.input, paddingRight: 44 }} autoComplete="new-password"
                  onFocus={(e) => Object.assign(e.currentTarget.style, { ...s.inputFocus, paddingRight: "44px" })}
                  onBlur={(e) => Object.assign(e.currentTarget.style, { ...s.input, paddingRight: "44px" })} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} style={s.eyeBtn}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 7 }}>
                  <div style={{ flex: 1, display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} style={{ flex: 1, height: 4, borderRadius: 4, transition: "background 0.2s", background: n <= strength.score ? strength.color : "#e2e8f0" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: strength.color, minWidth: 46, textAlign: "right" }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Confirm password</label>
              <div style={{ position: "relative" }}>
                <input type={showConfirm ? "text" : "password"} placeholder="Re-enter your password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ ...s.input, paddingRight: 44, borderColor: confirmPassword && confirmPassword !== password ? "#ef4444" : undefined }}
                  autoComplete="new-password"
                  onFocus={(e) => Object.assign(e.currentTarget.style, { ...s.inputFocus, paddingRight: "44px" })}
                  onBlur={(e) => Object.assign(e.currentTarget.style, { ...s.input, paddingRight: "44px" })} />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} style={s.eyeBtn}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && <span style={{ fontSize: 12, color: "#ef4444", marginTop: 5, display: "block" }}>Passwords do not match</span>}
              {confirmPassword && confirmPassword === password && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#16a34a", marginTop: 5 }}>
                  <Check size={12} /> Passwords match
                </span>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} style={{ ...s.submitBtn, opacity: isSubmitting ? 0.72 : 1 }}>
              {isSubmitting ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Creating account…
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#64748b" }}>
            Already have an account?{" "}
            <Link href="/log-in" style={{ color: "#1e3a8a", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: { minHeight: "100vh", display: "flex" },
  left: { width: "42%", minHeight: "100vh", background: "linear-gradient(160deg,#0c2d6b 0%,#0f3d75 45%,#0d3366 100%)", display: "flex", flexDirection: "column", padding: "48px 52px", position: "relative", overflow: "hidden" },
  logoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 52 },
  logoMark: { width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  logoText: { color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" },
  leftBody: { flex: 1 },
  leftHeading: { color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 14px", lineHeight: 1.3, letterSpacing: "-0.4px" },
  leftDesc: { color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.7, margin: "0 0 32px" },
  bullets: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 },
  bulletItem: { display: "flex", alignItems: "flex-start", gap: 11 },
  checkBadge: { width: 20, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7dd3fc", flexShrink: 0, marginTop: 1 },
  bulletText: { color: "rgba(255,255,255,0.80)", fontSize: 13.5, lineHeight: 1.5 },
  approvalNote: { background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginTop: 24 },
  right: { flex: 1, minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", overflowY: "auto" },
  formBox: { width: "100%", maxWidth: 440 },
  formHeader: { marginBottom: 28 },
  formTitle: { fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.4px" },
  formSubtitle: { fontSize: 14, color: "#64748b", margin: 0 },
  errorBanner: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 10, padding: "11px 14px", fontSize: 13.5, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 },
  roleTabs: { display: "flex", gap: 10, marginBottom: 22 },
  roleTab: { flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", textAlign: "left", fontFamily: "inherit", position: "relative" },
  roleTabActive: { border: "1.5px solid #1e3a8a", background: "rgba(30,58,138,0.04)" },
  roleTabContent: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  roleTabTitle: { fontSize: 13.5, fontWeight: 600, color: "#0f172a" },
  roleTabDesc: { fontSize: 11.5, color: "#94a3b8" },
  roleTabCheck: { width: 18, height: 18, borderRadius: "50%", background: "#1e3a8a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  label: { display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 6 },
  input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 14.5, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  inputFocus: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #1e3a8a", background: "#fff", fontSize: 14.5, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" },
  eyeBtn: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" },
  submitBtn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 4, fontFamily: "inherit", letterSpacing: "0.2px" },
};
