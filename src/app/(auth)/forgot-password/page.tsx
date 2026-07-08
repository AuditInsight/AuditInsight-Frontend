"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { sendNotification } from "@/mock/notifications.mock";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!isValidEmail(email)) { setError("Please enter a valid email address."); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));

    // Mock: generate a reset token and store it so /reset-password can consume it
    const token = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (typeof window !== "undefined") {
      localStorage.setItem("forgot_password_email", email.trim().toLowerCase());
      localStorage.setItem("forgot_password_token", token);
      localStorage.setItem("forgot_password_sent_at", new Date().toISOString());
    }

    // Send mock email notification
    sendNotification({
      type: "PASSWORD_RESET",
      recipientEmail: email.trim().toLowerCase(),
      subject: "Reset your AuditInsight password",
      body: `A password reset was requested for your account. Your reset link: ${typeof window !== "undefined" ? window.location.origin : ""}/reset-password?token=${token} (expires in 30 minutes).`,
    });

    setSubmitting(false);
    setSent(true);
  };

  if (sent) {
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
            <h2 style={s.title}>Check your inbox</h2>
            <p style={s.subtitle}>
              We sent a password reset link to{" "}
              <strong style={{ color: "#0f172a" }}>{email}</strong>.
              <br />
              It expires in 30 minutes.
            </p>
            <div style={s.infoBox}>
              <p style={{ margin: 0, fontSize: 13, color: "#1d4ed8" }}>
                💡 Demo tip — the reset link is saved in your notifications bell.
                You can also go directly to{" "}
                <Link href="/reset-password" style={{ color: "#1e3a8a", fontWeight: 600 }}>
                  /reset-password
                </Link>{" "}
                while logged in.
              </p>
            </div>
            <button style={s.submitBtn} onClick={() => router.push("/log-in")}>
              Back to Login
            </button>
            <button style={s.resendBtn} onClick={() => setSent(false)}>
              Try a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            Enter the email address linked to your account and we&apos;ll send you a reset link.
          </p>

          {error && <div style={s.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={s.label}>Email address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={s.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
                onBlur={(e)  => Object.assign(e.currentTarget.style, { borderColor: "#e2e8f0", boxShadow: "none" })}
                autoComplete="email"
                autoFocus
              />
            </div>

            <button type="submit" disabled={submitting} style={{ ...s.submitBtn, opacity: submitting ? 0.75 : 1 }}>
              {submitting
                ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />
                    Sending reset link…
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  </span>
                : "Send Reset Link"
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
  infoBox: { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 16px", margin: "16px 0" },
  label: { display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 7 },
  input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 14.5, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  submitBtn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginTop: 4 },
  resendBtn: { width: "100%", padding: "11px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginTop: 10 },
  backLink: { display: "inline-flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 13, textDecoration: "none", fontWeight: 500 },
};


