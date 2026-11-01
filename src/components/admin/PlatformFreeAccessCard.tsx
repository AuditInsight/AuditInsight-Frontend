"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { AlertCircle, CalendarClock, Loader2, Square, SquareCheck } from "lucide-react";
import {
  endAdminFreeAccess,
  getAdminFreeAccess,
  startAdminFreeAccess,
  type AdminFreeAccessResponse,
} from "@/api/admin";

function getErrorMessage(error: unknown): string {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? "Request failed. Please try again.";
  }
  return error instanceof Error ? error.message : "Request failed. Please try again.";
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export default function PlatformFreeAccessCard() {
  const [status, setStatus] = useState<AdminFreeAccessResponse | null>(null);
  const [durationDays, setDurationDays] = useState("30");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setError(null);
    try {
      const { data } = await getAdminFreeAccess();
      setStatus(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const handleStart = async () => {
    const days = Number(durationDays);
    if (!Number.isInteger(days) || days < 1 || days > 3650) {
      setError("Enter a duration between 1 and 3650 days.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { data } = await startAdminFreeAccess(days);
      setStatus(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleEnd = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data } = await endAdminFreeAccess();
      setStatus(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const enabled = status?.enabled ?? false;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}><CalendarClock size={18} /></div>
        <div>
          <h3 style={styles.title}>Platform-wide free access</h3>
          <p style={styles.description}>
            Temporarily unlock every organisation without recording a payment. Existing subscriptions and plan prices stay unchanged.
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" style={styles.error}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}><Loader2 size={17} /> Loading free-access status…</div>
      ) : (
        <>
          <div style={{ ...styles.status, ...(enabled ? styles.activeStatus : styles.inactiveStatus) }}>
            {enabled ? <SquareCheck size={17} /> : <Square size={17} />}
            <span>{enabled ? "Free access is currently enabled for all organisations." : "Free access is currently off."}</span>
          </div>

          {status?.startsAt && (
            <div style={styles.dates}>
              <span>Started: <strong>{formatDate(status.startsAt)}</strong></span>
              <span>Ends: <strong>{formatDate(status.endsAt)}</strong></span>
            </div>
          )}

          {enabled ? (
            <button type="button" onClick={handleEnd} disabled={saving} style={styles.stopButton}>
              {saving && <Loader2 size={15} />}
              End free access now
            </button>
          ) : (
            <div style={styles.controls}>
              <label style={styles.durationLabel}>
                Free access duration (days)
                <input
                  type="number"
                  min={1}
                  max={3650}
                  step={1}
                  value={durationDays}
                  onChange={(event) => setDurationDays(event.target.value)}
                  disabled={saving}
                  style={styles.input}
                />
              </label>
              <button type="button" onClick={handleStart} disabled={saving} style={styles.startButton}>
                {saving && <Loader2 size={15} />}
                Enable free access
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { margin: "16px 0 24px", padding: 18, border: "1px solid #cbd5e1", borderRadius: 12, background: "#f8fafc" },
  header: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 },
  icon: { width: 36, height: 36, flexShrink: 0, borderRadius: 10, background: "#e0e7ff", color: "#1e3a8a", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { margin: 0, color: "#0f172a", fontSize: 15, fontWeight: 700 },
  description: { margin: "4px 0 0", color: "#64748b", fontSize: 12.5, lineHeight: 1.5 },
  error: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "10px 12px", borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 13 },
  loading: { display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13, padding: "10px 0" },
  status: { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600 },
  activeStatus: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
  inactiveStatus: { background: "#fff", color: "#475569", border: "1px solid #e2e8f0" },
  dates: { display: "flex", flexWrap: "wrap", gap: "8px 24px", margin: "12px 0", color: "#64748b", fontSize: 12 },
  controls: { display: "flex", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginTop: 14 },
  durationLabel: { display: "flex", flexDirection: "column", gap: 6, color: "#475569", fontSize: 12, fontWeight: 600 },
  input: { width: 180, padding: "9px 10px", border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", fontSize: 14, color: "#0f172a" },
  startButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 38, padding: "0 14px", border: 0, borderRadius: 8, background: "#1e3a8a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  stopButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 38, marginTop: 14, padding: "0 14px", border: "1px solid #fecaca", borderRadius: 8, background: "#fff", color: "#b91c1c", fontSize: 13, fontWeight: 700, cursor: "pointer" },
};
