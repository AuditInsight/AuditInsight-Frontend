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
    <div style={{ display: "flex", gap: 12 }}>
      <label>Severity:</label>

      <select
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
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