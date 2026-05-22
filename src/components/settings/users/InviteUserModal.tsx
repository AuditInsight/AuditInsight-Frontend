"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InviteUserModal({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Invite User</h3>

        <input
          placeholder="Email"
          style={styles.input}
        />

        <select style={styles.input}>
          <option>Auditor</option>
          <option>Admin</option>
          <option>Reviewer</option>
        </select>

        <div style={styles.actions}>
          <button onClick={onClose}>
            Cancel
          </button>

          <button style={styles.invite}>
            Invite
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 14,
    width: 400,
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },

  input: {
    height: 42,
    padding: "0 12px",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },

  invite: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
  },
};