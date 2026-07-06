"use client";

import { useState, useEffect } from "react";
import { X, Edit2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { NGOTransaction, DonorName } from "@/types/ngo";

interface Props {
  open: boolean;
  transaction: NGOTransaction | null;
  onClose: () => void;
  onSubmit: (updated: NGOTransaction) => void;
}

const DONORS: DonorName[] = ["USAID", "UNICEF", "World Bank", "EU", "UNDP", "GIZ", "DFID", "Gates Foundation", "One Acre Fund", "Red Cross"];
const BUDGET_LINES = ["Medical Supplies", "Training & Workshops", "Scholarships", "Staff Costs", "Infrastructure", "Procurement", "Beneficiary Support", "Monitoring & Evaluation", "Grant Receipt", "Administration", "Other"];

export default function EditTransactionModal({ open, transaction, onClose, onSubmit }: Props) {
  const [projectName,   setProjectName]   = useState("");
  const [donor,         setDonor]         = useState<DonorName | "">("");
  const [budgetLine,    setBudgetLine]    = useState("");
  const [description,   setDescription]   = useState("");
  const [counterparty,  setCounterparty]  = useState("");
  const [date,          setDate]          = useState("");
  const [amount,        setAmount]        = useState("");
  const [currency,      setCurrency]      = useState("RWF");
  const [paymentMethod, setPaymentMethod] = useState<"BANK" | "MOBILE_MONEY" | "CASH">("BANK");
  const [type,          setType]          = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [error,         setError]         = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [success,       setSuccess]       = useState(false);

  // Populate fields whenever the target transaction changes
  useEffect(() => {
    if (!transaction) return;
    setProjectName(transaction.projectName);
    setDonor(transaction.donor);
    setBudgetLine(transaction.budgetLine);
    setDescription(transaction.description);
    setCounterparty(transaction.counterparty);
    setDate(transaction.date);
    setAmount(String(transaction.amount));
    setCurrency(transaction.currency);
    setPaymentMethod(transaction.paymentMethod);
    setType(transaction.type);
    setError("");
    setSuccess(false);
  }, [transaction?.id]); // key on id so re-opening same modal for different txn always re-populates

  if (!open || !transaction) return null;

  const handleClose = () => {
    if (submitting) return;
    setError("");
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!projectName.trim())  { setError("Project name is required."); return; }
    if (!donor)               { setError("Please select a donor."); return; }
    if (!budgetLine)          { setError("Please select a budget line."); return; }
    if (!description.trim())  { setError("Description is required."); return; }
    if (!counterparty.trim()) { setError("Counterparty is required."); return; }
    if (!date)                { setError("Date is required."); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setError("Enter a valid amount."); return; }

    setError(""); setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    onSubmit({
      ...transaction,
      projectName:   projectName.trim(),
      donor:         donor as DonorName,
      budgetLine,
      description:   description.trim(),
      counterparty:  counterparty.trim(),
      date,
      amount:        Number(amount),
      currency,
      paymentMethod,
      type,
    });

    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); onClose(); }, 1200);
  };

  return (
    <div
      style={s.overlay}
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div style={s.modal} onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerIcon}><Edit2 size={17} color="#1e3a8a" /></div>
          <div style={{ flex: 1 }}>
            <h3 style={s.title}>Edit Transaction</h3>
            <p style={s.sub}>{transaction.id} · {transaction.projectName}</p>
          </div>
          <button style={s.closeBtn} onClick={handleClose}><X size={16} /></button>
        </div>

        {success ? (
          <div style={s.successWrap}>
            <CheckCircle2 size={36} color="#1e3a8a" />
            <p style={s.successTitle}>Changes saved</p>
            <p style={s.successSub}>Transaction {transaction.id} has been updated.</p>
          </div>
        ) : (
          <>
            <div style={s.body}>
              {error && (
                <div style={s.errBanner}>
                  <AlertCircle size={13} style={{ flexShrink: 0 }} /> {error}
                </div>
              )}

              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Project Name <span style={s.req}>*</span></label>
                  <input style={s.input} value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Health Outreach Phase 2" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Donor <span style={s.req}>*</span></label>
                  <select style={s.select} value={donor} onChange={(e) => setDonor(e.target.value as DonorName)}>
                    <option value="">Select donor</option>
                    {DONORS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Budget Line <span style={s.req}>*</span></label>
                  <select style={s.select} value={budgetLine} onChange={(e) => setBudgetLine(e.target.value)}>
                    <option value="">Select budget line</option>
                    {BUDGET_LINES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Type</label>
                  <select style={s.select} value={type} onChange={(e) => setType(e.target.value as "EXPENSE" | "INCOME")}>
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
              </div>

              <div style={s.field}>
                <label style={s.label}>Description <span style={s.req}>*</span></label>
                <input style={s.input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of this transaction" />
              </div>

              <div style={s.field}>
                <label style={s.label}>Counterparty <span style={s.req}>*</span></label>
                <input style={s.input} value={counterparty} onChange={(e) => setCounterparty(e.target.value)} placeholder="Vendor, supplier, or recipient name" />
              </div>

              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Amount <span style={s.req}>*</span></label>
                  <input style={s.input} type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Currency</label>
                  <select style={s.select} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {["RWF", "USD", "EUR", "GBP", "KES", "UGX"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Date <span style={s.req}>*</span></label>
                  <input style={s.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Payment Method</label>
                  <select style={s.select} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "MOBILE_MONEY" | "CASH")}>
                    <option value="BANK">Bank Transfer</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={s.footer}>
              <button style={s.cancelBtn} onClick={handleClose} disabled={submitting}>Cancel</button>
              <button
                style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                <Edit2 size={14} /> {submitting ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay:    { position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9000, padding: 20 },
  modal:      { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" },
  header:     { padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, background: "#fff", zIndex: 1 },
  headerIcon: { width: 38, height: 38, borderRadius: 10, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title:      { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
  sub:        { fontSize: 12.5, color: "#64748b", margin: "2px 0 0" },
  closeBtn:   { width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", marginLeft: "auto", flexShrink: 0 },
  body:       { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 },
  errBanner:  { background: "rgba(30,58,138,0.06)", border: "1px solid rgba(30,58,138,0.2)", color: "#1e3a8a", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
  row:        { display: "flex", gap: 14 },
  field:      { flex: 1, marginBottom: 14 },
  label:      { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  req:        { color: "#2563eb" },
  input:      { width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 13.5, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#f8fafc" },
  select:     { width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 13.5, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#f8fafc", cursor: "pointer" },
  footer:     { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, position: "sticky", bottom: 0, background: "#fff" },
  cancelBtn:  { padding: "10px 20px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" },
  submitBtn:  { flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 13.5, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  successWrap:  { padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  successTitle: { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  successSub:   { fontSize: 13.5, color: "#64748b", margin: 0 },
};
