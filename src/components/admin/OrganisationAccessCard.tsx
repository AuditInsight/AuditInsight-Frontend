"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  endOrganisationFreeAccess,
  getAdminOrganisationAccess,
  type AdminOrganisationAccess,
} from "@/api/admin";

function errorMessage(error: unknown): string {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? "Request failed. Please try again.";
  }
  return error instanceof Error ? error.message : "Request failed. Please try again.";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

const BASIS_LABEL: Record<string, string> = {
  PAID: "Paid access",
  TRIAL: "Free trial",
  EMERGENCY_OVERRIDE: "Emergency override (all organisations)",
  PAYMENT_REQUIRED: "No access — payment required",
};

const SOURCE_LABEL: Record<string, string> = {
  ADMIN_COMPLIMENTARY: "Complimentary (granted by admin)",
  LEGACY: "Older record, no payment found",
  PAYMENT: "Payment",
};

/**
 * Why this organisation can use its workspace right now, and a button to end its FREE access (trial or periods no
 * payment bought). Real paid time is kept and starts straight away.
 */
export default function OrganisationAccessCard({
  organisationId,
  refreshKey,
  onChanged,
}: {
  organisationId: string;
  refreshKey?: number;
  onChanged?: () => void;
}) {
  const [data, setData] = useState<AdminOrganisationAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    try {
      const { data: view } = await getAdminOrganisationAccess(organisationId);
      setData(view);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [organisationId]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  const handleEnd = async () => {
    if (!reason.trim()) {
      setError("A reason is required to end this organisation's free access.");
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const { data: view } = await endOrganisationFreeAccess(organisationId, reason.trim());
      setData(view);
      setReason("");
      setNotice(
        view.access.hasAccess
          ? "Free access ended. The organisation keeps the paid time it bought."
          : "Free access ended. The organisation now needs to pay to use its workspace."
      );
      onChanged?.();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const hasFreeAccess = !!data && (data.trialRunning || data.freePeriods.length > 0);

  return (
    <div style={s.card}>
      <h2 style={s.title}>Access</h2>

      {error && (
        <div role="alert" style={s.error}>
          <AlertCircle size={15} /> <span>{error}</span>
        </div>
      )}
      {notice && <div role="status" style={s.notice}>{notice}</div>}

      {loading ? (
        <p style={s.muted}><Loader2 size={14} /> Loading access…</p>
      ) : data ? (
        <>
          <p style={s.status}>
            {BASIS_LABEL[data.access.basis] ?? data.access.basis}
            {data.access.accessUntil ? ` until ${formatDate(data.access.accessUntil)}` : ""}
          </p>
          {data.access.nextPaid && (
            <p style={s.line}>Paid plan queued from {formatDate(data.access.nextPaid.startDate)}.</p>
          )}

          {hasFreeAccess ? (
            <>
              <p style={s.line}>Free access that can be ended:</p>
              <ul style={s.list}>
                {data.trialRunning && data.access.trial && (
                  <li>Free trial until {formatDate(data.access.trial.endsAt)}</li>
                )}
                {data.freePeriods.map((p) => (
                  <li key={p.id}>
                    {SOURCE_LABEL[p.source] ?? p.source}: {p.subscriptionType ?? "—"}, {formatDate(p.startDate)} →{" "}
                    {formatDate(p.endDate)} {p.current ? "(running now)" : "(queued)"}
                  </li>
                ))}
              </ul>
              <div style={s.controls}>
                <label style={s.label}>
                  Reason
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why is free access ending?"
                    disabled={saving}
                    style={s.input}
                  />
                </label>
                <button type="button" onClick={handleEnd} disabled={saving} style={s.danger}>
                  {saving && <Loader2 size={14} />} End free access now
                </button>
              </div>
            </>
          ) : (
            <p style={s.line}>
              {data.access.basis === "EMERGENCY_OVERRIDE"
                ? "Its only access is the platform-wide emergency override, which applies to every organisation. End it in Settings → Billing."
                : "This organisation has no free access."}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px" },
  title: { margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "#0f172a" },
  status: { margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#0f172a" },
  line: { margin: "0 0 8px", fontSize: 13, color: "#475569" },
  list: { margin: "0 0 12px", paddingLeft: 20, fontSize: 13, color: "#0f172a", lineHeight: 1.6 },
  muted: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8" },
  error: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "10px 12px", borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 13 },
  notice: { marginBottom: 12, padding: "10px 12px", borderRadius: 8, background: "#f0fdf4", color: "#166534", fontSize: 13 },
  controls: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" },
  label: { display: "flex", flexDirection: "column", gap: 6, color: "#475569", fontSize: 12, fontWeight: 600 },
  input: { width: 280, padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, color: "#0f172a", background: "#fff" },
  danger: { display: "inline-flex", alignItems: "center", gap: 6, minHeight: 36, padding: "0 14px", border: "1px solid #fecaca", borderRadius: 8, background: "#fff", color: "#b91c1c", fontSize: 13, fontWeight: 700, cursor: "pointer" },
};
