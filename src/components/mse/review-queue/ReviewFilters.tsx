"use client";

type Props = {
  severity: string;
  setSeverity: (value: string) => void;
};

export default function ReviewFilters({
  severity,
  setSeverity,
}: Props) {
  return (
    <div style={styles.wrapper}>
      <span style={styles.label}>Severity</span>

      <select
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
        style={styles.select}
      >
        <option value="All">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    marginTop: 12,
    width: "fit-content",
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
  },

  select: {
    height: 36,
    padding: "0 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 13,
    background: "#fff",
    cursor: "pointer",
  },
};


