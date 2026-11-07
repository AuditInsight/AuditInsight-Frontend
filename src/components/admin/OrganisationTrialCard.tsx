"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  changeOrganisationTrialEnd,
  getOrganisationTrials,
  grantOrganisationTrial,
  revokeOrganisationTrial,
  type TrialGrant,
  type TrialHistory,
} from "@/api/admin";

function errorMessage(error: unknown): string {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? "Request failed. Please try again.";
  }
  return error instanceof Error ? error.message : "Request failed. Please try again.";
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

/** "2026-12-01T17:00" from an ISO-like backend date, for a datetime-local input. */
function toInputValue(value: string): string {
  return value.slice(0, 16);
}

function isCurrent(grant: TrialGrant): boolean {
  const now = Date.now();
  return grant.status === "ACTIVE" && Date.parse(grant.startsAt) <= now && now < Date.parse(grant.endsAt);
}

const EVENT_LABEL: Record<string, string> = {
  GRANTED: "Granted",
  EXTENDED: "Extended",
  SHORTENED: "Shortened",
  REVOKED: "Revoked",
  ENDED: "Closed",
  PAID_PERIODS_MOVED: "Paid time moved",
};

/**
 * Super Admin trial controls for one organisation: grant, extend or shorten, revoke — each with a reason — and the
 * full history. Paid time bought during a trial moves with the trial end automatically (handled by the backend).
 */
export default function OrganisationTrialCard({ organisationId, onChanged }: { organisationId: string; onChanged?: () => void }) {
  const [history, setHistory] = useState<TrialHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState("14");
  const [newEnd, setNewEnd] = useState("");
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    try {
      const { data } = await getOrganisationTrials(organisationId);
      setHistory(data);
      const open = data.grants.find(isCurrent);
      if (open) setNewEnd(toInputValue(open.endsAt));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [organisationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (action: () => Promise<unknown>) => {
    setSaving(true);
    setError(null);
    try {
      await action();
      setReason("");
      await load();
      onChanged?.();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const current = history?.grants.find(isCurrent) ?? null;
  const needReason = () => {
    if (!reason.trim()) {
      setError("A reason is required.");
      return false;
    }
    return true;
  };

  return (
    <div style={s.card}>
      <h2 style={s.title}>Free trial</h2>
      <p style={s.hint}>
        Trials are only ever granted here or by a trial campaign. If the organisation pays during a trial, its paid
        plan starts when the trial ends, and moves if you change the trial end.
      </p>

      {error && (
        <div role="alert" style={s.error}>
          <AlertCircle size={15} /> <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p style={s.muted}><Loader2 size={14} /> Loading trials…</p>
      ) : (
        <>
          <p style={s.status}>
            {current
              ? `Trial running until ${formatDateTime(current.endsAt)} (${current.source === "CAMPAIGN" ? "campaign" : "granted individually"}).`
              : "No trial is running."}
          </p>

          <div style={s.controls}>
            {current ? (
              <label style={s.label}>
                New end
                <input type="datetime-local" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} disabled={saving} style={s.input} />
              </label>
            ) : (
              <label style={s.label}>
                Length (days, 1–365)
                <input type="number" min={1} max={365} value={days} onChange={(e) => setDays(e.target.value)} disabled={saving} style={{ ...s.input, width: 120 }} />
              </label>
            )}
            <label style={s.label}>
              Reason
              <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why?" disabled={saving} style={{ ...s.input, width: 260 }} />
            </label>
          </div>

          <div style={s.buttons}>
            {current ? (
              <>
                <button
                  type="button"
                  disabled={saving || !newEnd}
                  style={s.primary}
                  onClick={() => needReason() && run(() => changeOrganisationTrialEnd(organisationId, `${newEnd}:00`, reason.trim()))}
                >
                  Save new end date
                </button>
                <button
                  type="button"
                  disabled={saving}
                  style={s.danger}
                  onClick={() => needReason() && run(() => revokeOrganisationTrial(organisationId, reason.trim()))}
                >
                  Revoke trial now
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={saving}
                style={s.primary}
                onClick={() => {
                  const n = Number(days);
                  if (!Number.isInteger(n) || n < 1 || n > 365) {
                    setError("Enter a length between 1 and 365 days.");
                    return;
                  }
                  void run(() => grantOrganisationTrial(organisationId, n, reason.trim()));
                }}
              >
                Grant trial
              </button>
            )}
          </div>

          {history && history.events.length > 0 && (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>When</th>
                  <th style={s.th}>Change</th>
                  <th style={s.th}>Trial end</th>
                  <th style={s.th}>Reason / details</th>
                </tr>
              </thead>
              <tbody>
                {[...history.events].reverse().map((e) => (
                  <tr key={e.id}>
                    <td style={s.td}>{formatDateTime(e.createdAt)}</td>
                    <td style={s.td}>{EVENT_LABEL[e.eventType] ?? e.eventType}</td>
                    <td style={s.td}>
                      {e.oldEndsAt && e.eventType !== "GRANTED" ? `${formatDateTime(e.oldEndsAt)} → ` : ""}
                      {formatDateTime(e.newEndsAt)}
                    </td>
                    <td style={s.td}>{[e.reason, e.details].filter(Boolean).join(" · ") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px" },
  title: { margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#0f172a" },
  hint: { margin: "0 0 12px", fontSize: 12.5, color: "#64748b", lineHeight: 1.5 },
  status: { margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#0f172a" },
  muted: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8" },
  error: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "10px 12px", borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 13 },
  controls: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" },
  label: { display: "flex", flexDirection: "column", gap: 6, color: "#475569", fontSize: 12, fontWeight: 600 },
  input: { padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, color: "#0f172a", background: "#fff" },
  buttons: { display: "flex", flexWrap: "wrap", gap: 10, margin: "12px 0" },
  primary: { minHeight: 36, padding: "0 14px", border: 0, borderRadius: 8, background: "#1e3a8a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  danger: { minHeight: 36, padding: "0 14px", border: "1px solid #fecaca", borderRadius: 8, background: "#fff", color: "#b91c1c", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 12.5 },
  th: { textAlign: "left", padding: "6px 8px", color: "#64748b", borderBottom: "1px solid #e5e7eb", fontWeight: 600 },
  td: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", color: "#0f172a", verticalAlign: "top" },
};
