"use client";

import { useState } from "react";
import { theme } from "@/styles/theme";

interface Props {
  onSelectItem: (category: string) => void;
}

const sections = [
  {
    title: "Financial Reporting",
    items: ["Financial statements", "Trial balance", "General ledger extracts"],
  },
  {
    title: "Banking & Cash",
    items: ["Bank statements", "Bank reconciliations", "Payment confirmations"],
  },
  {
    title: "Sales Evidence",
    items: ["Sales invoices", "Receipts", "Credit notes"],
  },
  { title: "Payroll & HR", items: [] },
  { title: "Tax & Compliance", items: [] },
  { title: "Inventory & Assets", items: [] },
  { title: "Legal & Governance", items: [] },
  { title: "IT & Systems", items: [] },
  { title: "Policies & Procedures", items: [] },
  {
    title: "Other Supporting Docs",
    items: ["+ Add more"],
  },
];

export const Sidebar = ({ onSelectItem }: Props) => {
  const [activeSection, setActiveSection] = useState<string>(
    "Financial Reporting"
  );
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setActiveSection((prev) => (prev === title ? "" : title));
  };

  return (
    <div style={container}>
      {sections.map((section) => {
        const isOpen = activeSection === section.title;

        return (
          <div key={section.title} style={{ marginBottom: 10 }}>
            
            {/* 🔵 SECTION HEADER */}
            <div
              onClick={() => toggleSection(section.title)}
              style={{
                ...sectionHeader,
                background: isOpen
                  ? theme.colors.gradientHeader
                  : "transparent",
                color: isOpen
                  ? "#fff"
                  : theme.colors.textPrimary,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = isOpen
                  ? theme.colors.gradientHeader
                  : theme.colors.appBackground)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = isOpen
                  ? theme.colors.gradientHeader
                  : "transparent")
              }
            >
              {section.title}

              <span style={{ fontSize: 12 }}>
                {isOpen ? "▾" : "▸"}
              </span>
            </div>

            {/* 📂 ITEMS */}
            {isOpen && section.items.length > 0 && (
              <div style={{ marginTop: 6, paddingLeft: 10 }}>
                {section.items.map((item) => {
                  const isActive = activeItem === item;

                  return (
                    <div
                      key={item}
                      style={{
                        ...itemStyle,
                        background: isActive
                          ? theme.colors.primary
                          : "transparent",
                        color: isActive
                          ? "#fff"
                          : theme.colors.textSecondary,
                        fontWeight: isActive ? 500 : 400,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        onSelectItem(item);
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = isActive
                          ? theme.colors.primary
                          : theme.colors.appBackground)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = isActive
                          ? theme.colors.primary
                          : "transparent")
                      }
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* 🎨 THEME-ALIGNED STYLES */

const container: React.CSSProperties = {
  width: 260,
  background: theme.colors.Surface,
  borderRight: `1px solid ${theme.colors.border}`,
  height: "100vh",
  padding: 12,
};

const sectionHeader: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "all 0.2s ease",
};

const itemStyle: React.CSSProperties = {
  padding: "6px 12px",
  marginBottom: 4,
  borderRadius: 6,
  fontSize: 13,
  cursor: "pointer",
  transition: "all 0.2s ease",
};