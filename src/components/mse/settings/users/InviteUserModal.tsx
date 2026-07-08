"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onInvite?: (email: string, role: string, message?: string) => void;
}

const ROLES = [
  { value: "AUDITOR", label: "Auditor", desc: "Can review transactions, flag issues, and manage audit queues", icon: "🔍" },
  { value: "MEMBER", label: "Accountant", desc: "Can upload evidence and manage financial records", icon: "📊" },
];

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function InviteUserModal({ open, onClose, onInvite }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("AUDITOR");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleInvite = async () => {
    setError("");
    if (!email.trim()) { setError("Email address is required."); return; }
    if (!validateEmail(email.trim())) { setError("Please enter a valid email address."); return; }

    setSending(true);
    // MOCK: simulate sending invite
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setSent(true);
    onInvite?.(email.trim(), role, message.trim() || undefined);
    setTimeout(() => {
      setSent(false);
      setEmail("");
      setMessage("");
      setRole("AUDITOR");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (sending) return;
    setEmail(""); setRole("AUDITOR"); setMessage(""); setError(""); setSent(false);
    onClose();
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div style={s.modal}>
        {/* header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.headerIcon}>✉️</div>
            <div>
              <h3 style={s.title}>Invite to Organisation</h3>
              <p style={s.sub}>Send an invite link — they&apos;ll join your workspace directly.</p>
            </div>
          </div>
          <button style={s.closeBtn} onClick={handleClose} disabled={sending}>✕</button>
        </div>

        {/* success state */}
        {sent ? (
          <div style={s.successWrap}>
            <div style={s.successIcon}>✓</div>
            <p style={s.successText}>Invite sent to <strong>{email}</strong></p>
          </div>
        ) : (
          <div style={s.body}>
            {error && <div style={s.errBanner}>⚠ {error}</div>}

            {/* email */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Email address <span style={s.req}>*</span></label>
              <input
                style={s.input}
                type="email"
                placeholder="auditor@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={e => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
                onBlur={e => Object.assign(e.currentTarget.style, { borderColor: "#E2E8F0", boxShadow: "none" })}
                autoComplete="email"
                disabled={sending}
              />
            </div>

            {/* role selection */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Role <span style={s.req}>*</span></label>
              <div style={s.roleGrid}>
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    style={{ ...s.roleCard, ...(role === r.value ? s.roleCardActive : {}) }}
                    disabled={sending}
                  >
                    <span style={s.roleEmoji}>{r.icon}</span>
                    <div style={s.roleInfo}>
                      <span style={s.roleName}>{r.label}</span>
                      <span style={s.roleDesc}>{r.desc}</span>
                    </div>
                    {role === r.value && <span style={s.roleCheck}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* optional message */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Personal message <span style={s.optional}>(optional)</span></label>
              <textarea
                style={s.textarea}
                placeholder="Add a note to your invite…"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                disabled={sending}
                onFocus={e => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
                onBlur={e => Object.assign(e.currentTarget.style, { borderColor: "#E2E8F0", boxShadow: "none" })}
              />
            </div>

            <div style={s.infoNote}>
              🔒 The invitee will receive a secure link. Access is granted only after they accept.
            </div>
          </div>
        )}

        {!sent && (
          <div style={s.footer}>
            <button style={s.cancelBtn} onClick={handleClose} disabled={sending}>Cancel</button>
            <button style={{ ...s.sendBtn, opacity: sending ? 0.7 : 1 }} onClick={handleInvite} disabled={sending}>
              {sending ? "Sending…" : "Send Invite"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" },
  header: { padding: "22px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  headerLeft: { display: "flex", alignItems: "flex-start", gap: 12 },
  headerIcon: { fontSize: 28, lineHeight: 1, marginTop: 2 },
  title: { fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0 },
  sub: { fontSize: 13, color: "#64748B", margin: "3px 0 0" },
  closeBtn: { background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#94A3B8", padding: 4, lineHeight: 1, marginTop: -2 },
  body: { padding: "20px 24px 4px" },
  errBanner: { background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 },
  fieldGroup: { marginBottom: 18 },
  label: { display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 7 },
  req: { color: "#ef4444" },
  optional: { fontSize: 12, color: "#94A3B8", fontWeight: 400 },
  input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" },
  roleGrid: { display: "flex", flexDirection: "column", gap: 8 },
  roleCard: { display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#fff", cursor: "pointer", fontFamily: "inherit", textAlign: "left", position: "relative" },
  roleCardActive: { border: "2px solid #1e3a8a", background: "rgba(30,58,138,0.03)" },
  roleEmoji: { fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 1 },
  roleInfo: { flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  roleName: { fontSize: 14, fontWeight: 600, color: "#0F172A" },
  roleDesc: { fontSize: 12, color: "#94A3B8", lineHeight: 1.4 },
  roleCheck: { width: 20, height: 20, borderRadius: "50%", background: "#1e3a8a", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } as React.CSSProperties,
  textarea: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff", resize: "vertical" as const, lineHeight: 1.5 },
  infoNote: { background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#0369a1", lineHeight: 1.5, marginBottom: 4 },
  footer: { padding: "16px 24px 22px", display: "flex", gap: 10, borderTop: "1px solid #F1F5F9" },
  cancelBtn: { flex: "0 0 auto", padding: "11px 20px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  sendBtn: { flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  successWrap: { padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  successIcon: { width: 52, height: 52, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  successText: { fontSize: 15, color: "#374151", textAlign: "center" },
};


