/**
 * LoginPage.production.tsx
 *
 * Production login page using React Hook Form + Zod.
 * Replace the contents of src/app/log-in/page.tsx with this file
 * (or rename and update the import) when going live.
 *
 * Differences from the mock version:
 *  - Form validation via Zod schema (email format + password min length)
 *  - Calls the production AuthContext login() which hits the real API
 *  - Handles AxiosError to show server-side error messages inline
 *  - isPending state disables the button and shows a spinner
 */

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import {
  Eye, EyeOff, Shield, TrendingUp,
  FileSearch, Users, AlertTriangle, Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext.production";
import { ApiErrorResponse, LoginRequest } from "@/types/auth";

// ── Zod schema ─────────────────────────────────────────────────────

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ── Feature list (left panel) ──────────────────────────────────────

const FEATURES = [
  { icon: TrendingUp,    text: "Real-time transaction monitoring"         },
  { icon: FileSearch,    text: "Evidence management & document trails"    },
  { icon: Users,         text: "Multi-role team collaboration"            },
  { icon: AlertTriangle, text: "Compliance flagging & review queues"      },
];

// ── Dev credentials hint (only rendered when NEXT_PUBLIC_DEV_AUTH=true) ──

const DEV_ACCOUNTS = [
  {
    group: "Private Company — InsightAI Rwanda Ltd",
    color: "#1e3a8a",
    bg: "#eff6ff",
    border: "#bfdbfe",
    accounts: [
      { role: "Org Admin",  email: "ceo@insightai.rw",       password: "Password1" },
      { role: "Accountant", email: "accountant@insightai.rw", password: "Password1" },
      { role: "Auditor",    email: "auditor@audit.rw",        password: "Password1" },
    ],
  },
  {
    group: "NGO — Rwanda Health Foundation",
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    accounts: [
      { role: "Executive Director", email: "director@rwandahealth.org", password: "Password1" },
      { role: "Finance Officer",    email: "finance@rwandahealth.org",  password: "Password1" },
      { role: "Auditor",            email: "auditor@rwandahealth.org",  password: "Password1" },
      { role: "Donor Rep (USAID)",  email: "s.mitchell@usaid.gov",      password: "Password1" },
    ],
  },
];

function DevCredentialsPanel({ onFill }: { onFill: (email: string, password: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", padding: "9px 14px", borderRadius: 10,
          border: "1.5px dashed #cbd5e1", background: "#f8fafc",
          color: "#475569", fontSize: 13, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <span>🔑 Dev credentials</span>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>{open ? "▲ hide" : "▼ show"}</span>
      </button>

      {open && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
          {DEV_ACCOUNTS.map((group) => (
            <div
              key={group.group}
              style={{
                borderRadius: 10, border: `1px solid ${group.border}`,
                background: group.bg, overflow: "hidden",
              }}
            >
              <div style={{
                padding: "7px 12px", fontSize: 11, fontWeight: 700,
                color: group.color, letterSpacing: "0.04em",
                textTransform: "uppercase", borderBottom: `1px solid ${group.border}`,
              }}>
                {group.group}
              </div>
              {group.accounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => { onFill(acc.email, acc.password); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "8px 12px",
                    background: "transparent", border: "none",
                    borderBottom: `1px solid ${group.border}`,
                    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: group.color }}>
                      {acc.role}
                    </span>
                    <span style={{ fontSize: 11.5, color: "#64748b", marginLeft: 8 }}>
                      {acc.email}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>click to fill →</span>
                </button>
              ))}
            </div>
          ))}
          <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
            All passwords: <strong>Password1</strong>
          </p>
        </div>
      )}
    </div>
  );
}

// ── Inner form (needs useSearchParams so must be wrapped in Suspense) ──

function LoginForm() {
  const { login } = useAuth();

  const router       = useRouter();
  const searchParams = useSearchParams();
  const inviteToken  = searchParams.get("inviteToken") ?? undefined;
  const suspended    = searchParams.get("suspended") === "1";
  const registered   = searchParams.get("registered");

  const [showPassword, setShowPassword] = useState(false);
  const [serverError,  setServerError]  = useState<string | null>(null);

  const IS_DEV = process.env.NEXT_PUBLIC_DEV_AUTH === "true";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const usernameField = register("username");
  const passwordField = register("password");

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const { redirectTo } = await login({
        username: values.username.trim().toLowerCase(),
        password: values.password,
        inviteToken,
      });
      router.replace(redirectTo);
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorResponse>(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          setServerError("Invalid email or password.");
        } else if (status === 423) {
          // 423 Locked — account suspended
          router.replace("/log-in?suspended=1");
        } else {
          setServerError(
            err.response?.data?.message ?? "Something went wrong. Please try again."
          );
        }
      } else {
        setServerError("Unable to reach the server. Check your connection.");
      }
    }
  };

  // ── Suspended screen ─────────────────────────────────────────────

  if (suspended) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2" }}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: 40, background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #fecaca" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🔴</div>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Subscription Suspended</h2>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            Your organisation&apos;s subscription has been suspended. Please contact your admin or AuditInsight support.
          </p>
          <a href="/log-in" style={{ color: "#1e3a8a", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← Back to Login</a>
        </div>
      </div>
    );
  }

  // ── Main layout ──────────────────────────────────────────────────

  return (
    <div style={s.shell} className="auth-shell">
      {/* LEFT PANEL */}
      <div style={s.left} className="auth-left">
        <div style={s.brandBlock}>
          <div style={s.logoMark}><Shield size={22} strokeWidth={2} /></div>
          <h1 style={s.brandName}>AuditInsight</h1>
          <p style={s.tagline}>
            Enterprise-grade auditing and compliance — built for modern finance teams.
          </p>
        </div>
        <ul style={s.featureList}>
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} style={s.featureItem}>
              <span style={s.featureIcon}><Icon size={14} strokeWidth={2.5} /></span>
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

          {/* Dev credentials panel */}
          {IS_DEV && (
            <DevCredentialsPanel
              onFill={(email, password) => {
                setValue("username", email,    { shouldValidate: true });
                setValue("password", password, { shouldValidate: true });
              }}
            />
          )}

          {/* Banners */}
          {registered === "auditor" && (
            <div style={s.infoBanner}>
              Account created. Your auditor account is pending admin approval.
            </div>
          )}
          {inviteToken && (
            <div style={{ ...s.infoBanner, borderColor: "#c7d2fe", background: "#eef2ff", color: "#1d4ed8" }}>
              Invite detected — sign in with the invited email to accept.
            </div>
          )}
          {serverError && (
            <div style={s.errorBanner} role="alert">
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column" }}>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="username" style={s.label}>Email address</label>
              <input
                id="username"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                style={{ ...s.input, ...(errors.username ? s.inputError : {}) }}
                onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                onBlur={(e) => { Object.assign(e.currentTarget.style, s.input); usernameField.onBlur(e); }}
                name={usernameField.name}
                ref={usernameField.ref}
                onChange={usernameField.onChange}
              />
              {errors.username && (
                <span style={s.fieldError} role="alert">{errors.username.message}</span>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <label htmlFor="password" style={s.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{ ...s.input, paddingRight: 44, ...(errors.password ? s.inputError : {}) }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, { ...s.inputFocus, paddingRight: "44px" })}
                  onBlur={(e) => { Object.assign(e.currentTarget.style, { ...s.input, paddingRight: "44px" }); passwordField.onBlur(e); }}
                  name={passwordField.name}
                  ref={passwordField.ref}
                  onChange={passwordField.onChange}
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
              {errors.password && (
                <span style={s.fieldError} role="alert">{errors.password.message}</span>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22 }}>
              <Link href="/forgot-password" style={s.forgotLink}>Forgot password?</Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ ...s.submitBtn, opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
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

export default function LoginPageProduction() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

// ── Styles (identical to existing login page for visual consistency) ──

const s: Record<string, React.CSSProperties> = {
  shell: { minHeight: "100vh", display: "flex" },
  left: {
    width: "42%", minHeight: "100vh",
    background: "linear-gradient(160deg, #0c2d6b 0%, #0f3d75 45%, #0d3366 100%)",
    display: "flex", flexDirection: "column", justifyContent: "center",
    padding: "60px 52px", overflow: "hidden",
  },
  brandBlock: { marginBottom: 52 },
  logoMark: {
    width: 48, height: 48, borderRadius: 13,
    background: "rgba(255,255,255,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", marginBottom: 22,
  },
  brandName:   { color: "#fff", fontSize: 30, fontWeight: 700, margin: "0 0 14px", letterSpacing: "-0.5px" },
  tagline:     { color: "rgba(255,255,255,0.70)", fontSize: 15, lineHeight: 1.65, margin: 0, maxWidth: 300 },
  featureList: { listStyle: "none", padding: 0, margin: "0 0 52px", display: "flex", flexDirection: "column", gap: 18 },
  featureItem: { display: "flex", alignItems: "center", gap: 12 },
  featureIcon: {
    width: 28, height: 28, borderRadius: 8,
    background: "rgba(255,255,255,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#7dd3fc", flexShrink: 0,
  },
  featureText: { color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 1.5 },
  leftFooter:  { color: "rgba(255,255,255,0.40)", fontSize: 13, margin: 0 },
  right: {
    flex: 1, minHeight: "100vh", background: "#f8fafc",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px",
  },
  formBox:     { width: "100%", maxWidth: 420 },
  formTitle:   { fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.4px" },
  formSubtitle:{ fontSize: 14, color: "#64748b", margin: 0 },
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
  inputError: { borderColor: "#fca5a5" },
  fieldError:  { display: "block", fontSize: 12, color: "#dc2626", marginTop: 5 },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
    padding: 4, display: "flex", alignItems: "center",
  },
  forgotLink:  { fontSize: 13, color: "#1e3a8a", textDecoration: "none", fontWeight: 500 },
  submitBtn: {
    width: "100%", padding: "13px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #0f3d75, #1e3a8a)",
    color: "#fff", fontWeight: 600, fontSize: 15,
    fontFamily: "inherit", letterSpacing: "0.2px",
  },
};
