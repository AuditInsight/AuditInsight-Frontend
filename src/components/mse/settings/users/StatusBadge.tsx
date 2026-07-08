"use client";

interface Props {
  status: "Active" | "Inactive" | "Suspended" | "Pending Invite";
}

export default function StatusBadge({ status }: Props) {
  const styles = getStyles(status);

  return <span style={styles.badge}>{status}</span>;
}

function getStyles(status: string) {
  let color = "#6b7280";
  let bg = "#f3f4f6";

  switch (status) {
    case "Active":
      color = "#166534";
      bg = "#dcfce7";
      break;

    case "Inactive":
      color = "#374151";
      bg = "#e5e7eb";
      break;

    case "Suspended":
      color = "#991b1b";
      bg = "#fee2e2";
      break;

    case "Pending Invite":
      color = "#92400e";
      bg = "#fef3c7";
      break;
  }

  return {
    badge: {
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      color,
      background: bg,
      display: "inline-block",
    } as React.CSSProperties,
  };
}


