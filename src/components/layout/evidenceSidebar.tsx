"use client";

import { useState } from "react";
import { ChevronDown, FolderOpen, FileText, Library } from "lucide-react";
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

export const Sidebar = ({ sections, evidenceData, onSelectItem }: Props) => {
  const [openSections, setOpenSections] = useState<string[]>(["Financial Reporting"]);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const getCount = (sub: string) =>
    evidenceData.filter((d) => d.subfolder?.trim().toLowerCase() === sub.trim().toLowerCase()).length;

  const getSectionCount = (section: Section) =>
    section.items.reduce((sum, item) => sum + getCount(item), 0);

  const totalDocs = evidenceData.length;

  return (
    <div style={container}>
      {/* Header */}
      <div style={headerRow}>
        <div style={headerIcon}>
          <Library size={16} color="#1e3a8a" />
        </div>
        <div>
          <div style={headerTitle}>Document Library</div>
          <div style={headerSub}>{totalDocs} documents</div>
        </div>
      </div>

      <div style={divider} />

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sections.map((section) => {
          const isOpen = openSections.includes(section.title);
          const sectionCount = getSectionCount(section);

          return (
            <div key={section.title} style={sectionCard}>
              <div onClick={() => toggleSection(section.title)} style={sectionHeader}>
                <div style={headerLeft}>
                  <FolderOpen size={14} color="#64748b" />
                  <span style={sectionTitle}>{section.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {sectionCount > 0 && (
                    <span style={sectionBadge}>{sectionCount}</span>
                  )}
                  <ChevronDown
                    size={14}
                    color="#94a3b8"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s ease" }}
                  />
                </div>
              </div>

              {isOpen && (
                <div style={itemsWrapper}>
                  {section.items.map((item) => {
                    const isActive = activeItem === item;
                    const count = getCount(item);

                    return (
                      <div
                        key={item}
                        onClick={() => { setActiveItem(item); onSelectItem(item); }}
                        style={{
                          ...itemStyle,
                          background: isActive ? "#eff6ff" : "transparent",
                          color: isActive ? "#1e3a8a" : theme.colors.textSecondary,
                        }}
                      >
                        <div style={itemLeft}>
                          <FileText size={12} color={isActive ? "#1e3a8a" : "#94a3b8"} />
                          <span style={{ fontSize: 12.5, lineHeight: 1.4 }}>{item}</span>
                        </div>
                        <span style={{
                          ...countBadge,
                          background: isActive ? "#dbeafe" : "#f1f5f9",
                          color: isActive ? "#1e3a8a" : theme.colors.textMuted,
                        }}>
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
    </div>
  );
};

const container: React.CSSProperties = {
  width: 272,
  padding: "16px 14px",
  background: "#fff",
  borderRight: `1px solid ${theme.colors.border}`,
  minHeight: "100vh",
  overflowY: "auto",
};

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 14,
};

const headerIcon: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const headerTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: theme.colors.textPrimary,
};

const headerSub: React.CSSProperties = {
  fontSize: 11.5,
  color: theme.colors.textMuted,
  marginTop: 1,
};

const divider: React.CSSProperties = {
  height: 1,
  background: theme.colors.border,
  marginBottom: 12,
};

const sectionCard: React.CSSProperties = {
  borderRadius: 10,
  overflow: "hidden",
  border: `1px solid ${theme.colors.border}`,
  background: "#fafafa",
};

const sectionHeader: React.CSSProperties = {
  padding: "10px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

const headerLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 600,
  color: theme.colors.textPrimary,
};

const sectionBadge: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  background: "#e2e8f0",
  color: "#475569",
  padding: "1px 6px",
  borderRadius: 10,
};

const itemsWrapper: React.CSSProperties = {
  padding: "6px",
  borderTop: `1px solid ${theme.colors.border}`,
  background: "#fff",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "7px 10px",
  borderRadius: 7,
  cursor: "pointer",
  transition: "all 0.15s ease",
  marginBottom: 2,
};

const itemLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  flex: 1,
  minWidth: 0,
};

const countBadge: React.CSSProperties = {
  minWidth: 22,
  height: 20,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 700,
  flexShrink: 0,
  padding: "0 5px",
};
