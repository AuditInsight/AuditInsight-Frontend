import { Evidence } from "@/types/evidence.types";
import { Badge } from "@/components/ui/badge/badge";
import { FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Props {
  evidence: Evidence;
  onOpenTransaction: (id: string) => void;
}

export const EvidenceRow = ({ evidence, onOpenTransaction }: Props) => {
  const [hover, setHover] = useState(false);

  return (
    <tr
      style={{
        ...row,
        background: hover ? "#f8fafc" : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* 📄 DOCUMENT */}
      <td style={td}>
        <div style={docCell}>
          <FileText size={16} color="#64748b" />
          <span>{evidence.name}</span>
        </div>
      </td>

      {/* CATEGORY */}
      <td style={td}>{evidence.category}</td>

      {/* AMOUNT */}
      <td style={td}>{evidence.amount ? `$${evidence.amount}` : "-"}</td>

      {/* DATE */}
      <td style={td}>{evidence.date}</td>

      {/* 🔗 LINKED TRANSACTION */}
      <td style={td}>
        <span
          style={link}
          onClick={() => onOpenTransaction(evidence.transactionId)}
        >
          {evidence.transactionId}
        </span>
      </td>

      {/* STATUS */}
      <td style={td}>
        <Badge
          label={evidence.status}
          variant={
            evidence.status === "Missing"
              ? "danger"
              : evidence.status === "Pending"
              ? "warning"
              : "success"
          }
        />
      </td>

      {/* 🤖 AI FLAG */}
      <td style={td}>
        {evidence.status === "Missing" && (
          <div style={risk}>
            <AlertTriangle size={14} />
            Risk detected
          </div>
        )}
      </td>
    </tr>
  );
};

/* 🎨 STYLES */
const row: React.CSSProperties = {
  borderTop: "1px solid #f1f5f9",
  transition: "background 0.2s ease",
};

const td: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 14,
};

const docCell: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: 500,
};

const risk: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  color: "#dc2626",
  fontSize: 12,
  fontWeight: 500,
};