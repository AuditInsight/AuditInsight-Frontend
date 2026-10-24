"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { isAxiosError } from "axios";
import { formatRwf } from "@/types/billing";
import { usePlans } from "@/hooks/usePlans";
import { changeOrganisationSubscription, AdminSubscriptionType, AdminSubscriptionSummary } from "@/api/admin";
import { X, AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  organisationId: string;
  organisationName: string;
  currentType: AdminSubscriptionType | null;
  onClose: () => void;
  onChanged: (summary: AdminSubscriptionSummary) => void;
}

const TYPE_OPTIONS: AdminSubscriptionType[] = ["MONTHLY", "SIX_MONTHS", "ANNUAL"];

export default function ChangeTierModal({ open, organisationId, organisationName, currentType, onClose, onChanged }: Props) {
  const { plans } = usePlans();
  const [selected, setSelected] = useState<AdminSubscriptionType>(currentType ?? "MONTHLY");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || typeof document === "undefined") return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await changeOrganisationSubscription(organisationId, {
        subscriptionType: selected,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      onChanged(data);
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to change subscription.");
      } else {
        setError("Failed to change subscription.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && !submitting && onClose()}>
      <div style={modal}>
        <div style={header}>
          <div>
            <h3 style={title}>Change Subscription Tier</h3>
            <p style={sub}>{organisationName}</p>
          </div>
          <button onClick={onClose} disabled={submitting} style={closeBtn}><X size={18} /></button>
        </div>

        <div style={body}>
          <div style={planList}>
            {TYPE_OPTIONS.map((type) => {
              const plan = plans.find((p) => p.id === type);
              const isSelected = selected === type;
              const isCurrent = currentType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelected(type)}
                  disabled={submitting}
                  style={{ ...planRow, ...(isSelected ? planRowSelected : {}) }}
                >
                  <div>
                    <div style={planName}>
                      {plan?.name ?? type}
                      {isCurrent && <span style={currentBadge}>Current</span>}
                    </div>
                    <div style={planMeta}>{plan ? formatRwf(plan.price) : "—"} · {plan?.durationDays ?? "—"} days</div>
                  </div>
                  <div style={{ ...radio, ...(isSelected ? radioActive : {}) }}>
                    {isSelected && <div style={radioDot} />}
                  </div>
                </button>
              );
            })}
          </div>

          <label style={fieldLabel}>
            End date override (optional)
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={submitting}
              style={dateInput}
            />
          </label>
          <p style={hint}>Leave blank to compute the end date from the selected plan&apos;s duration.</p>

          {error && (
            <div style={errorBox}>
              <AlertTriangle size={14} color="#b91c1c" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div style={footer}>
          <button onClick={onClose} disabled={submitting} style={cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ ...confirmBtn, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 20 };
const modal: React.CSSProperties = { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 440, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" };
const header: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 20px 0" };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 };
const sub: React.CSSProperties = { fontSize: 13, color: "#64748b", margin: "4px 0 0" };
const closeBtn: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 };
const body: React.CSSProperties = { padding: "16px 20px" };
const planList: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 };
const planRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontFamily: "inherit", textAlign: "left" };
const planRowSelected: React.CSSProperties = { border: "2px solid #1e3a8a", background: "rgba(30,58,138,0.03)" };
const planName: React.CSSProperties = { fontSize: 13.5, fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: 7 };
const planMeta: React.CSSProperties = { fontSize: 12, color: "#94a3b8", marginTop: 3 };
const currentBadge: React.CSSProperties = { fontSize: 10, fontWeight: 700, background: "#e0f2fe", color: "#0369a1", padding: "2px 7px", borderRadius: 20 };
const radio: React.CSSProperties = { width: 16, height: 16, borderRadius: "50%", border: "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const radioActive: React.CSSProperties = { border: "2px solid #1e3a8a" };
const radioDot: React.CSSProperties = { width: 7, height: 7, borderRadius: "50%", background: "#1e3a8a" };
const fieldLabel: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#374151" };
const dateInput: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13.5, fontFamily: "inherit" };
const hint: React.CSSProperties = { fontSize: 11.5, color: "#94a3b8", margin: "6px 0 0" };
const errorBox: React.CSSProperties = { display: "flex", gap: 8, marginTop: 14, padding: "10px 12px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 12.5 };
const footer: React.CSSProperties = { display: "flex", gap: 10, padding: "0 20px 20px" };
const cancelBtn: React.CSSProperties = { flex: "0 0 auto", padding: "10px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" };
const confirmBtn: React.CSSProperties = { flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" };
