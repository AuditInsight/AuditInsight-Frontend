"use client";

import { useState } from "react";
import { ChevronDown, FolderOpen, FileText } from "lucide-react";
import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";

interface Section {
  title: string;
  items: string[];
}

interface Props {
  sections: Section[];
  evidenceData: Evidence[];
  onSelectItem: (category: string) => void;
}

export const Sidebar = ({
  sections,
  evidenceData,
  onSelectItem,
}: Props) => {
  const [openSections, setOpenSections] = useState<string[]>([
    "Financial Reporting",
  ]);

  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  // ✅ SAFE COUNT FUNCTION
  const getItemCount = (subCategory: string) => {
    return evidenceData.filter((doc) => {
      if (!doc.subfolder) return false;
      return doc.subfolder.trim().toLowerCase() === subCategory.trim().toLowerCase();
    }).length;
  };

  return (
    <div style={container}>
      <div style={sidebarTitle}>Document Library</div>

      {sections.map((section) => {
        const isOpen = openSections.includes(section.title);

        return (
          <div key={section.title} style={sectionCard}>
            {/* HEADER */}
            <div
              onClick={() => toggleSection(section.title)}
              style={sectionHeader}
            >
              <div style={headerLeft}>
                <FolderOpen size={16} />
                <span>{section.title}</span>
              </div>

              <ChevronDown
                size={16}
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.25s ease",
                }}
              />
            </div>

            {/* ITEMS */}
            {isOpen && (
              <div style={itemsWrapper}>
                {section.items.map((item) => {
                  const isActive = activeItem === item;
                  const count = getItemCount(item);

                  return (
                    <div
                      key={item}
                      onClick={() => {
                        setActiveItem(item);
                        onSelectItem(item);
                      }}
                      style={{
                        ...itemStyle,
                        background: isActive
                          ? theme.colors.primary
                          : "transparent",
                        color: isActive
                          ? "#fff"
                          : theme.colors.textSecondary,
                      }}
                    >
                      <div style={itemLeft}>
                        <FileText size={14} />
                        <span>{item}</span>
                      </div>

                      <span
                        style={{
                          ...countBadge,
                          background: isActive
                            ? "rgba(255,255,255,0.2)"
                            : theme.colors.appBackground,
                          color: isActive
                            ? "#fff"
                            : theme.colors.textMuted,
                        }}
                      >
                        {count}
                      </span>
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

/* =========================
   🎨 STYLES (FIXED)
========================= */

const container: React.CSSProperties = {
  width: 300,
  padding: 18,
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(12px)",
  borderRight: `1px solid ${theme.colors.border}`,
  minHeight: "100vh",
};

const sidebarTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 18,
  color: theme.colors.textPrimary,
};

const sectionCard: React.CSSProperties = {
  marginBottom: 12,
  borderRadius: 14,
  overflow: "hidden",
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.Surface,
  boxShadow: theme.shadows.sm,
};

const sectionHeader: React.CSSProperties = {
  padding: "14px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  fontWeight: 600,
  color: theme.colors.textPrimary,
};

const headerLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const itemsWrapper: React.CSSProperties = {
  padding: "8px",
  borderTop: `1px solid ${theme.colors.border}`,
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 12px",
  borderRadius: 8,
  fontSize: theme.typography.sm,
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginBottom: 4,
};

const itemLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const countBadge: React.CSSProperties = {
  minWidth: 26,
  height: 22,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 600,
};


