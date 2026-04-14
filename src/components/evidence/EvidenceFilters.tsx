"use client";

import { EvidenceSearch } from "./EvidenceSearch";
import { EvidenceDropdown } from "./EvidenceDropdown";
import { theme } from "@/styles/theme"; // ✅ ADDED

export type EvidenceTab = "All" | "Complete" | "Pending" | "Red Flagged";

interface EvidenceFiltersProps {
  activeTab: EvidenceTab;
  setActiveTab: (tab: EvidenceTab) => void;

  search: string;
  setSearch: (value: string) => void;

  total: number;

  setPage: (page: number) => void;
}

export const EvidenceFilters = ({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  total,
  setPage,
}: EvidenceFiltersProps) => {
  const tabs: EvidenceTab[] = [
    "All",
    "Complete",
    "Pending",
    "Red Flagged",
  ];

  return (
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
            label="Category"
            options={[
              "Invoice",
              "Contract",
              "Receipt",
              "Approval",
              "Payroll",
              "Tax",
            ]}
          />

          <EvidenceDropdown
            label="Status"
            options={["Verified", "Pending", "Missing"]}
          />

          <EvidenceDropdown
            label="Date"
            options={["Today", "This Month", "This Year"]}
          />
        </div>

        {/* RIGHT: TABS */}
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              style={{
                ...pill,
                background:
                  activeTab === tab
                    ? theme.colors.primary
                    : theme.colors.appBackground,
                color:
                  activeTab === tab
                    ? "#fff"
                    : theme.colors.textSecondary,
              }}
            >
              {tab}
            </button>
          ))}
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
  color: theme.colors.textMuted, // ✅ themed
};