"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { getPaymentSetup, PaymentEnvironment, PaymentSetupStatus } from "@/api/admin";

const ENV_STYLE: Record<PaymentEnvironment, { label: string; bg: string; fg: string }> = {
  LIVE: { label: "Live — real money", bg: "#dcfce7", fg: "#15803d" },
  SANDBOX: { label: "Sandbox — test money only", bg: "#fef3c7", fg: "#92400e" },
  UNKNOWN: { label: "Not set up", bg: "#fee2e2", fg: "#b91c1c" },
};

/**
 * What the server says about its own payment settings. It cannot prove the provider accepts our token; one real
 * payment is still the end-to-end test.
 */
export default function PaymentSetupCard() {
  const [setup, setSetup] = useState<PaymentSetupStatus | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getPaymentSetup()
      .then(({ data }) => setSetup(data))
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return <div style={{ ...card, color: "#b91c1c" }}>Could not load the payment setup check.</div>;
  }
  if (!setup) return null;

  const env = (e: PaymentEnvironment) => (
    <span style={{ ...badge, background: ENV_STYLE[e].bg, color: ENV_STYLE[e].fg }}>{ENV_STYLE[e].label}</span>
  );

  return (
    <div style={card}>
      <div style={headerRow}>
        {setup.ready ? <CheckCircle2 size={18} color="#15803d" /> : <XCircle size={18} color="#b91c1c" />}
        <strong style={{ fontSize: 14 }}>
          {setup.ready ? "Payment setup looks complete" : "Payment setup has problems — payments will fail"}
        </strong>
      </div>

      <div style={rowsWrap}>
        <div style={item}>
          <span style={itemLabel}>MTN Mobile Money (pawaPay)</span>
          {env(setup.mobileMoney.environment)}
          <span style={small}>
            Token {setup.mobileMoney.tokenSet ? "set" : "missing"} · provider {setup.mobileMoney.provider || "—"}
          </span>
          <span style={small}>
            Callback URL to set in pawaPay: <code>&lt;backend address&gt;{setup.mobileMoney.callbackPath}</code>
          </span>
        </div>
        <div style={item}>
          <span style={itemLabel}>Card (Flutterwave)</span>
          {env(setup.card.environment)}
          <span style={small}>
            Secret key {setup.card.secretKeySet ? "set" : "missing"} · webhook hash{" "}
            {setup.card.webhookHashSet ? "set" : "missing"}
          </span>
          <span style={small}>
            Webhook URL to set in Flutterwave: <code>&lt;backend address&gt;{setup.card.webhookPath}</code>
          </span>
        </div>
      </div>

      {setup.problems.map((p) => (
        <p key={p} style={{ ...line, color: "#b91c1c" }}>
          <XCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} /> {p}
        </p>
      ))}
      {setup.warnings.map((w) => (
        <p key={w} style={{ ...line, color: "#92400e" }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} /> {w}
        </p>
      ))}
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 13 };
const headerRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 };
const rowsWrap: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 8 };
const item: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, border: "1px solid #f1f5f9", borderRadius: 10, padding: 12, minWidth: 0 };
const itemLabel: React.CSSProperties = { fontWeight: 700, color: "#111827" };
const badge: React.CSSProperties = { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 };
const small: React.CSSProperties = { fontSize: 12, color: "#4b5563", wordBreak: "break-word" };
const line: React.CSSProperties = { display: "flex", gap: 6, margin: "6px 0 0", fontSize: 12.5, lineHeight: 1.45 };
