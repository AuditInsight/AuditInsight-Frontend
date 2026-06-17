"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpUser, type UserRole } from "@/utils/api";

/* ── inline SVGs ──────────────────────────────────────────────────── */
const EyeIcon = ({ off }: { off?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <path d="M8 21V3M16 21V3M2 12h20" />
  </svg>
);

const AuditorIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

/* ── password strength ────────────────────────────────────────────── */
function getStrength(p: string): { score: number; label: string; color: string } {
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

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

/* ── left panel content per role ──────────────────────────────────── */
const ROLE_CONTENT: Record<"CLIENT" | "AUDITOR", { heading: string; desc: string; bullets: string[] }> = {
  CLIENT: {
    heading: "Manage your organisation's finances",
    desc: "AuditInsight gives your team a single workspace to upload evidence, track transactions, and stay audit-ready.",
    bullets: [
      "Upload & organise financial evidence",
      "Invite team members with defined roles",
      "Track transaction status in real time",
      "Respond to auditor review requests",
    ],
  },
  AUDITOR: {
    heading: "Conduct audits with precision",
    desc: "Review financial data, flag compliance issues, and manage your audit queue — all in one place.",
    bullets: [
      "Access client transaction history",
      "Flag issues and manage review queues",
      "Upload and validate evidence documents",
      "Deliver findings with a full audit trail",
    ],
  },
};

/* ── component ────────────────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<"CLIENT" | "AUDITOR">("CLIENT");
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

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!PASSWORD_PATTERN.test(password)) {
      setError("Password must be 8+ characters with uppercase, lowercase, a number, and a symbol (@$!%*?&).");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signUpUser({ firstName: firstName.trim(), lastName: lastName.trim(), username: email.trim(), password, role });
      if (role === "CLIENT") {
        router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
      } else {
        router.push("/log-in?registered=auditor");
      }
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Sign up failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={shell}>
      {/* ── LEFT PANEL ── */}
      <div style={leftPanel}>
        <div style={logoRow}>
          <div style={logoMark}>
            <ShieldIcon />
          </div>
          <span style={logoText}>AuditInsight</span>
        </div>

        <div style={leftBody}>
          <h2 style={leftHeading}>{content.heading}</h2>
          <p style={leftDesc}>{content.desc}</p>

          <ul style={bulletList}>
            {content.bullets.map((b) => (
              <li key={b} style={bulletItem}>
                <span style={checkBadge}>
                  <CheckIcon size={12} />
                </span>
                <span style={bulletText}>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {role === "AUDITOR" && (
          <div style={approvalNote}>
            <strong>Note:</strong> Auditor accounts are reviewed and approved by an admin before access is granted.
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={rightPanel}>
        <div style={formBox}>
          <div style={formHeader}>
            <h2 style={formTitle}>Create your account</h2>
            <p style={formSubtitle}>Join your team on AuditInsight</p>
          </div>

          {/* error */}
          {error && (
            <div style={errorBanner}>
              <span style={{ fontSize: 15, marginRight: 8 }}>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} style={formEl} noValidate>
            {/* role tabs */}
            <div style={roleTabs}>
              {(["CLIENT", "AUDITOR"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={role === r ? { ...roleTab, ...roleTabActive } : roleTab}
                >
                  <span style={roleTabIcon}>
                    {r === "CLIENT" ? <BuildingIcon /> : <AuditorIcon />}
                  </span>
                  <span style={roleTabContent}>
                    <span style={roleTabTitle}>{r === "CLIENT" ? "Client" : "Auditor"}</span>
                    <span style={roleTabDesc}>
                      {r === "CLIENT" ? "Manage my organisation" : "Conduct audits"}
                    </span>
                  </span>
                  {role === r && (
                    <span style={roleTabCheck}>
                      <CheckIcon size={12} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* name row */}
            <div style={nameRow}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>First name</label>
                <input
                  type="text"
                  placeholder="First"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputEl}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusEl)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, inputEl)}
                  autoComplete="given-name"
                />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Last name</label>
                <input
                  type="text"
                  placeholder="Last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputEl}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusEl)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, inputEl)}
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* email */}
            <div style={fieldGroup}>
              <label style={fieldLabel}>Work email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputEl}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusEl)}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputEl)}
                autoComplete="email"
              />
            </div>

            {/* password */}
            <div style={fieldGroup}>
              <label style={fieldLabel}>Password</label>
              <div style={inputWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputEl, paddingRight: 44 }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputFocusEl, paddingRight: "44px" })}
                  onBlur={(e) => Object.assign(e.currentTarget.style, { ...inputEl, paddingRight: "44px" })}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} style={eyeBtn} tabIndex={-1}>
                  <EyeIcon off={showPassword} />
                </button>
              </div>

              {/* strength bar */}
              {password && (
                <div style={strengthRow}>
                  <div style={strengthTrack}>
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        style={{
                          ...strengthSegment,
                          background: n <= strength.score ? strength.color : "#E2E8F0",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ ...strengthLabel, color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* confirm */}
            <div style={fieldGroup}>
              <label style={fieldLabel}>Confirm password</label>
              <div style={inputWrap}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    ...inputEl,
                    paddingRight: 44,
                    borderColor: confirmPassword && confirmPassword !== password ? "#ef4444" : undefined,
                  }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputFocusEl, paddingRight: "44px" })}
                  onBlur={(e) =>
                    Object.assign(e.currentTarget.style, {
                      ...inputEl,
                      paddingRight: "44px",
                      borderColor: confirmPassword && confirmPassword !== password ? "#ef4444" : "#E2E8F0",
                    })
                  }
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} style={eyeBtn} tabIndex={-1}>
                  <EyeIcon off={showConfirm} />
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <span style={matchError}>Passwords do not match</span>
              )}
              {confirmPassword && confirmPassword === password && (
                <span style={matchOk}>
                  <CheckIcon size={12} /> Passwords match
                </span>
              )}
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={isSubmitting ? { ...submitBtn, opacity: 0.72 } : submitBtn}
            >
              {isSubmitting ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Spinner /> Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p style={switchRow}>
            Already have an account?{" "}
            <Link href="/log-in" style={switchLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── styles ──────────────────────────────────────────────────────── */
const shell: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
};

const leftPanel: React.CSSProperties = {
  width: "42%",
  minHeight: "100vh",
  background: "linear-gradient(160deg, #0c2d6b 0%, #0f3d75 45%, #0d3366 100%)",
  display: "flex",
  flexDirection: "column",
  padding: "48px 52px",
  position: "relative",
  overflow: "hidden",
};

const logoRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 52,
};

const logoMark: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  background: "rgba(255,255,255,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
};

const logoText: React.CSSProperties = {
  color: "#fff",
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: "-0.3px",
};

const leftBody: React.CSSProperties = {
  flex: 1,
};

const leftHeading: React.CSSProperties = {
  color: "#fff",
  fontSize: 24,
  fontWeight: 700,
  margin: "0 0 14px",
  lineHeight: 1.3,
  letterSpacing: "-0.4px",
};

const leftDesc: React.CSSProperties = {
  color: "rgba(255,255,255,0.68)",
  fontSize: 14,
  lineHeight: 1.7,
  margin: "0 0 32px",
};

const bulletList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const bulletItem: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 11,
};

const checkBadge: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: 5,
  background: "rgba(255,255,255,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#7dd3fc",
  flexShrink: 0,
  marginTop: 1,
};

const bulletText: React.CSSProperties = {
  color: "rgba(255,255,255,0.80)",
  fontSize: 13.5,
  lineHeight: 1.5,
};

const approvalNote: React.CSSProperties = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 10,
  padding: "12px 16px",
  fontSize: 13,
  color: "rgba(255,255,255,0.75)",
  lineHeight: 1.5,
  marginTop: 24,
};

/* right panel */
const rightPanel: React.CSSProperties = {
  flex: 1,
  minHeight: "100vh",
  background: "#F8FAFC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 32px",
  overflowY: "auto",
};

const formBox: React.CSSProperties = {
  width: "100%",
  maxWidth: 440,
};

const formHeader: React.CSSProperties = {
  marginBottom: 28,
};

const formTitle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  color: "#0F172A",
  margin: "0 0 6px",
  letterSpacing: "-0.4px",
};

const formSubtitle: React.CSSProperties = {
  fontSize: 14,
  color: "#64748B",
  margin: 0,
};

const errorBanner: React.CSSProperties = {
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  color: "#B91C1C",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 13.5,
  marginBottom: 20,
  display: "flex",
  alignItems: "flex-start",
};

const formEl: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

/* role tabs */
const roleTabs: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginBottom: 22,
};

const roleTab: React.CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 14px",
  borderRadius: 10,
  border: "1.5px solid #E2E8F0",
  background: "#fff",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "inherit",
  position: "relative",
};

const roleTabActive: React.CSSProperties = {
  border: "1.5px solid #1e3a8a",
  background: "rgba(30,58,138,0.04)",
};

const roleTabIcon: React.CSSProperties = {
  color: "#64748B",
  flexShrink: 0,
  display: "flex",
};

const roleTabContent: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  flex: 1,
};

const roleTabTitle: React.CSSProperties = {
  fontSize: 13.5,
  fontWeight: 600,
  color: "#0F172A",
};

const roleTabDesc: React.CSSProperties = {
  fontSize: 11.5,
  color: "#94A3B8",
};

const roleTabCheck: React.CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: "50%",
  background: "#1e3a8a",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

/* fields */
const nameRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
};

const fieldGroup: React.CSSProperties = {
  marginBottom: 16,
  flex: 1,
};

const fieldLabel: React.CSSProperties = {
  display: "block",
  fontSize: 13.5,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};

const inputEl: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid #E2E8F0",
  background: "#fff",
  fontSize: 14.5,
  color: "#0F172A",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const inputFocusEl: React.CSSProperties = {
  ...inputEl,
  borderColor: "#1e3a8a",
  boxShadow: "0 0 0 3px rgba(30,58,138,0.10)",
};

const inputWrap: React.CSSProperties = {
  position: "relative",
};

const eyeBtn: React.CSSProperties = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "#94A3B8",
  cursor: "pointer",
  padding: 4,
  display: "flex",
  alignItems: "center",
};

/* strength */
const strengthRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 7,
};

const strengthTrack: React.CSSProperties = {
  flex: 1,
  display: "flex",
  gap: 4,
};

const strengthSegment: React.CSSProperties = {
  flex: 1,
  height: 4,
  borderRadius: 4,
  transition: "background 0.2s",
};

const strengthLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  minWidth: 46,
  textAlign: "right",
};

/* match feedback */
const matchError: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "#ef4444",
  marginTop: 5,
};

const matchOk: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  fontSize: 12,
  color: "#16a34a",
  marginTop: 5,
};

/* submit */
const submitBtn: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg, #0f3d75, #1e3a8a)",
  color: "#fff",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  marginTop: 4,
  marginBottom: 0,
  fontFamily: "inherit",
  letterSpacing: "0.2px",
};

const switchRow: React.CSSProperties = {
  textAlign: "center",
  marginTop: 20,
  fontSize: 14,
  color: "#64748B",
};

const switchLink: React.CSSProperties = {
  color: "#1e3a8a",
  fontWeight: 600,
  textDecoration: "none",
};
