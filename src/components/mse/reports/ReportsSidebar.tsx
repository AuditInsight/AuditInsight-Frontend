"use client";

import type { CSSProperties } from "react";
import { REPORT_TABS, type ReportTabId } from "./reportTabs";

interface Props {
  active: ReportTabId;
  setActive: (value: ReportTabId) => void;
}

export default function ReportsSidebar({ active, setActive }: Props) {
  return (
    <div style={styles.container}>
      {REPORT_TABS.map((item) => {
        const isActive = active === item;

        return (
          <div
            key={item}
            onClick={() => setActive(item)}
            style={{
              ...styles.item,
              ...(isActive ? styles.activeItem : {}),
            }}
          >
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
}

export { DEFAULT_REPORT_TAB, REPORT_TABS, type ReportTabId } from "./reportTabs";

const styles: Record<string, CSSProperties> = {
  container: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
    height: "fit-content",
  },

  item: {
    padding: "16px 18px",
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#334155",
    transition: "all 0.2s ease",
  },

  activeItem: {
    background: "#1e3a8a",
    color: "#fff",
  },
};


