"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Mail, ArrowLeft, Loader2, CheckCircle2, KeyRound, Eye, EyeOff } from "lucide-react";
import { isAxiosError } from "axios";
import { apiClient } from "@/api/client";
import { ApiErrorResponse } from "@/types/auth";

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep]             = useState<Step>("email");
  const [email, setEmail]           = useState("");
  const [otp, setOtp]               = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  // Step 1 — send OTP via resend-otp (the only "send code to email" endpoint available)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post(`/auth/resend-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      setStep("reset");
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorResponse>(err)) {
        setError(err.response?.data?.message ?? "Failed to send reset code. Please try again.");
      } else {
        setError("Unable to reach the server. Check your connection.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2 — verify OTP + set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp.trim()) { setError("Please enter the OTP sent to your email."); return; }
    if (!PASSWORD_PATTERN.test(newPassword)) {
      setError("Password must be 8+ chars with uppercase, lowercase, number and symbol (@$!%*?&).");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post("/auth/reset-password", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });
      setStep("done");
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorResponse>(err)) {
        const status = err.response?.status;
        if (status === 404) {
          setError("This feature is not yet available. Please contact support.");
        } else {
          setError(err.response?.data?.message ?? "Failed to reset password. Please try again.");
        }
      } else {
        setError("Unable to reach the server. Check your connection.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Done screen ───────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.logoRow}>
              <div style={s.logoMark}><Shield size={16} color="#fff" /></div>
              <span style={s.logoText}>AuditInsight</span>
            </div>
          </div>
          <div style={s.body}>
            <div style={s.successIcon}><CheckCircle2 size={36} color="#16a34a" strokeWidth={1.5} /></div>
            <h2 style={s.title}>Password reset!</h2>
            <p style={s.subtitle}>Your password has been updated. You can now sign in with your new password.</p>
            <button style={s.submitBtn} onClick={() => router.push("/log-in")}>Back to Login</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2 — OTP + new password ───────────────────────────────────
  if (step === "reset") {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.logoRow}>
              <div style={s.logoMark}><Shield size={16} color="#fff" /></div>
              <span style={s.logoText}>AuditInsight</span>
            </div>
          </div>
          <div style={s.body}>
            <div style={s.iconWrap}><KeyRound size={32} color="#1e3a8a" strokeWidth={1.5} /></div>
            <h2 style={s.title}>Reset your password</h2>
            <p style={s.subtitle}>
              Enter the code sent to <strong style={{ color: "#0f172a" }}>{email}</strong> and choose a new password.
            </p>

            {error && <div style={s.errorBox} role="alert">{error}</div>}

            <form onSubmit={handleResetPassword} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={s.label}>OTP Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  style={s.input}
                  onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                  onBlur={(e)  => Object.assign(e.currentTarget.style, s.input)}
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>
              <div>
                <label style={s.label}>New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 chars, upper, lower, number, symbol"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ ...s.input, paddingRight: 44 }}
                    onFocus={(e) => Object.assign(e.currentTarget.style, { ...s.inputFocus, paddingRight: "44px" })}
                    onBlur={(e)  => Object.assign(e.currentTarget.style, { ...s.input, paddingRight: "44px" })}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={s.eyeBtn} tabIndex={-1}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={submitting} style={{ ...s.submitBtn, opacity: submitting ? 0.75 : 1 }}>
                {submitting
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />
                      Resetting…
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </span>
                  : "Reset Password"
                }
              </button>
            </form>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <button onClick={() => { setStep("email"); setError(""); }} style={s.backLinkBtn}>
                <ArrowLeft size={14} /> Use a different email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 1 — email input ──────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.logoRow}>
            <div style={s.logoMark}><Shield size={16} color="#fff" /></div>
            <span style={s.logoText}>AuditInsight</span>
          </div>
        </div>

        <div style={s.body}>
          <div style={s.iconWrap}><Mail size={32} color="#1e3a8a" strokeWidth={1.5} /></div>
          <h2 style={s.title}>Forgot your password?</h2>
          <p style={s.subtitle}>
            Enter your account email and we&apos;ll send you a reset code.
          </p>

          {error && <div style={s.errorBox} role="alert">{error}</div>}

          <form onSubmit={handleSendOtp} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={s.label}>Email address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={s.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                onBlur={(e)  => Object.assign(e.currentTarget.style, s.input)}
                autoComplete="email"
                autoFocus
              />
            </div>

            <button type="submit" disabled={submitting} style={{ ...s.submitBtn, opacity: submitting ? 0.75 : 1 }}>
              {submitting
                ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />
                    Sending code…
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  </span>
                : "Send Reset Code"
              }
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <Link href="/log-in" style={s.backLink}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  card: { width: "100%", maxWidth: 460, borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0" },
  cardHeader: { background: "linear-gradient(135deg,#0c2d6b,#1e3a8a)", padding: "20px 28px" },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" },
  body: { padding: "36px 36px 32px", display: "flex", flexDirection: "column", gap: 0 },
  iconWrap: { width: 64, height: 64, borderRadius: "50%", background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  successIcon: { width: 72, height: 72, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  title: { textAlign: "center", fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" },
  subtitle: { textAlign: "center", fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.65 },
  errorBox: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, textAlign: "center" },
  label: { display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 7 },
  input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 14.5, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  inputFocus: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #1e3a8a", background: "#fff", fontSize: 14.5, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" },
  eyeBtn: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" },
  submitBtn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginTop: 4 },
  backLink: { display: "inline-flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 13, textDecoration: "none", fontWeight: 500 },
  backLinkBtn: { display: "inline-flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 },
};
