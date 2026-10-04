"use client";

import { EvidenceSearch } from "./EvidenceSearch";
import { EvidenceDropdown } from "./EvidenceDropdown";
import { theme } from "@/styles/theme";
import { SlidersHorizontal } from "lucide-react";

interface EvidenceFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
  categoryOptions: string[];
  yearOptions: string[];
  total: number;
  setPage: (page: number) => void;
}

export const EvidenceFilters = ({
  search, setSearch,
  categoryFilter, setCategoryFilter,
  yearFilter, setYearFilter,
  categoryOptions, yearOptions,
  total, setPage,
}: EvidenceFiltersProps) => {
  return (
    <div style={card}>
      {/* Row 1: Filters */}
      <div style={row}>
        {/* Filters */}
        <div style={filterGroup}>
          <SlidersHorizontal size={14} color={theme.colors.textMuted} />
          <EvidenceDropdown
            label={categoryFilter === "All" ? "Category" : `Category: ${categoryFilter}`}
            options={categoryOptions}
            onChange={(opt) => { setCategoryFilter(opt); setPage(1); }}
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
