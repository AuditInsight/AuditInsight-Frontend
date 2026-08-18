"use client";

import { theme } from "@/styles/theme";
import { X } from "lucide-react";

interface TransactionFiltersProps {
  status: string;
  setStatus: (status: string) => void;
  type: string;
  setType: (type: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  minAmount: string;
  setMinAmount: (min: string) => void;
  maxAmount: string;
  setMaxAmount: (max: string) => void;
  evidenceCount: string;
  setEvidenceCount: (count: string) => void;
  projectName: string;
  setProjectName: (project: string) => void;
  projectOptions: string[];
}

export const TransactionFilters = ({
  status,
  setStatus,
  type,
  setType,
  paymentMethod,
  setPaymentMethod,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  evidenceCount,
  setEvidenceCount,
  projectName,
  setProjectName,
  projectOptions,
}: TransactionFiltersProps) => {
  const hasActiveFilters = status !== "All" || type !== "All" || paymentMethod !== "All" || minAmount || maxAmount || evidenceCount !== "All" || projectName !== "All";

  return (
    <div style={container}>
      <div style={filterRow}>
        <FilterInput
          label="Status"
          value={status}
          onChange={setStatus}
          type="select"
          options={["All", "PENDING", "COMPLETED"]}
          displayNames={{ PENDING: "Pending", COMPLETED: "Completed", All: "All" }}
        />

        <FilterInput
          label="Type"
          value={type}
          onChange={setType}
          type="select"
          options={["All", "INCOME", "EXPENSE"]}
          displayNames={{ INCOME: "Income", EXPENSE: "Expense", All: "All" }}
        />

        <FilterInput
          label="Payment"
          value={paymentMethod}
          onChange={setPaymentMethod}
          type="select"
          options={["All", "MOBILE_MONEY", "BANK", "CASH"]}
          displayNames={{ MOBILE_MONEY: "Mobile Money", BANK: "Bank", CASH: "Cash", All: "All" }}
        />

        <FilterInput
          label="Evidence"
          value={evidenceCount}
          onChange={setEvidenceCount}
          type="select"
          options={["All", "HAS", "NO"]}
          displayNames={{ HAS: "Has Evidence", NO: "No Evidence", All: "All" }}
        />

        <FilterInput
          label="Min"
          value={minAmount}
          onChange={setMinAmount}
          type="number"
          placeholder="0"
        />

        <FilterInput
          label="Max"
          value={maxAmount}
          onChange={setMaxAmount}
          type="number"
          placeholder="999999"
        />

        {projectOptions.length > 0 && (
          <FilterInput
            label="Project"
            value={projectName}
            onChange={setProjectName}
            type="select"
            options={["All", ...projectOptions]}
          />
        )}

        {hasActiveFilters && (
          <button
            onClick={() => {
              setStatus("All");
              setType("All");
              setPaymentMethod("All");
              setMinAmount("");
              setMaxAmount("");
              setEvidenceCount("All");
              setProjectName("All");
            }}
            style={clearButton}
            title="Clear all filters"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

interface FilterInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: "select" | "number";
  options?: string[];
  displayNames?: Record<string, string>;
  placeholder?: string;
}

function FilterInput({ label, value, onChange, type, options, displayNames, placeholder }: FilterInputProps) {
  if (type === "select") {
    return (
      <div style={filterItem}>
        <span style={filterLabel}>{label}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={selectInput}>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {displayNames?.[opt] || opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div style={filterItem}>
      <span style={filterLabel}>{label}</span>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={numberInput}
      />
    </div>
  );
}

const container: React.CSSProperties = {
  padding: "14px 0",
  borderBottom: `1px solid ${theme.colors.border}`,
  marginBottom: 16,
};

const filterRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "flex-end",
  flexWrap: "nowrap",
  paddingBottom: 4,
};

const filterItem: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  flex: 1,
  minWidth: 0,
};

const filterLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: theme.colors.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const selectInput: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 6,
  border: `1px solid ${theme.colors.border}`,
  fontSize: "13px",
  cursor: "pointer",
  background: "#fff",
  color: theme.colors.textPrimary,
  fontFamily: "inherit",
  transition: "all 0.2s",
};

const numberInput: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 6,
  border: `1px solid ${theme.colors.border}`,
  fontSize: "13px",
  background: "#fff",
  color: theme.colors.textPrimary,
  fontFamily: "inherit",
};

const clearButton: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 6,
  border: `1px solid ${theme.colors.border}`,
  background: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
  color: "#dc2626",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  whiteSpace: "nowrap",
  transition: "all 0.2s",
  height: 34,
  width: 34,
};
