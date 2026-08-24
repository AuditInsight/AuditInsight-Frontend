"use client";

import { CardPaymentMethod, MOMOPaymentMethod, PaymentMethod } from "@/types/billing";

interface Props {
  methods: PaymentMethod[];
  selectedId?: string;
  onSelect: (methodId: string) => void;
  onAddCard?: () => void;
  onAddMOMO?: () => void;
}

export default function PaymentMethodSelector({
  methods,
  selectedId,
  onSelect,
  onAddCard,
  onAddMOMO,
}: Props) {
  const formatMOMOPhone = (phone: string) => {
    return phone.replace(/^(\+\d{3})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
  };

  const formatCardExpiry = (month: number, year: number) => {
    return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h3 style={s.title}>Payment Methods</h3>
        <div style={s.addButtons}>
          {onAddMOMO && (
            <button style={s.addBtn} onClick={onAddMOMO}>
              + Add MOMO
            </button>
          )}
          {onAddCard && (
            <button style={s.addBtn} onClick={onAddCard}>
              + Add Card
            </button>
          )}
        </div>
      </div>

      {methods.length === 0 ? (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}>💳</div>
          <p style={s.emptyText}>No payment methods added</p>
        </div>
      ) : (
        <div style={s.methodsList}>
          {methods.map((method) => (
            <div
              key={method.id}
              style={{
                ...s.methodCard,
                ...(selectedId === method.id ? s.methodCardSelected : {}),
              }}
              onClick={() => onSelect(method.id)}
              role="button"
            >
              <input
                type="radio"
                name="payment_method"
                checked={selectedId === method.id}
                onChange={() => onSelect(method.id)}
                style={s.radio}
              />
              <div style={s.methodContent}>
                {method.type === "momo" && (
                  <div>
                    <div style={s.methodLabel}>
                      📱 Mobile Money (MOMO)
                    </div>
                    <div style={s.methodDetails}>
                      {formatMOMOPhone((method as MOMOPaymentMethod).phoneNumber)} •{" "}
                      {((method as MOMOPaymentMethod).network || "other").toUpperCase()}
                    </div>
                  </div>
                )}
                {method.type === "card" && (
                  <div>
                    <div style={s.methodLabel}>
                      💳 {((method as CardPaymentMethod).brand || "Card").toUpperCase()}
                    </div>
                    <div style={s.methodDetails}>
                      ••••{(method as CardPaymentMethod).last4} •{" "}
                      {formatCardExpiry(
                        (method as CardPaymentMethod).expiryMonth,
                        (method as CardPaymentMethod).expiryYear
                      )}
                    </div>
                  </div>
                )}
              </div>
              {method.isDefault && (
                <span style={s.defaultBadge}>Default</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
  },
  addButtons: {
    display: "flex",
    gap: 8,
  },
  addBtn: {
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: 8,
    cursor: "pointer",
    color: "#475569",
    transition: "all 0.2s",
  },
  emptyState: {
    textAlign: "center",
    padding: "32px 24px",
    background: "#f8fafc",
    borderRadius: 12,
    border: "1px dashed #e2e8f0",
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    margin: 0,
    fontSize: 13,
    color: "#94a3b8",
  },
  methodsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  methodCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 16,
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  methodCardSelected: {
    borderColor: "#1e3a8a",
    background: "rgba(30,58,138,0.02)",
  },
  radio: {
    width: 18,
    height: 18,
    cursor: "pointer",
    flexShrink: 0,
  },
  methodContent: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#0f172a",
  },
  methodDetails: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  defaultBadge: {
    fontSize: 11,
    fontWeight: 600,
    background: "#dbeafe",
    color: "#0c4a6e",
    padding: "4px 8px",
    borderRadius: 6,
    flexShrink: 0,
  },
};
