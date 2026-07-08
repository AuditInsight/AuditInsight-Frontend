"use client";

interface Props {
  role: string;
}

export default function RoleBadge({
  role,
}: Props) {
  return (
    <span style={styles.badge}>
      {role}
    </span>
  );
}

const styles = {
  badge: {
    background: "#dbeafe",
    color: "#1e3a8a",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },
};


