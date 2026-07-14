"use client";

import { useState } from "react";
import { X, Plus, AlertCircle } from "lucide-react";
import { isAxiosError } from "axios";
import { useAuth } from "@/context/AuthContext.production";
import { createTransaction } from "@/utils/api";
import type { NGOTransaction, DonorName } from "@/types/ngo";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (txn: NGOTransaction) => void;
}

const DONORS: DonorName[] = ["USAID", "UNICEF", "World Bank", "EU", "UNDP", "GIZ", "DFID", "Gates Foundation", "One Acre Fund", "Red Cross"];
const BUDGET_LINES = ["Medical Supplies", "Training & Workshops", "Scholarships", "Staff Costs", "Infrastructure", "Procurement", "Beneficiary Support", "Monitoring & Evaluation", "Grant Receipt", "Administration", "Other"];

export default function AddTransactionModal({ open, onClose, onSubmit }: Props) {
  const { user } = useAuth();

  const [projectName,   setProjectName]   = useState("");
  const [donor,         setDonor]         = useState<DonorName | "">("");
  const [budgetLine,    setBudgetLine]    = useState("");
  const [description,   setDescription]   = useState("");
  const [counterparty,  setCounterparty]  = useState("");
  const [date,          setDate]          = useState(new Date().toISOString().slice(0, 10));
  const [amount,        setAmount]        = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"BANK" | "MOBILE_MONEY" | "CASH">("BANK");
  const [type,          setType]          = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [error,         setError]         = useState("");
  const [submitting,    setSubmitting]    = useState(false);

  if (!open) return null;

  const reset = () => {
    setProjectName(""); setDonor(""); setBudgetLine(""); setDescription("");
    setCounterparty(""); setDate(new Date().toISOString().slice(0, 10));
    setAmount(""); setPaymentMethod("BANK"); setType("EXPENSE"); setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!projectName.trim())  { setError("Project name is required."); return; }
    if (!donor)               { setError("Please select a donor."); return; }
    if (!budgetLine)          { setError("Please select a budget line."); return; }
    if (!description.trim())  { setError("Description is required."); return; }
    if (!counterparty.trim()) { setError("Counterparty is required."); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setError("Enter a valid amount."); return; }

    setError("");
    setSubmitting(true);
    try {
      const { data: created } = await createTransaction({
        organisationId: user?.organisationId ?? "",
        name:           projectName.trim(),
        counterparty:   counterparty.trim(),
        date,
        amount:         Number(amount),
        type,
        paymentMethod,
        donor:          donor as DonorName,
        budgetLine,
        // description goes into notes — backend has no separate description field
      });

      const newTxn: NGOTransaction = {
        id:             created.id,
        organisationId: created.organisationId,
        projectName:    projectName.trim(),
        donor:          donor as DonorName,
        budgetLine,
        description:    description.trim(),
        counterparty:   created.counterparty ?? counterparty.trim(),
        date:           String(created.date),
        amount:         Number(created.amount),
        currency:       "RWF",
        paymentMethod:  created.paymentMethod,
        type:           created.type,
        status:         "PENDING",
        evidenceCount:  0,
        createdBy:      created.createdBy ?? user?.fullName ?? "",
        createdAt:      String(created.createdAt),
      };

      onSubmit(newTxn);
      reset();
      onClose();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to save transaction. Please try again.");
      } else {
        setError("Unable to reach the server. Check your connection.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={s.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div style={s.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <div style={s.headerIcon}><Plus size={18} color="#1e3a8a" /></div>
          <div style={{ flex: 1 }}>
            <h3 style={s.title}>New Transaction</h3>
            <p style={s.sub}>Record a new project transaction</p>
          </div>
          <button style={s.closeBtn} onClick={handleClose}><X size={16} /></button>
        </div>

        <div style={s.body}>
          {error && (
            <div style={s.errBanner}><AlertCircle size={13} style={{ flexShrink: 0 }} /> {error}</div>
          )}

          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Project Name <span style={s.req}>*</span></label>
              <input style={s.input} placeholder="e.g. Community Health Outreach" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
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
              <label style={s.label}>Type <span style={s.req}>*</span></label>
              <select style={s.select} value={type} onChange={(e) => setType(e.target.value as "EXPENSE" | "INCOME")}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Description <span style={s.req}>*</span></label>
            <input style={s.input} placeholder="Brief description of the transaction" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div style={s.field}>
            <label style={s.label}>Counterparty <span style={s.req}>*</span></label>
            <input style={s.input} placeholder="Vendor, supplier, or payee name" value={counterparty} onChange={(e) => setCounterparty(e.target.value)} />
          </div>

          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Amount <span style={s.req}>*</span></label>
              <input style={s.input} type="number" min="1" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Date <span style={s.req}>*</span></label>
              <input style={s.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
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

        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={handleClose} disabled={submitting}>Cancel</button>
          <button style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }} onClick={handleSubmit} disabled={submitting}>
            <Plus size={14} /> {submitting ? "Saving…" : "Add Transaction"}
          </button>
        </div>
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
  body:       { padding: "20px 24px" },
  errBanner:  { background: "rgba(30,58,138,0.06)", border: "1px solid rgba(30,58,138,0.2)", color: "#1e3a8a", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
  row:        { display: "flex", gap: 14 },
  field:      { flex: 1, marginBottom: 14 },
  label:      { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  req:        { color: "#2563eb" },
  input:      { width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 13.5, color: "#0f172a", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit", background: "#f8fafc" },
  select:     { width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 13.5, color: "#0f172a", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit", background: "#f8fafc", cursor: "pointer" },
  footer:     { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, position: "sticky", bottom: 0, background: "#fff" },
  cancelBtn:  { padding: "10px 20px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" },
  submitBtn:  { flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
};
