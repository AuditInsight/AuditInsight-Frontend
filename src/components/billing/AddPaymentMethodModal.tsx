"use client";

import { useState } from "react";
import { CardPaymentMethod, MOMOPaymentMethod } from "@/types/billing";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: CardPaymentMethod | MOMOPaymentMethod) => void;
}

type MethodType = "momo" | "card";

export default function AddPaymentMethodModal({ isOpen, onClose, onAdd }: Props) {
  const [methodType, setMethodType] = useState<MethodType>("momo");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState<"mtn" | "airtel" | "other">("mtn");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAddMOMO = async () => {
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    try {
      const method: MOMOPaymentMethod = {
        id: `pm_momo_${Date.now()}`,
        type: "momo",
        provider: "momo",
        phoneNumber,
        network,
        isDefault: false,
        createdAt: new Date().toISOString(),
      };
      onAdd(method);
      onClose();
    } catch (err) {
      setError("Failed to add MOMO payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
      setError("All card details are required");
      return;
    }

    setLoading(true);
    try {
      const [month, year] = cardExpiry.split("/");
      const method: CardPaymentMethod = {
        id: `pm_card_${Date.now()}`,
        type: "card",
        provider: "stripe",
        brand: "visa",
        last4: cardNumber.slice(-4),
        expiryMonth: parseInt(month),
        expiryYear: 2000 + parseInt(year),
        isDefault: false,
        createdAt: new Date().toISOString(),
      };
      onAdd(method);
      onClose();
    } catch (err) {
      setError("Failed to add card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <h2 style={s.title}>Add Payment Method</h2>
          <button style={s.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={s.tabs}>
          <button
            style={{
              ...s.tab,
              ...(methodType === "momo" ? s.tabActive : {}),
            }}
            onClick={() => {
              setMethodType("momo");
              setError("");
            }}
          >
            📱 Mobile Money
          </button>
          <button
            style={{
              ...s.tab,
              ...(methodType === "card" ? s.tabActive : {}),
            }}
            onClick={() => {
              setMethodType("card");
              setError("");
            }}
          >
            💳 Card
          </button>
        </div>

        <div style={s.content}>
          {methodType === "momo" ? (
            <div style={s.form}>
              <div style={s.formGroup}>
                <label style={s.label}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+256 700 123456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={s.input}
                  disabled={loading}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Network Provider</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as "mtn" | "airtel" | "other")}
                  style={s.input}
                  disabled={loading}
                >
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="airtel">Airtel Money</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={s.form}>
              <div style={s.formGroup}>
                <label style={s.label}>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  style={s.input}
                  disabled={loading}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                  maxLength={16}
                  style={s.input}
                  disabled={loading}
                />
              </div>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/25"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    style={s.input}
                    disabled={loading}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                    maxLength={4}
                    style={s.input}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {error && <div style={s.error}>{error}</div>}

          <div style={s.actions}>
            <button style={s.btnSecondary} onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              style={s.btnPrimary}
              onClick={methodType === "momo" ? handleAddMOMO : handleAddCard}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Payment Method"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottom: "1px solid #e2e8f0",
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#94a3b8",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  tabs: {
    display: "flex",
    gap: 0,
    padding: "16px 24px",
    borderBottom: "1px solid #e2e8f0",
  },
  tab: {
    padding: "8px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    color: "#94a3b8",
    borderBottom: "2px solid transparent",
    marginBottom: -16,
    paddingBottom: 24,
  },
  tabActive: {
    color: "#1e3a8a",
    borderBottomColor: "#1e3a8a",
  },
  content: {
    padding: 24,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
  },
  input: {
    padding: "10px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  },
  error: {
    padding: "12px 16px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    color: "#dc2626",
    fontSize: 13,
    marginTop: 16,
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 24,
    justifyContent: "flex-end",
  },
  btnPrimary: {
    padding: "10px 16px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "10px 16px",
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
