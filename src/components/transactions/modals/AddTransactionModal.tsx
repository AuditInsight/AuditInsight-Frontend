"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction.types";
import { MOCK_COA } from "@/mock/transactions.mock";
import { X, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  transaction?: Transaction | null;
  mode?: "add" | "edit";
}

type FormData = {
  date: string;
  amount: string;
  counterparty: string;
  type: "EXPENSE" | "INCOME";
  source: string;
  status: string;
  chartOfAccount: string;
  department: string;
  notes: string;
};

const emptyForm = (): FormData => ({
  date: "", amount: "", counterparty: "", type: "EXPENSE",
  source: "BANK", status: "PENDING", chartOfAccount: "",
  department: "", notes: "",
});

const DEPARTMENTS = ["Finance", "Operations", "Sales", "HR", "IT", "Administration"];

function validate(form: FormData): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.date) errs.date = "Date is required.";
  if (!form.counterparty.trim()) errs.counterparty = "Counterparty name is required.";
  const amt = Number(form.amount);
  if (!form.amount || isNaN(amt) || amt <= 0) errs.amount = "Amount must be a positive number.";
  if (!form.chartOfAccount) errs.chartOfAccount = "Chart of account is required.";
  if (!form.department) errs.department = "Department is required.";
  return errs;
}

export function AddTransactionModal({ isOpen, onClose, onSubmit, transaction = null, mode = "add" }: Props) {
  const [form, setForm] = useState<FormData>(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && transaction) {
      setForm({
        date: transaction.date,
        amount: String(transaction.amount),
        counterparty: transaction.counterparty ?? "",
        type: transaction.type as "EXPENSE" | "INCOME",
        source: transaction.source ?? "BANK",
        status: transaction.status ?? "PENDING",
        chartOfAccount: transaction.chartOfAccount ?? "",
        department: transaction.department ?? "",
        notes: transaction.notes ?? "",
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
    setTouched({});
  }, [isOpen, mode, transaction]);

  if (!isOpen) return null;

  const set = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setTouched((p) => ({ ...p, [field]: true }));
    const next = { ...form, [field]: value };
    const e = validate(next);
    setErrors(e);
  };

  const handleSubmit = () => {
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      date: form.date,
      amount: Number(form.amount),
      counterparty: form.counterparty.trim(),
      type: form.type,
      source: form.source,
      status: form.status,
      chartOfAccount: form.chartOfAccount,
      department: form.department,
      notes: form.notes || undefined,
      riskScore: 0,
      organisationId: "org-001",
      createdBy: "",
    } as Omit<Transaction, "id">);
    onClose();
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: `1.5px solid ${touched[field] && errors[field] ? "#ef4444" : "#e2e8f0"}`,
    fontSize: 14, color: "#0f172a", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", background: "#fff",
  });

  const coaByType = MOCK_COA.filter((c) => c.type === form.type);

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <p style={s.title}>{mode === "edit" ? "Edit Transaction" : "Add Transaction"}</p>
            <p style={s.sub}>All fields marked * are required</p>
          </div>
          <button style={s.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div style={s.body}>
          <div style={s.grid2}>
            {/* Date */}
            <div>
              <label style={s.label}>Date <span style={s.req}>*</span></label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} style={inputStyle("date")} />
              {touched.date && errors.date && <p style={s.err}><AlertCircle size={11} /> {errors.date}</p>}
            </div>

            {/* Amount */}
            <div>
              <label style={s.label}>Amount (RWF) <span style={s.req}>*</span></label>
              <input type="number" placeholder="e.g. 150000" value={form.amount} onChange={(e) => set("amount", e.target.value)} style={inputStyle("amount")} min="1" />
              {touched.amount && errors.amount && <p style={s.err}><AlertCircle size={11} /> {errors.amount}</p>}
            </div>
          </div>

          {/* Counterparty */}
          <div>
            <label style={s.label}>Counterparty <span style={s.req}>*</span></label>
            <input placeholder="e.g. ABC Company Ltd" value={form.counterparty} onChange={(e) => set("counterparty", e.target.value)} style={inputStyle("counterparty")} />
            {touched.counterparty && errors.counterparty && <p style={s.err}><AlertCircle size={11} /> {errors.counterparty}</p>}
          </div>

          <div style={s.grid2}>
            {/* Type */}
            <div>
              <label style={s.label}>Type <span style={s.req}>*</span></label>
              <select value={form.type} onChange={(e) => { set("type", e.target.value); set("chartOfAccount", ""); }} style={inputStyle("type")}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>

            {/* Source / Payment Method */}
            <div>
              <label style={s.label}>Payment Method</label>
              <select value={form.source} onChange={(e) => set("source", e.target.value)} style={inputStyle("source")}>
                <option value="BANK">Bank Transfer</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
          </div>

          <div style={s.grid2}>
            {/* Chart of Account */}
            <div>
              <label style={s.label}>Chart of Account <span style={s.req}>*</span></label>
              <select value={form.chartOfAccount} onChange={(e) => set("chartOfAccount", e.target.value)} style={inputStyle("chartOfAccount")}>
                <option value="">— Select account —</option>
                {coaByType.map((c) => <option key={c.code} value={c.name}>{c.code} — {c.name}</option>)}
              </select>
              {touched.chartOfAccount && errors.chartOfAccount && <p style={s.err}><AlertCircle size={11} /> {errors.chartOfAccount}</p>}
            </div>

            {/* Department */}
            <div>
              <label style={s.label}>Department <span style={s.req}>*</span></label>
              <select value={form.department} onChange={(e) => set("department", e.target.value)} style={inputStyle("department")}>
                <option value="">— Select department —</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {touched.department && errors.department && <p style={s.err}><AlertCircle size={11} /> {errors.department}</p>}
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={s.label}>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} style={inputStyle("status")}>
              <option value="PENDING">Pending</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label style={s.label}>Notes <span style={s.optional}>(optional)</span></label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} style={{ ...inputStyle("notes"), resize: "vertical" as const }} rows={2} placeholder="Any additional context…" />
          </div>

          {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
            <div style={s.errSummary}>
              <AlertCircle size={14} /> Please fix {Object.keys(errors).length} error(s) before saving.
            </div>
          )}
        </div>

        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={s.submitBtn} onClick={handleSubmit}>
            {mode === "edit" ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { width: "100%", maxWidth: 560, background: "#fff", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" },
  header: { padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 },
  title: { margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" },
  sub: { margin: "3px 0 0", fontSize: 12, color: "#94a3b8" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex" },
  body: { padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 14 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  req: { color: "#ef4444" },
  optional: { fontSize: 11, color: "#94a3b8", fontWeight: 400 },
  err: { display: "flex", alignItems: "center", gap: 4, margin: "4px 0 0", fontSize: 11.5, color: "#ef4444", fontWeight: 500 },
  errSummary: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#b91c1c", fontWeight: 500 },
  footer: { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10, background: "#fafafa", flexShrink: 0 },
  cancelBtn: { padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "inherit" },
  submitBtn: { padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
};
