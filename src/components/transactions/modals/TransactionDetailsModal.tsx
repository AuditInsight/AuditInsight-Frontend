"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  evidences: Evidence[];
}

export const TransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction,
  evidences,
}: Props) => {
  if (!isOpen || !transaction) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        
        {/* 🔹 HEADER */}
        <div style={header}>
          <h3 style={title}>
            Transaction #{transaction.id}
          </h3>

          <button onClick={onClose} style={closeBtn}>
            ✕
          </button>
        </div>

        {/* 🔹 CONTENT */}
        <div style={{ marginTop: theme.spacing.sm }}>
          <p><b>Amount:</b> ${transaction.amount}</p>
          <p><b>Counterparty:</b> {transaction.counterparty}</p>
          <p><b>Status:</b> {transaction.status}</p>
          <p><b>Date:</b> {transaction.date}</p>
          <p><b>Risk Score:</b> {transaction.riskScore}%</p>
        </div>

        {/* 🔹 EVIDENCE */}
        <div style={{ marginTop: theme.spacing.lg }}>
          <h4 style={sectionTitle}>Evidence</h4>

          {evidences.length === 0 && (
            <p style={emptyState}>No evidence attached</p>
          )}

          {evidences.map((e) => (
            <div key={e.id} style={evidenceItem}>
              <span>{e.name}</span>

              <span
                style={{
                  ...status,
                  ...(e.status === "Verified"
                    ? successBadge
                    : e.status === "Missing"
                    ? dangerBadge
                    : warningBadge),
                }}
              >
                {e.status}
              </span>
            </div>
          ))}
        </div>

        {/* 🔹 FOOTER */}
        <div style={footer}>
          <button onClick={onClose} style={closeButton}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};




/* 🎨 THEMED STYLES */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.5)", // 🔥 matches your dark overlay system
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: theme.zIndex.modal,
};

const modal: React.CSSProperties = {
  width: 460,
  background: theme.colors.Surface,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadows.lg,
  border: `1px solid ${theme.colors.border}`,
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing.md,
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: theme.typography.lg,
  fontWeight: 600,
  color: theme.colors.textPrimary,
};

const closeBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 18,
  color: theme.colors.textSecondary,
};

const sectionTitle: React.CSSProperties = {
  fontSize: theme.typography.sm,
  color: theme.colors.textSecondary,
  marginBottom: theme.spacing.sm,
};

const evidenceItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 10px",
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.divider}`,
  background: theme.colors.appBackground,
  marginBottom: theme.spacing.xs,
};

const status: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  padding: "4px 8px",
  borderRadius: theme.radius.sm,
};

/* 🔥 STATUS COLORS (USING YOUR THEME) */
const successBadge = {
  background: theme.colors.successBg,
  color: theme.colors.success,
};

const warningBadge = {
  background: theme.colors.warningBg,
  color: theme.colors.warning,
};

const dangerBadge = {
  background: theme.colors.dangerBg,
  color: theme.colors.danger,
};

const emptyState: React.CSSProperties = {
  fontSize: theme.typography.sm,
  color: theme.colors.textMuted,
};

const footer: React.CSSProperties = {
  marginTop: theme.spacing.lg,
  display: "flex",
  justifyContent: "flex-end",
};

const closeButton: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.Surface,
  cursor: "pointer",
};