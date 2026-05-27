"use client";

import { useRouter } from "next/navigation";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { statusStyles } from "./EvidenceTable";

interface Props {
  isOpen: boolean;
  evidence: Evidence | null;
  onClose: () => void;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div style={row}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value ?? "—"}</span>
    </div>
  );
}

export function EvidenceDetailsModal({ isOpen, evidence, onClose }: Props) {
  const router = useRouter();

  if (!isOpen || !evidence) return null;

  const statusStyle =
    statusStyles[evidence.status as keyof typeof statusStyles] ??
    statusStyles.Pending;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h3 style={title}>Evidence details</h3>
          <button type="button" onClick={onClose} style={closeBtn}>
            ✕
          </button>
        </div>

        <div style={body}>
          <DetailRow
            label="Document"
            value={
              evidence.url && evidence.url !== "#" ? (
                <a
                  href={evidence.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={link}
                >
                  {evidence.name}
                </a>
              ) : (
                evidence.name
              )
            }
          />
          <DetailRow
            label="Verification"
            value={
              <span style={{ ...badge, ...statusStyle }}>
                {evidence.status}
              </span>
            }
          />
          <DetailRow label="Category" value={evidence.category} />
          <DetailRow label="Subcategory" value={evidence.subCategory} />
          <DetailRow
            label="Amount"
            value={
              evidence.amount != null
                ? `$${evidence.amount.toLocaleString()}`
                : "—"
            }
          />
          <DetailRow
            label="Counterparty"
            value={evidence.counterpartyName}
          />
          <DetailRow label="Date" value={evidence.date} />
          <DetailRow label="File type" value={evidence.type} />
          <DetailRow
            label="Linked transaction"
            value={
              evidence.transactionId ? (
                <button
                  type="button"
                  style={linkBtn}
                  onClick={() =>
                    router.push(
                      `/transactions?transactionId=${evidence.transactionId}`
                    )
                  }
                >
                  {evidence.transactionId}
                </button>
              ) : (
                "—"
              )
            }
          />
          <DetailRow label="Uploaded by" value={evidence.uploadedBy} />
          <DetailRow label="Uploaded at" value={evidence.uploadedAt} />
          <DetailRow label="Notes" value={evidence.notes || "—"} />
        </div>

        <div style={footer}>
          <button type="button" onClick={onClose} style={closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: theme.zIndex?.modal ?? 1000,
};

const modal: React.CSSProperties = {
  width: 480,
  maxWidth: "92%",
  maxHeight: "90vh",
  overflowY: "auto",
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
};

const closeBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 18,
  color: theme.colors.textSecondary,
};

const body: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.sm,
};

const row: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "140px 1fr",
  gap: theme.spacing.sm,
  alignItems: "start",
};

const labelStyle: React.CSSProperties = {
  fontSize: theme.typography.sm,
  color: theme.colors.textMuted,
  fontWeight: 500,
};

const valueStyle: React.CSSProperties = {
  fontSize: theme.typography.sm,
  color: theme.colors.textPrimary,
};

const badge: React.CSSProperties = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: theme.radius.sm,
  fontSize: 12,
  fontWeight: 600,
};

const link: React.CSSProperties = {
  color: theme.colors.primary,
  textDecoration: "underline",
};

const linkBtn: React.CSSProperties = {
  border: "none",
  background: "none",
  padding: 0,
  color: theme.colors.primary,
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: theme.typography.sm,
};

const footer: React.CSSProperties = {
  marginTop: theme.spacing.lg,
  display: "flex",
  justifyContent: "flex-end",
};

const closeButton: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.Surface,
  cursor: "pointer",
};
