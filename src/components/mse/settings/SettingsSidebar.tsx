"use client";

import type { CSSProperties } from "react";
import { theme } from "@/styles/theme";

interface Props {
  active: string;
  setActive: (value: string) => void;
}

const items = [
  "Organization",
  "Users & Roles",
  "Permissions",
  "Workflow",
  "Compliance",
  "Security",
  "Billing & Plans",
  "Audit Logs",
];

export default function SettingsSidebar({ active, setActive }: Props) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Settings</h3>

      {items.map((item) => {
        const isActive = active === item;

        return (
          <button
            key={item}
            onClick={() => setActive(item)}
            style={{
              ...styles.item,
              ...(isActive ? styles.activeItem : {}),
            }}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  title: {
    margin: 0,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
  },

  item: {
    height: 40,
    border: "none",
    borderRadius: 10,
    background: "transparent",
    textAlign: "left",
    padding: "0 12px",
    cursor: "pointer",
    fontSize: 14,
    color: "#374151",
    transition: "all 0.2s ease",
  },

  activeItem: {
    background: "#1e3a8a",
    color: "#fff",
    fontWeight: 600,
  },
};


