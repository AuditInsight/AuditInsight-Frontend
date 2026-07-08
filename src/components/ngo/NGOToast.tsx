"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const CFG: Record<ToastType, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  success: { icon: <CheckCircle2 size={16} />, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  error:   { icon: <XCircle size={16} />,      color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  warning: { icon: <AlertTriangle size={16} />, color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
};

function Toast({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);
  const cfg = CFG[toast.type];

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300); }, 4000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [onDismiss]);

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "12px 14px", borderRadius: 12,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
      minWidth: 280, maxWidth: 360,
      transform: visible ? "translateX(0)" : "translateX(120%)",
      opacity: visible ? 1 : 0,
      transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
    }}>
      <span style={{ color: cfg.color, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{toast.title}</p>
        {toast.message && <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#475569" }}>{toast.message}</p>}
      </div>
      <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2, flexShrink: 0 }}>
        <X size={14} />
      </button>
    </div>
  );
}

export default function NGOToast({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => <Toast key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />)}
    </div>
  );
}

// Hook for easy use
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const push = (type: ToastType, title: string, message?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return {
    toasts,
    dismiss,
    success: (title: string, message?: string) => push("success", title, message),
    error:   (title: string, message?: string) => push("error",   title, message),
    warning: (title: string, message?: string) => push("warning", title, message),
  };
}


