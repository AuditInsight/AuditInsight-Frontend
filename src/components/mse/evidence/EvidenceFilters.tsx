"use client";

import { EvidenceSearch } from "./EvidenceSearch";
import { EvidenceDropdown } from "./EvidenceDropdown";
import { theme } from "@/styles/theme";
import { SlidersHorizontal } from "lucide-react";

export type EvidenceTab = "All" | "Complete" | "Pending";

interface EvidenceFiltersProps {
  activeTab: EvidenceTab;
  setActiveTab: (tab: EvidenceTab) => void;
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
  categoryOptions: string[];
  yearOptions: string[];
  total: number;
  setPage: (page: number) => void;
}

const TAB_CONFIG: { tab: EvidenceTab; color: string; bg: string }[] = [
  { tab: "All",      color: "#1e3a8a", bg: "#eff6ff" },
  { tab: "Complete", color: "#15803d", bg: "#f0fdf4" },
  { tab: "Pending",  color: "#b45309", bg: "#fffbeb" },
];

export const EvidenceFilters = ({
  activeTab, setActiveTab,
  search, setSearch,
  categoryFilter, setCategoryFilter,
  statusFilter, setStatusFilter,
  yearFilter, setYearFilter,
  categoryOptions, yearOptions,
  total, setPage,
}: EvidenceFiltersProps) => {
  return (
    <div style={card}>
      {/* Row 1: Tabs + Filters */}
      <div style={row}>
        {/* Tabs */}
        <div style={tabGroup}>
          {TAB_CONFIG.map(({ tab, color, bg }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                style={{
                  ...tabBtn,
                  background: isActive ? bg : "transparent",
                  color: isActive ? color : theme.colors.textSecondary,
                  borderColor: isActive ? color + "44" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div style={filterGroup}>
          <SlidersHorizontal size={14} color={theme.colors.textMuted} />
          <EvidenceDropdown
            label={categoryFilter === "All" ? "Category" : `Category: ${categoryFilter}`}
            options={categoryOptions}
            onChange={(opt) => { setCategoryFilter(opt); setPage(1); }}
          />
          <EvidenceDropdown
            label={statusFilter === "All" ? "Status" : `Status: ${statusFilter}`}
            options={["All", "Verified", "Pending"]}
            onChange={(opt) => { setStatusFilter(opt); setPage(1); }}
          />
          <EvidenceDropdown
            label={yearFilter === "All" ? "Year" : `Year: ${yearFilter}`}
            options={yearOptions}
            onChange={(opt) => { setYearFilter(opt); setPage(1); }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={divider} />

      {/* Row 2: Count + Search */}
      <div style={{ ...row, marginBottom: 0 }}>
        <span style={countText}>
          <span style={{ fontWeight: 600, color: theme.colors.textPrimary }}>{total.toLocaleString()}</span>
          {" "}document{total !== 1 ? "s" : ""} found
        </span>
        <EvidenceSearch value={search} onChange={setSearch} setPage={setPage} />
      </div>
    </div>
  );
};

const card: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: "14px 18px",
  boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 12,
};

const tabGroup: React.CSSProperties = {
  display: "flex",
  gap: 4,
  background: theme.colors.appBackground,
  padding: 4,
  borderRadius: 10,
};

const tabBtn: React.CSSProperties = {
  padding: "5px 16px",
  borderRadius: 7,
  border: "1px solid transparent",
  fontSize: 13,
  cursor: "pointer",
  transition: "all 0.15s ease",
  fontFamily: "inherit",
};

const filterGroup: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const divider: React.CSSProperties = {
  height: 1,
  background: theme.colors.border,
  margin: "0 0 12px",
};

const countText: React.CSSProperties = {
  fontSize: 13,
  color: theme.colors.textMuted,
};
