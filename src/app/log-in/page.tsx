"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
/*
 * import { loginUser } from "@/utils/api"; // ── REAL API (commented for RBAC UI testing)
 */

/* ── tiny inline SVGs ────────────────────────────────────────────── */
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

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/* ── feature list ─────────────────────────────────────────────────── */
const FEATURES = [
  { text: "Real-time transaction monitoring" },
  { text: "Evidence management & document trails" },
  { text: "Multi-role team collaboration" },
  { text: "Compliance flagging & review queues" },
];

/* ── main form ────────────────────────────────────────────────────── */
/* ── dev accounts ────────────────────────────────────────────────── */
const DEV_ACCOUNTS = [
  { role: "CLIENT",  label: "Org Admin",     email: "ceo@insightai.rw",          password: "demo1234", color: "#1e3a8a", bg: "#eff6ff", icon: "🏢" },
  { role: "MEMBER",  label: "Accountant",    email: "accountant@insightai.rw",   password: "demo1234", color: "#15803d", bg: "#f0fdf4", icon: "📒" },
  { role: "AUDITOR", label: "Auditor",       email: "auditor@audit.rw",          password: "demo1234", color: "#b45309", bg: "#fffbeb", icon: "🔍" },
  { role: "ADMIN",   label: "Super Admin",   email: "admin@auditinsight.com",    password: "demo1234", color: "#7c3aed", bg: "#faf5ff", icon: "🌐" },
] as const;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken") ?? undefined;

  /*
   * ── REAL API login (commented for RBAC UI testing) ────────────
   * const { data } = await loginUser(email.trim(), password, inviteToken);
   * localStorage.setItem("token", data.token);
   * localStorage.setItem("role", data.role);
   * router.replace(data.mustChangePassword ? "/reset-password" : "/dashboard");
   * ─────────────────────────────────────────────────────────────
   */
  const mockLogin = (role: string) => {
    localStorage.setItem("mockRole", role);
    router.replace(role === "ADMIN" ? "/admin/organizations" : "/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setIsSubmitting(true);
    // ── MOCK: match email to a dev account ──
    const match = DEV_ACCOUNTS.find((a) => a.email === email.trim());
    if (match && password === match.password) {
      mockLogin(match.role);
      return;
    }
    setIsSubmitting(false);
    setError("Invalid email or password. Use a dev account below.");
  };

  const googleOAuthUrl = `${
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "https://auditinsight-backend-springboot-production.up.railway.app"
  }/api/auth/social-login/google`;

  return (
    <div style={shell}>
      {/* ── LEFT PANEL ── */}
      <div style={leftPanel}>
        <div style={brandBlock}>
          <div style={logoMark}>
            <ShieldIcon />
          </div>
          <h1 style={brandName}>AuditInsight</h1>
          <p style={brandTagline}>
            Enterprise-grade auditing and compliance — built for modern finance teams.
          </p>
        </div>

        <ul style={featureList}>
          {FEATURES.map((f) => (
            <li key={f.text} style={featureItem}>
              <span style={checkBadge}>
                <CheckIcon />
              </span>
              <span style={featureText}>{f.text}</span>
            </li>
          ))}
        </ul>

        <p style={leftFooter}>Trusted by audit professionals worldwide.</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={rightPanel}>
        <div style={formBox}>
          {/* header */}
          <div style={formHeader}>
            <h2 style={formTitle}>Welcome back</h2>
            <p style={formSubtitle}>Sign in to your audit workspace</p>
          </div>

          {/* error */}
          {error && (
            <div style={errorBanner}>
              <span style={{ fontSize: 15, marginRight: 8 }}>⚠</span>
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleLogin} style={formEl} noValidate>
            {/* email */}
            <div style={fieldGroup}>
              <label style={fieldLabel}>Email address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputEl}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusEl)}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputEl)}
                autoComplete="email"
                required
              />
            </div>

            {/* password */}
            <div style={fieldGroup}>
              <label style={fieldLabel}>Password</label>
              <div style={inputWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputEl, paddingRight: 44 }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputFocusEl, paddingRight: "44px" })}
                  onBlur={(e) => Object.assign(e.currentTarget.style, { ...inputEl, paddingRight: "44px" })}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={eyeBtn}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
            </div>

            {/* forgot */}
            <div style={forgotRow}>
              <Link href="/forgot-password" style={forgotLink}>
                Forgot password?
              </Link>
            </div>

            {/* submit */}
            <button type="submit" disabled={isSubmitting} style={isSubmitting ? { ...submitBtn, opacity: 0.72 } : submitBtn}>
              {isSubmitting ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Spinner /> Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* divider */}
            <div style={dividerRow}>
              <span style={dividerLine} />
              <span style={dividerText}>or continue with</span>
              <span style={dividerLine} />
            </div>

            {/* google */}
            <a href={googleOAuthUrl} style={googleBtn}>
              <GoogleIcon />
              <span>Continue with Google</span>
            </a>
          </form>

          <p style={switchRow}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" style={switchLink}>
              Create account
            </Link>
          </p>

          {/* ── DEV ACCOUNTS PILL SWITCHER ── */}
          <div style={devBox}>
            <p style={devTitle}>🔧 Dev Preview — switch account</p>
            <div style={pillTrack}>
              {DEV_ACCOUNTS.map((a) => (
                <button
                  key={a.role}
                  type="button"
                  onClick={() => mockLogin(a.role)}
                  style={{ ...pill, ...(false ? pillActive(a.color) : {}) }}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, pillHover)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, pill)}
                >
                  <span>{a.icon}</span>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
            <p style={devHint}>Password for all accounts: <code style={devCode}>demo1234</code></p>
            <button
              type="button"
              style={onboardingPreviewBtn}
              onClick={() => router.push("/onboarding")}
            >
              🚀 Preview Onboarding Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
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
  justifyContent: "center",
  padding: "60px 52px",
  position: "relative",
  overflow: "hidden",
};

const brandBlock: React.CSSProperties = {
  marginBottom: 52,
};

const logoMark: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  background: "rgba(255,255,255,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  marginBottom: 20,
};

const brandName: React.CSSProperties = {
  color: "#fff",
  fontSize: 28,
  fontWeight: 700,
  margin: "0 0 14px",
  letterSpacing: "-0.5px",
};

const brandTagline: React.CSSProperties = {
  color: "rgba(255,255,255,0.70)",
  fontSize: 15,
  lineHeight: 1.65,
  margin: 0,
  maxWidth: 300,
};

const featureList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: "0 0 52px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const featureItem: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
};

const checkBadge: React.CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: 6,
  background: "rgba(255,255,255,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#7dd3fc",
  flexShrink: 0,
  marginTop: 1,
};

const featureText: React.CSSProperties = {
  color: "rgba(255,255,255,0.82)",
  fontSize: 14,
  lineHeight: 1.5,
};

const leftFooter: React.CSSProperties = {
  color: "rgba(255,255,255,0.40)",
  fontSize: 13,
  margin: 0,
};

const rightPanel: React.CSSProperties = {
  flex: 1,
  minHeight: "100vh",
  background: "#F8FAFC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 32px",
};

const formBox: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
};

const formHeader: React.CSSProperties = {
  marginBottom: 32,
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
  alignItems: "center",
};

const formEl: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

const fieldGroup: React.CSSProperties = {
  marginBottom: 18,
};

const fieldLabel: React.CSSProperties = {
  display: "block",
  fontSize: 13.5,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 7,
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
  transition: "border-color 0.15s",
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

const forgotRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: 22,
  marginTop: -4,
};

const forgotLink: React.CSSProperties = {
  fontSize: 13,
  color: "#1e3a8a",
  textDecoration: "none",
  fontWeight: 500,
};

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
  marginBottom: 20,
  fontFamily: "inherit",
  letterSpacing: "0.2px",
};

const dividerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
};

const dividerLine: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: "#E2E8F0",
};

const dividerText: React.CSSProperties = {
  fontSize: 12.5,
  color: "#94A3B8",
  whiteSpace: "nowrap",
  fontWeight: 500,
};

const googleBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "1.5px solid #E2E8F0",
  background: "#fff",
  color: "#0F172A",
  fontWeight: 600,
  fontSize: 14.5,
  textDecoration: "none",
  cursor: "pointer",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const switchRow: React.CSSProperties = {
  textAlign: "center",
  marginTop: 24,
  fontSize: 14,
  color: "#64748B",
};

const switchLink: React.CSSProperties = {
  color: "#1e3a8a",
  fontWeight: 600,
  textDecoration: "none",
};

const devBox: React.CSSProperties = {
  marginTop: 32,
  padding: "18px 20px",
  borderRadius: 14,
  border: "1.5px dashed #cbd5e1",
  background: "#f8fafc",
};

const devTitle: React.CSSProperties = {
  margin: "0 0 14px",
  fontSize: 12.5,
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const pillTrack: React.CSSProperties = {
  display: "flex",
  gap: 6,
  background: "#e2e8f0",
  borderRadius: 999,
  padding: "4px",
  marginBottom: 12,
};

const pill: React.CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  padding: "7px 10px",
  borderRadius: 999,
  border: "none",
  background: "transparent",
  fontSize: 12.5,
  fontWeight: 600,
  color: "#475569",
  cursor: "pointer",
  transition: "background 0.15s, color 0.15s",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};

const pillHover: React.CSSProperties = {
  ...pill,
  background: "rgba(255,255,255,0.7)",
  color: "#0f172a",
};

const pillActive = (color: string): React.CSSProperties => ({
  background: "#fff",
  color,
  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
});

const devHint: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  color: "#94a3b8",
};

const devCode: React.CSSProperties = {
  background: "#e2e8f0",
  borderRadius: 4,
  padding: "1px 5px",
  fontSize: 11,
  fontFamily: "monospace",
  color: "#1e3a8a",
};

const onboardingPreviewBtn: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: "9px",
  borderRadius: 10,
  border: "1.5px solid #7c3aed",
  background: "#faf5ff",
  color: "#7c3aed",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};
