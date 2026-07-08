"use client";

import { EvidenceSearch } from "./EvidenceSearch";
import { EvidenceDropdown } from "./EvidenceDropdown";
import { theme } from "@/styles/theme";

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

export const EvidenceFilters = ({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  yearFilter,
  setYearFilter,
  categoryOptions,
  yearOptions,
  total,
  setPage,
}: EvidenceFiltersProps) => {
  const tabs: EvidenceTab[] = ["All", "Complete", "Pending"];

  return (
    /* ✅ CARD WRAPPER */
    <div
      style={{
        background: theme.colors.Surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        padding: 16,
        marginBottom: 20,
      }}
    >
      {/* 🔹 ROW 1 */}
      <div style={row}>
        
        {/* LEFT: DROPDOWNS */}
        <div style={{ display: "flex", gap: 10 }}>
          <EvidenceDropdown
            label={
              categoryFilter === "All"
                ? "Category"
                : `Category: ${categoryFilter}`
            }
            options={categoryOptions}
            onChange={(opt) => {
              setCategoryFilter(opt);
              setPage(1);
            }}
          />

          <EvidenceDropdown
            label={
              statusFilter === "All"
                ? "Status"
                : `Status: ${statusFilter}`
            }
            options={["All", "Verified", "Pending"]}
            onChange={(opt) => {
              setStatusFilter(opt);
              setPage(1);
            }}
          />

          <EvidenceDropdown
            label={
              yearFilter === "All" ? "Year" : `Year: ${yearFilter}`
            }
            options={yearOptions}
            onChange={(opt) => {
              setYearFilter(opt);
              setPage(1);
            }}
          />
        </div>

        {/* RIGHT: TABS */}
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                style={{
                  ...pill,
                  background: isActive
                    ? theme.colors.primary
                    : theme.colors.appBackground,
                  color: isActive
                    ? "#fff"
                    : theme.colors.textSecondary,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = isActive
                    ? theme.colors.primary
                    : theme.colors.appBackground)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = isActive
                    ? theme.colors.primary
                    : theme.colors.appBackground)
                }
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔹 ROW 2 */}
      <div style={row}>
        <span style={countText}>
          Showing 1–25 of {total.toLocaleString()} documents
        </span>

        <EvidenceSearch
          value={search}
          onChange={setSearch}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

/* 🎨 STYLES */

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
  flexWrap: "wrap",
  gap: 10,
};

const pill: React.CSSProperties = {
  padding: "6px 14px",
  borderRadius: 20,
  border: "none",
  fontSize: 13,
  cursor: "pointer",
  fontWeight: 500,
  transition: "all 0.2s ease",
};

const countText: React.CSSProperties = {
  fontSize: 13,
  color: theme.colors.textMuted,
};