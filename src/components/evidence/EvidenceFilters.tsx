"use client";

import { EvidenceSearch } from "./EvidenceSearch";
import { EvidenceDropdown } from "./EvidenceDropdown";

export type EvidenceTab = "All" | "Complete" | "Pending" | "Red Flagged";

interface EvidenceFiltersProps {
  activeTab: EvidenceTab;
  setActiveTab: (tab: EvidenceTab) => void;

  search: string;
  setSearch: (value: string) => void;

  total: number;

  setPage: (page: number) => void; // ✅ NEW
}

export const EvidenceFilters = ({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  total,
  setPage, // ✅ NEW
}: EvidenceFiltersProps) => {
  const tabs: EvidenceTab[] = [
    "All",
    "Complete",
    "Pending",
    "Red Flagged",
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      
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
                setPage(1); // 🔥 RESET PAGE HERE
              }}
              style={{
                ...pill,
                background:
                  activeTab === tab ? "#0A4178" : "#f1f5f9",
                color: activeTab === tab ? "#fff" : "#475569",
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

        {/* ✅ ONLY CHANGE HERE */}
        <EvidenceSearch
          value={search}
          onChange={setSearch}
          setPage={setPage} // 🔥 ADDED
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
  color: "#64748b",
};