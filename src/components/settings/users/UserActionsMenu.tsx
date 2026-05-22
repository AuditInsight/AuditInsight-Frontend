"use client";

import { useState } from "react";

interface Props {
  onEdit: () => void;
  onSuspend: () => void;
  onResetPassword: () => void;
}

export default function UserActionsMenu({
  onEdit,
  onSuspend,
  onResetPassword,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={styles.trigger}
      >
        ⋮
      </button>

      {open && (
        <div style={styles.menu}>
          <button style={styles.item} onClick={onEdit}>
            Edit User
          </button>

          <button style={styles.item} onClick={onSuspend}>
            Suspend User
          </button>

          <button
            style={styles.item}
            onClick={onResetPassword}
          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  trigger: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
  },

  menu: {
    position: "absolute",
    right: 0,
    top: "120%",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    width: 160,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
  },

  item: {
    padding: "10px",
    textAlign: "left",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
  },
};