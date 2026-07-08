"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction.types";
import { X, AlertCircle } from "lucide-react";
import { modalOverlayStyle } from "@/lib/modalOverlay";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, "id" | "status" | "evidenceCount">) => void;
  transaction?: Transaction | null;
  mode?: "add" | "edit";
}

type FormData = {
  name: string;
  date: string;
  amount: string;
  counterparty: string;
  type: "EXPENSE" | "INCOME";
  paymentMethod: Transaction["paymentMethod"];
  notes: string;
};

const emptyForm = (): FormData => ({
  name: "",
  date: "",
  amount: "",
  counterparty: "",
  type: "EXPENSE",
  paymentMethod: "BANK",
  notes: "",
});

function validate(form: FormData): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.name.trim()) errs.name = "Transaction name is required.";
  if (!form.date) errs.date = "Date is required.";
  if (!form.counterparty.trim()) errs.counterparty = "Counterparty name is required.";
  const amt = Number(form.amount);
  if (!form.amount || isNaN(amt) || amt <= 0) errs.amount = "Amount must be a positive number.";
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
        name: transaction.name,
        date: transaction.date,
        amount: String(transaction.amount),
        counterparty: transaction.counterparty ?? "",
        type: transaction.type,
        paymentMethod: transaction.paymentMethod,
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
    setErrors(validate(next));
  };

  const handleSubmit = () => {
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      name: form.name.trim(),
      date: form.date,
      amount: Number(form.amount),
      counterparty: form.counterparty.trim(),
      type: form.type,
      paymentMethod: form.paymentMethod,
      notes: form.notes || undefined,
      organisationId: "org-001",
      createdBy: "Eric Bizimana",
    });
    onClose();
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: `1.5px solid ${touched[field] && errors[field] ? "#ef4444" : "#e2e8f0"}`,
    fontSize: 14, color: "#0f172a", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", background: "#fff",
  });

  return (
    <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div>
            <p style={s.title}>{mode === "edit" ? "Edit Transaction" : "Add Transaction"}</p>
            <p style={s.sub}>Status is derived automatically from attached evidence.</p>
          </div>
          <button style={s.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div style={s.body}>
          <div>
            <label style={s.label}>Transaction Name <span style={s.req}>*</span></label>
            <input placeholder="e.g. Office Supplies – ABC Ltd" value={form.name} onChange={(e) => set("name", e.target.value)} style={inputStyle("name")} />
            {touched.name && errors.name && <p style={s.err}><AlertCircle size={11} /> {errors.name}</p>}
          </div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Date <span style={s.req}>*</span></label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} style={inputStyle("date")} />
              {touched.date && errors.date && <p style={s.err}><AlertCircle size={11} /> {errors.date}</p>}
            </div>
            <div>
              <label style={s.label}>Amount (RWF) <span style={s.req}>*</span></label>
              <input type="number" placeholder="e.g. 150000" value={form.amount} onChange={(e) => set("amount", e.target.value)} style={inputStyle("amount")} min="1" />
              {touched.amount && errors.amount && <p style={s.err}><AlertCircle size={11} /> {errors.amount}</p>}
            </div>
          </div>

          <div>
            <label style={s.label}>Counterparty <span style={s.req}>*</span></label>
            <input placeholder="e.g. ABC Company Ltd" value={form.counterparty} onChange={(e) => set("counterparty", e.target.value)} style={inputStyle("counterparty")} />
            {touched.counterparty && errors.counterparty && <p style={s.err}><AlertCircle size={11} /> {errors.counterparty}</p>}
          </div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Type <span style={s.req}>*</span></label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} style={inputStyle("type")}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} style={inputStyle("paymentMethod")}>
                <option value="BANK">Bank Transfer</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label style={s.label}>Notes <span style={s.optional}>(optional)</span></label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} style={{ ...inputStyle("notes"), resize: "vertical" as const }} rows={2} placeholder="Any additional context…" />
          </div>
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
  footer: { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10, background: "#fafafa", flexShrink: 0 },
  cancelBtn: { padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "inherit" },
  submitBtn: { padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
};


