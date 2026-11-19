"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MailCheck, X, AlertCircle } from "lucide-react";
import { requestSigningCode } from "@/utils/api";
import { zIndex } from "@/styles/zIndex";
import { theme } from "@/styles/theme";
import { signErrorMessage } from "./documentAccess";

/**
 * Email re-verification before signing. Every signature needs a fresh 6-digit code emailed to the signer for that
 * document. Wrap the sign call with `verifyAndSign`: it opens a dialog, emails the code, and calls `sign(code)`
 * once the user enters it. Code problems (wrong, expired…) stay in the dialog so the user can retry; any other
 * error is thrown back to the caller. Resolves with `null` if the user cancels.
 *
 *   const { verifyAndSign, verificationDialog } = useSigningVerification();
 *   const res = await verifyAndSign(evidence, (code) => signEvidence(evidence.id, { ...payload, verificationCode: code }));
 *   if (res === null) return; // cancelled
 *   ...render {verificationDialog} somewhere in the component.
 */

interface SignableDoc {
  id: string;
  documentName: string;
}

interface Pending {
  doc: SignableDoc;
  sign: (code: string) => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (err: unknown) => void;
}

/** Server messages about the code itself; these are shown in the dialog instead of failing the signing. */
const isCodeError = (message: string) => /\bcode\b|attempt/i.test(message);

export function useSigningVerification() {
  const [pending, setPending] = useState<Pending | null>(null);

  const verifyAndSign = useCallback(
    <T,>(doc: SignableDoc, sign: (code: string) => Promise<T>): Promise<T | null> =>
      new Promise<T | null>((resolve, reject) => {
        setPending({
          doc,
          sign,
          resolve: resolve as (value: unknown) => void,
          reject,
        });
      }),
    []
  );

  const verificationDialog = pending ? (
    <SigningVerificationDialog
      key={pending.doc.id}
      doc={pending.doc}
      sign={pending.sign}
      onDone={(result) => {
        setPending(null);
        pending.resolve(result);
      }}
      onCancel={() => {
        setPending(null);
        pending.resolve(null);
      }}
      onFail={(err) => {
        setPending(null);
        pending.reject(err);
      }}
    />
  ) : null;

  return { verifyAndSign, verificationDialog };
}

interface DialogProps {
  doc: SignableDoc;
  sign: (code: string) => Promise<unknown>;
  onDone: (result: unknown) => void;
  onCancel: () => void;
  onFail: (err: unknown) => void;
}

function SigningVerificationDialog({ doc, sign, onDone, onCancel, onFail }: DialogProps) {
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const sentOnce = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendCode = useCallback(async () => {
    setSending(true);
    setError(null);
    try {
      const { data } = await requestSigningCode(doc.id);
      setSentTo(data.sentTo);
      setResendIn(data.resendAfterSeconds);
      setCode("");
    } catch (err) {
      const msg = signErrorMessage(err);
      // A code sent moments ago (e.g. the dialog was reopened) is still valid; let them use it.
      const wait = /wait (\d+) seconds/i.exec(msg);
      if (wait) setResendIn(Number(wait[1]));
      setError(msg);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [doc.id]);

  // Send the first code when the dialog opens (once, even under React StrictMode's double effects).
  useEffect(() => {
    if (sentOnce.current) return;
    sentOnce.current = true;
    void sendCode();
  }, [sendCode]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const canSubmit = /^\d{6}$/.test(code) && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await sign(code);
      onDone(result);
    } catch (err) {
      const msg = signErrorMessage(err);
      if (isCodeError(msg)) {
        setError(msg);
        setSubmitting(false);
        if (/request a new code/i.test(msg)) setCode("");
        inputRef.current?.focus();
      } else {
        onFail(err);
      }
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      style={s.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm your email to sign"
      onClick={(e) => e.target === e.currentTarget && !submitting && onCancel()}
    >
      <div style={s.modal}>
        <div style={s.header}>
          <div style={s.icon}><MailCheck size={18} color="#1e3a8a" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={s.title}>Confirm it&apos;s you</p>
            <p style={s.sub}>Before signing “{doc.documentName}”</p>
          </div>
          <button type="button" style={s.closeBtn} onClick={onCancel} disabled={submitting} aria-label="Cancel">
            <X size={16} />
          </button>
        </div>

        <p style={s.text}>
          {sending && !sentTo
            ? "Sending a verification code to your email…"
            : sentTo
              ? <>We sent a 6-digit code to <b>{sentTo}</b>. Enter it to sign. It expires in 10 minutes.</>
              : "Enter the 6-digit code from your email to sign."}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <input
            ref={inputRef}
            style={s.codeInput}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••••"
            aria-label="Verification code"
            disabled={submitting}
            autoFocus
          />

          {error && (
            <div style={s.error} role="alert">
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> <span>{error}</span>
            </div>
          )}

          <button type="submit" style={{ ...s.primary, opacity: canSubmit ? 1 : 0.6 }} disabled={!canSubmit}>
            {submitting ? "Signing…" : "Verify & sign"}
          </button>
        </form>

        <div style={s.footer}>
          <span style={s.muted}>Didn&apos;t get it? Check spam, or</span>
          <button
            type="button"
            style={s.link}
            onClick={() => void sendCode()}
            disabled={sending || submitting || resendIn > 0}
          >
            {sending ? "sending…" : resendIn > 0 ? `resend in ${resendIn}s` : "resend code"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed", inset: 0, zIndex: zIndex.modal + 50, background: "rgba(15, 23, 42, 0.55)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    fontFamily: theme.typography.fontFamily,
  },
  modal: {
    width: "100%", maxWidth: 400, background: "#fff", borderRadius: 14, padding: 20,
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)", boxSizing: "border-box",
  },
  header: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 },
  icon: {
    width: 34, height: 34, borderRadius: 9, background: "#eff6ff", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  title: { margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" },
  sub: {
    margin: "2px 0 0", fontSize: 12.5, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4 },
  text: { fontSize: 13.5, color: "#334155", lineHeight: 1.5, margin: "0 0 14px" },
  codeInput: {
    width: "100%", padding: "12px", fontSize: 24, letterSpacing: 10, textAlign: "center",
    border: "1.5px solid #e2e8f0", borderRadius: 10, outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", color: "#0f172a",
  },
  error: {
    display: "flex", gap: 6, alignItems: "flex-start", marginTop: 10, padding: "8px 10px", borderRadius: 8,
    background: "#fef2f2", color: "#b91c1c", fontSize: 12.5, lineHeight: 1.4,
  },
  primary: {
    width: "100%", marginTop: 14, padding: "11px 14px", borderRadius: 10, border: "none",
    background: "#1e3a8a", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
  footer: { display: "flex", gap: 4, justifyContent: "center", alignItems: "center", marginTop: 12, flexWrap: "wrap" },
  muted: { fontSize: 12.5, color: "#64748b" },
  link: {
    background: "none", border: "none", padding: 0, fontSize: 12.5, color: "#1e3a8a", fontWeight: 600,
    cursor: "pointer", textDecoration: "underline",
  },
};
