"use client";

import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";
import { Check, AlertCircle } from "lucide-react";
import { getAdminPlans, updateAdminPlanPrice, AdminPlanPriceResponse } from "@/api/admin";

const PLAN_LABELS: Record<string, string> = {
  MONTHLY: "1 Month Plan",
  SIX_MONTHS: "6 Month Plan",
  ANNUAL: "1 Year Plan",
};

interface RowDraft {
  price: string;
  durationDays: string;
}

export default function PlanPricesEditor() {
  const [plans, setPlans] = useState<AdminPlanPriceResponse[]>([]);
  const [drafts, setDrafts] = useState<Record<string, RowDraft>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingType, setSavingType] = useState<string | null>(null);
  const [savedType, setSavedType] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAdminPlans();
      setPlans(data);
      setDrafts(
        Object.fromEntries(
          data.map((p) => [p.subscriptionType, { price: String(p.price), durationDays: String(p.durationDays) }])
        )
      );
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to load plan prices.");
      } else {
        setError("Failed to load plan prices.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSave = async (type: string) => {
    const draft = drafts[type];
    const price = Number(draft.price);
    const durationDays = Number(draft.durationDays);
    if (!price || price <= 0 || !durationDays || durationDays <= 0) {
      setError("Price and duration must be positive numbers.");
      return;
    }
    setSavingType(type);
    setError(null);
    try {
      const { data } = await updateAdminPlanPrice(type as AdminPlanPriceResponse["subscriptionType"], { price, durationDays });
      setPlans((prev) => prev.map((p) => (p.subscriptionType === type ? data : p)));
      setSavedType(type);
      setTimeout(() => setSavedType(null), 2000);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to update plan price.");
      } else {
        setError("Failed to update plan price.");
      }
    } finally {
      setSavingType(null);
    }
  };

  if (loading) return <p style={s.emptyState}>Loading plan prices…</p>;

  return (
    <div style={s.wrap}>
      {error && (
        <div style={s.errorBanner}>
          <AlertCircle size={14} color="#b91c1c" style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}
      {plans.map((plan) => {
        const draft = drafts[plan.subscriptionType] ?? { price: "", durationDays: "" };
        const changed = draft.price !== String(plan.price) || draft.durationDays !== String(plan.durationDays);
        return (
          <div key={plan.subscriptionType} style={s.row}>
            <div style={s.rowHeader}>
              <div>
                <p style={s.planName}>{PLAN_LABELS[plan.subscriptionType] ?? plan.subscriptionType}</p>
                <p style={s.rowMeta}>
                  {plan.updatedByUsername ? `Last updated by ${plan.updatedByUsername}` : "Not yet edited"}
                  {plan.updatedAt ? ` · ${new Date(plan.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                </p>
              </div>
            </div>
            <div style={s.fields}>
              <label style={s.fieldLabel}>
                Price ({plan.currency})
                <input
                  type="number"
                  min={1}
                  value={draft.price}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [plan.subscriptionType]: { ...prev[plan.subscriptionType], price: e.target.value } }))}
                  style={s.input}
                />
              </label>
              <label style={s.fieldLabel}>
                Duration (days)
                <input
                  type="number"
                  min={1}
                  value={draft.durationDays}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [plan.subscriptionType]: { ...prev[plan.subscriptionType], durationDays: e.target.value } }))}
                  style={s.input}
                />
              </label>
              <button
                onClick={() => handleSave(plan.subscriptionType)}
                disabled={!changed || savingType === plan.subscriptionType}
                style={{ ...s.saveBtn, opacity: !changed || savingType === plan.subscriptionType ? 0.5 : 1 }}
              >
                {savedType === plan.subscriptionType ? <><Check size={13} /> Saved</> : savingType === plan.subscriptionType ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", gap: 14 },
  errorBanner: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13 },
  row: { border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" },
  rowHeader: { marginBottom: 10 },
  planName: { margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" },
  rowMeta: { margin: "2px 0 0", fontSize: 12, color: "#94a3b8" },
  fields: { display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" },
  fieldLabel: { display: "flex", flexDirection: "column", gap: 5, fontSize: 11.5, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.3px" },
  input: { padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13.5, fontFamily: "inherit", width: 140 },
  saveBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: "#1e3a8a", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  emptyState: { textAlign: "center", padding: "24px 16px", color: "#94a3b8", fontSize: 13.5 },
};
