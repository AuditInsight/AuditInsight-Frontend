"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction.types";
import { theme } from "@/styles/theme";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  transaction?: Transaction | null;
  mode?: "add" | "edit";
}

const emptyForm = (): Omit<Transaction, "id"> => ({
  date: "",
  amount: 0,
  counterparty: "",
  type: "EXPENSE",
  source: "MOBILE_MONEY",
  status: "COMPLETED",
  riskScore: 0,
});

export function AddTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transaction = null,
  mode = "add",
}: Props) {
  const [form, setForm] = useState<Omit<Transaction, "id">>(emptyForm());

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && transaction) {
      setForm({
        date: transaction.date,
        amount: transaction.amount,
        counterparty: transaction.counterparty,
        type: transaction.type,
        source: transaction.source,
        status: transaction.status,
        riskScore: transaction.riskScore,
      });
    } else {
      setForm(emptyForm());
    }
  }, [isOpen, mode, transaction]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "riskScore"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.date) {
      alert("Please select a date.");
      return;
    }
    onSubmit(form);
    onClose();
  };

  const title = mode === "edit" ? "Edit Transaction" : "Add Transaction";

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={titleStyle}>{title}</h3>

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          style={input}
        />

        <input
          name="amount"
          type="number"
          placeholder="Enter transaction amount (e.g. 5000)"
          value={form.amount || ""}
          onChange={handleChange}
          style={input}
        />

        <input
          name="counterparty"
          placeholder="Enter counterparty name (e.g. ABC Company)"
          value={form.counterparty}
          onChange={handleChange}
          style={input}
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={input}
        >
          <option value="EXPENSE">EXPENSE</option>
          <option value="INCOME">INCOME</option>
        </select>

        <select
          name="source"
          value={form.source}
          onChange={handleChange}
          style={input}
        >
          <option value="MOBILE_MONEY">MOBILE_MONEY</option>
          <option value="BANK">BANK</option>
          <option value="CASH">CASH</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={input}
        >
          <option value="COMPLETED">COMPLETED</option>
          <option value="PENDING">PENDING</option>
          <option value="FLAGGED">FLAGGED</option>
        </select>

        <input
          name="riskScore"
          type="number"
          placeholder="Risk score (0–100)"
          value={form.riskScore}
          onChange={handleChange}
          style={input}
        />

        <div style={footer}>
          <button onClick={onClose} style={button}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={button}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal: React.CSSProperties = {
  width: 420,
  background: theme.colors.Surface,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.sm,
};

const titleStyle: React.CSSProperties = {
  marginBottom: theme.spacing.sm,
};

const input: React.CSSProperties = {
  padding: "10px",
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
};

const footer: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 10,
};

const button: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
  cursor: "pointer",
};
