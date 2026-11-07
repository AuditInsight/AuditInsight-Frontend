"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { AlertCircle, Gift, Loader2 } from "lucide-react";
import {
  createTrialCampaign,
  disableTrialCampaign,
  enableTrialCampaign,
  getTrialCampaigns,
  type TrialCampaignView,
} from "@/api/admin";

function errorMessage(error: unknown): string {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? "Request failed. Please try again.";
  }
  return error instanceof Error ? error.message : "Request failed. Please try again.";
}

function formatDate(value: string | null): string {
  if (!value) return "no end date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-GB", { dateStyle: "medium" });
}

/**
 * Trial campaigns: while one is enabled and within its dates, each NEW organisation gets a free trial of its length
 * at registration (one campaign trial per owner, ever). It never affects existing organisations or paid ones, and
 * disabling it leaves trials already granted running until their own end.
 */
export default function TrialCampaignsCard() {
  const [campaigns, setCampaigns] = useState<TrialCampaignView[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [days, setDays] = useState("14");
  const [endsOn, setEndsOn] = useState("");
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    try {
      const { data } = await getTrialCampaigns();
      setCampaigns(data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (action: () => Promise<unknown>) => {
    setSaving(true);
    setError(null);
    try {
      await action();
      await load();
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    const n = Number(days);
    if (!name.trim()) return setError("Give the campaign a name.");
    if (!Number.isInteger(n) || n < 1 || n > 365) return setError("Trial length must be 1–365 days.");
    const ok = await run(() =>
      createTrialCampaign({
        name: name.trim(),
        durationDays: n,
        endsAt: endsOn ? `${endsOn}T23:59:00` : undefined,
        reason: reason.trim() || undefined,
      })
    );
    if (ok) {
      setName("");
      setEndsOn("");
      setReason("");
    }
  };

  const toggle = (view: TrialCampaignView) => {
    const why = reason.trim();
    if (!why) {
      setError(`Enter a reason below to turn ${view.campaign.enabled ? "off" : "on"} "${view.campaign.name}".`);
      return;
    }
    void run(() =>
      view.campaign.enabled ? disableTrialCampaign(view.campaign.id, why) : enableTrialCampaign(view.campaign.id, why)
    ).then((ok) => {
      if (ok) setReason("");
    });
  };

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.icon}><Gift size={18} /></div>
        <div>
          <h3 style={s.title}>Trial campaigns</h3>
          <p style={s.description}>
            While a campaign is on, new organisations get a free trial when they register (one per owner, ever).
            AuditInsight is otherwise paid only. Turning a campaign off doesn&apos;t end trials already granted.
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" style={s.error}>
          <AlertCircle size={15} /> <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p style={s.muted}><Loader2 size={14} /> Loading campaigns…</p>
      ) : campaigns.length === 0 ? (
        <p style={s.muted}>No campaigns yet. New sign-ups pay before using the app.</p>
      ) : (
        <ul style={s.list}>
          {campaigns.map((view) => (
            <li key={view.campaign.id} style={s.item}>
              <div>
                <strong>{view.campaign.name}</strong> · {view.campaign.durationDays}-day trial · until{" "}
                {formatDate(view.campaign.endsAt)} · {view.grantsIssued} granted
                <span style={view.grantingNow ? s.on : s.off}>
                  {view.grantingNow ? "Granting now" : view.campaign.enabled ? "Enabled, outside its dates" : "Off"}
                </span>
              </div>
              <button type="button" disabled={saving} onClick={() => toggle(view)} style={view.campaign.enabled ? s.danger : s.primary}>
                {view.campaign.enabled ? "Turn off" : "Turn on"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={s.controls}>
        <label style={s.label}>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={saving} style={{ ...s.input, width: 180 }} />
        </label>
        <label style={s.label}>
          Trial length (days)
          <input type="number" min={1} max={365} value={days} onChange={(e) => setDays(e.target.value)} disabled={saving} style={{ ...s.input, width: 110 }} />
        </label>
        <label style={s.label}>
          Campaign ends (optional)
          <input type="date" value={endsOn} onChange={(e) => setEndsOn(e.target.value)} disabled={saving} style={s.input} />
        </label>
        <label style={s.label}>
          Reason
          <input value={reason} onChange={(e) => setReason(e.target.value)} disabled={saving} style={{ ...s.input, width: 200 }} />
        </label>
        <button type="button" disabled={saving} onClick={handleCreate} style={s.primary}>
          Create (off)
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { margin: "16px 0 24px", padding: 18, border: "1px solid #cbd5e1", borderRadius: 12, background: "#f8fafc" },
  header: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 },
  icon: { width: 36, height: 36, flexShrink: 0, borderRadius: 10, background: "#e0e7ff", color: "#1e3a8a", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { margin: 0, color: "#0f172a", fontSize: 15, fontWeight: 700 },
  description: { margin: "4px 0 0", color: "#64748b", fontSize: 12.5, lineHeight: 1.5 },
  error: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "10px 12px", borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 13 },
  muted: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b" },
  list: { listStyle: "none", margin: "0 0 14px", padding: 0, display: "flex", flexDirection: "column", gap: 8 },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, padding: "10px 12px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#0f172a" },
  on: { marginLeft: 8, padding: "2px 8px", borderRadius: 999, background: "#dcfce7", color: "#166534", fontSize: 11, fontWeight: 700 },
  off: { marginLeft: 8, padding: "2px 8px", borderRadius: 999, background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 700 },
  controls: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" },
  label: { display: "flex", flexDirection: "column", gap: 6, color: "#475569", fontSize: 12, fontWeight: 600 },
  input: { padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, color: "#0f172a", background: "#fff" },
  primary: { minHeight: 36, padding: "0 14px", border: 0, borderRadius: 8, background: "#1e3a8a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  danger: { minHeight: 36, padding: "0 14px", border: "1px solid #fecaca", borderRadius: 8, background: "#fff", color: "#b91c1c", fontSize: 13, fontWeight: 700, cursor: "pointer" },
};
