"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Shield, TrendingUp, FileSearch, Users, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  { icon: TrendingUp,     text: "Real-time transaction monitoring" },
  { icon: FileSearch,     text: "Evidence management & document trails" },
  { icon: Users,          text: "Multi-role team collaboration" },
  { icon: AlertTriangle,  text: "Compliance flagging & review queues" },
];

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const inviteToken = searchParams.get("inviteToken") ?? undefined;
  const suspended   = searchParams.get("suspended") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = login(email.trim(), password, inviteToken);
    if (result.success) {
      router.replace(result.redirectTo ?? "/dashboard");
    } else if (result.error === "SUBSCRIPTION_SUSPENDED") {
      router.replace("/log-in?suspended=1");
    } else {
      setError(result.error ?? "Invalid email or password.");
      setIsSubmitting(false);
    }
  };

  if (suspended) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2" }}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: 40, background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #fecaca" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🔴</div>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Subscription Suspended</h2>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            Your organisation&apos;s subscription has been suspended by the platform administrator.
            Please contact your organisation admin or AuditInsight support to restore access.
          </p>
          <a href="/log-in" style={{ color: "#1e3a8a", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← Back to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div style={s.shell} className="auth-shell">
      {/* LEFT PANEL */}
      <div style={s.left} className="auth-left">
        <div style={s.brandBlock}>
          <div style={s.logoMark}>
            <Shield size={22} strokeWidth={2} />
          </div>
          <h1 style={s.brandName}>AuditInsight</h1>
          <p style={s.tagline}>
            Enterprise-grade auditing and compliance — built for modern finance teams.
          </p>
        </div>

        <ul style={s.featureList}>
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} style={s.featureItem}>
              <span style={s.featureIcon}>
                <Icon size={14} strokeWidth={2.5} />
              </span>
              <span style={s.featureText}>{text}</span>
            </li>
          ))}
        </ul>

        <p style={s.leftFooter} className="auth-left-footer">Trusted by audit professionals worldwide.</p>
      </div>

      {/* RIGHT PANEL */}
      <div style={s.right} className="auth-right">
        <div style={s.formBox}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={s.formTitle}>Welcome back</h2>
            <p style={s.formSubtitle}>Sign in to your audit workspace</p>
          </div>

          {registered === "auditor" && (
            <div style={s.infoBanner}>
              Account created. Your auditor account is pending admin approval.
            </div>
          )}

          {inviteToken && (
            <div style={{ ...s.infoBanner, borderColor: "#c7d2fe", background: "#eef2ff", color: "#1d4ed8" }}>
              Invite token detected. Sign in with the invited email to accept your invite.
            </div>
          )}

          {error && (
            <div style={s.errorBanner}>
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 18 }}>
              <label style={s.label}>Email address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={s.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, s.input)}
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={s.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...s.input, paddingRight: 44 }}
                  autoComplete="current-password"
                  onFocus={(e) => Object.assign(e.currentTarget.style, { ...s.inputFocus, paddingRight: "44px" })}
                  onBlur={(e) => Object.assign(e.currentTarget.style, { ...s.input, paddingRight: "44px" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={s.eyeBtn}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22 }}>
              <Link href="/forgot-password" style={s.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ ...s.submitBtn, opacity: isSubmitting ? 0.75 : 1 }}
            >
              {isSubmitting ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />
                  Signing in…
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#64748b" }}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" style={{ color: "#1e3a8a", fontWeight: 600, textDecoration: "none" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: { minHeight: "100vh", display: "flex" },

  left: {
    width: "42%",
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0c2d6b 0%, #0f3d75 45%, #0d3366 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px 52px",
    overflow: "hidden",
  },

  brandBlock: { marginBottom: 52 },
  logoMark: {
    width: 48, height: 48, borderRadius: 13,
    background: "rgba(255,255,255,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", marginBottom: 22,
  },
  brandName: { color: "#fff", fontSize: 30, fontWeight: 700, margin: "0 0 14px", letterSpacing: "-0.5px" },
  tagline: { color: "rgba(255,255,255,0.70)", fontSize: 15, lineHeight: 1.65, margin: 0, maxWidth: 300 },

  featureList: { listStyle: "none", padding: 0, margin: "0 0 52px", display: "flex", flexDirection: "column", gap: 18 },
  featureItem: { display: "flex", alignItems: "center", gap: 12 },
  featureIcon: {
    width: 28, height: 28, borderRadius: 8,
    background: "rgba(255,255,255,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#7dd3fc", flexShrink: 0,
  },
  featureText: { color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 1.5 },
  leftFooter: { color: "rgba(255,255,255,0.40)", fontSize: 13, margin: 0 },

  right: {
    flex: 1, minHeight: "100vh", background: "#f8fafc",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px",
  },
  formBox: { width: "100%", maxWidth: 420 },

  formTitle: { fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.4px" },
  formSubtitle: { fontSize: 14, color: "#64748b", margin: 0 },

  infoBanner: {
    background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8",
    borderRadius: 10, padding: "11px 14px", fontSize: 13, marginBottom: 20,
  },
  errorBanner: {
    background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c",
    borderRadius: 10, padding: "11px 14px", fontSize: 13.5, marginBottom: 20,
    display: "flex", alignItems: "center", gap: 8,
  },

  label: { display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 7 },
  input: {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", background: "#fff",
    fontSize: 14.5, color: "#0f172a", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
  },
  inputFocus: {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid #1e3a8a", background: "#fff",
    fontSize: 14.5, color: "#0f172a", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
    boxShadow: "0 0 0 3px rgba(30,58,138,0.10)",
  },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
    padding: 4, display: "flex", alignItems: "center",
  },
  forgotLink: { fontSize: 13, color: "#1e3a8a", textDecoration: "none", fontWeight: 500 },
  submitBtn: {
    width: "100%", padding: "13px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #0f3d75, #1e3a8a)",
    color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer",
    fontFamily: "inherit", letterSpacing: "0.2px",
  },
};
