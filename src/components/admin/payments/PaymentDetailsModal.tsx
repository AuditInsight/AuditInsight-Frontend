"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { AdminPaymentResponse } from "@/api/admin";
import PaymentDetails from "./PaymentDetails";
import PaymentStatusBadge from "./PaymentStatusBadge";

/** One payment's details as an overlay above the payments table; closes on ✕, Escape or a click outside. */
export default function PaymentDetailsModal({
  payment,
  onClose,
}: {
  payment: AdminPaymentResponse;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div style={overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-details-title"
        style={panel}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={header}>
          <div style={{ minWidth: 0 }}>
            <h2 id="payment-details-title" style={title}>
              Payment details
            </h2>
            <div style={subtitle}>
              {payment.organisationName ?? "Unknown organisation"}
              <PaymentStatusBadge status={payment.status} />
            </div>
          </div>
          <button type="button" style={closeBtn} onClick={onClose} aria-label="Close payment details" autoFocus>
            <X size={16} />
          </button>
        </div>
        <PaymentDetails payment={payment} />
      </div>
    </div>,
    document.body
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  zIndex: 9000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const panel: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  width: "100%",
  maxWidth: 720,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.25)",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  padding: "18px 20px",
  borderBottom: "1px solid #f1f5f9",
  position: "sticky",
  top: 0,
  background: "#fff",
};

const title: React.CSSProperties = { margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" };

const subtitle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 4,
  fontSize: 13,
  color: "#64748b",
};

const closeBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "none",
  background: "#f1f5f9",
  color: "#64748b",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
