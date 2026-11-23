"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { AdminPaymentFilters, AdminPaymentProvider, AdminPaymentStatus } from "@/api/admin";
import { PAYMENT_STATUSES, PROVIDER_LABEL, STATUS_LABEL, localDayStartIso } from "./paymentFormat";

export interface PaymentFilterForm {
  search: string;
  status: AdminPaymentStatus | "";
  provider: AdminPaymentProvider | "";
  /** yyyy-mm-dd, inclusive local day */
  fromDay: string;
  /** yyyy-mm-dd, inclusive local day */
  toDay: string;
}

export const EMPTY_FILTERS: PaymentFilterForm = { search: "", status: "", provider: "", fromDay: "", toDay: "" };

/** The form as API filters. "To" day is inclusive for the admin, so the API gets the start of the next day. */
export function toApiFilters(f: PaymentFilterForm): Omit<AdminPaymentFilters, "page"> {
  return {
    search: f.search.trim() || undefined,
    status: f.status || undefined,
    provider: f.provider || undefined,
    from: localDayStartIso(f.fromDay),
    to: localDayStartIso(f.toDay, 1),
  };
}

interface Props {
  value: PaymentFilterForm;
  onApply: (next: PaymentFilterForm) => void;
}

export default function PaymentFilters({ value, onApply }: Props) {
  const [draft, setDraft] = useState<PaymentFilterForm>(value);
  const set = <K extends keyof PaymentFilterForm>(key: K, v: PaymentFilterForm[K]) => setDraft((d) => ({ ...d, [key]: v }));
  const dateError = draft.fromDay && draft.toDay && draft.toDay < draft.fromDay ? "The “to” date is before the “from” date." : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!dateError) onApply(draft);
      }}
      style={styles.form}
    >
      <label style={{ ...styles.field, flex: "2 1 260px" }}>
        <span style={styles.label}>Search</span>
        <span style={styles.searchBox}>
          <Search size={14} color="#94a3b8" />
          <input
            value={draft.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Organisation, payer, phone or reference"
            style={styles.searchInput}
          />
        </span>
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Status</span>
        <select value={draft.status} onChange={(e) => set("status", e.target.value as PaymentFilterForm["status"])} style={styles.input}>
          <option value="">All statuses</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Method</span>
        <select value={draft.provider} onChange={(e) => set("provider", e.target.value as PaymentFilterForm["provider"])} style={styles.input}>
          <option value="">All methods</option>
          {(Object.keys(PROVIDER_LABEL) as AdminPaymentProvider[]).map((p) => (
            <option key={p} value={p}>
              {PROVIDER_LABEL[p]}
            </option>
          ))}
        </select>
      </label>

      <label style={styles.field}>
        <span style={styles.label}>From</span>
        <input type="date" value={draft.fromDay} onChange={(e) => set("fromDay", e.target.value)} style={styles.input} />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>To</span>
        <input type="date" value={draft.toDay} onChange={(e) => set("toDay", e.target.value)} style={styles.input} />
      </label>

      <div style={styles.actions}>
        <button type="submit" style={styles.primary} disabled={!!dateError}>
          Apply
        </button>
        <button
          type="button"
          style={styles.secondary}
          onClick={() => {
            setDraft(EMPTY_FILTERS);
            onApply(EMPTY_FILTERS);
          }}
        >
          Reset
        </button>
      </div>
      {dateError && <p style={styles.error}>{dateError}</p>}
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 20 },
  field: { display: "flex", flexDirection: "column", gap: 4, flex: "1 1 150px", minWidth: 140 },
  label: { fontSize: 12, fontWeight: 600, color: "#374151" },
  input: { height: 36, border: "1px solid #e2e8f0", borderRadius: 8, padding: "0 10px", fontSize: 13, fontFamily: "inherit", background: "#fff" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, height: 36, border: "1px solid #e2e8f0", borderRadius: 8, padding: "0 10px" },
  searchInput: { border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", flex: 1, background: "transparent" },
  actions: { display: "flex", gap: 8 },
  primary: { height: 36, padding: "0 18px", borderRadius: 8, border: "none", background: "#1e3a8a", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  secondary: { height: 36, padding: "0 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#334155", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  error: { flexBasis: "100%", margin: 0, color: "#b91c1c", fontSize: 12.5 },
};
