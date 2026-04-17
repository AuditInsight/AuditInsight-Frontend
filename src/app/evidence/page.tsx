"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/evidenceSidebar";
import { EvidenceHeader } from "@/components/evidence/EvidenceHeader";
import {
  EvidenceFilters,
  EvidenceTab,
} from "@/components/evidence/EvidenceFilters";
import { EvidenceTable } from "@/components/evidence/EvidenceTable";
import { EvidencePagination } from "@/components/evidence/EvidencePagination";
import { evidenceData } from "@/data/evidence.data";
import { theme } from "@/styles/theme";

export default function EvidencePage() {
  // 🔥 GLOBAL STATE
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EvidenceTab>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 25;

  // 🔥 FILTERING LOGIC
  const filteredData = useMemo(() => {
    return evidenceData.filter((e) => {
      if (activeCategory && e.category !== activeCategory) return false;

      if (activeTab === "Pending" && e.status !== "Pending") return false;
      if (activeTab === "Complete" && e.status !== "Verified") return false;
      if (activeTab === "Red Flagged" && e.status !== "Missing") return false;

      if (
        search &&
        !e.name.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      return true;
    });
  }, [activeCategory, activeTab, search]);

  // 🔥 PAGINATION
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    /* ✅ GLOBAL APP WRAPPER */
    <div
      style={{
        display: "flex",
        background: theme.colors.appBackground,
        minHeight: "100vh",
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* 🔹 SIDEBAR */}
      <Sidebar onSelectItem={setActiveCategory} />

      {/* 🔹 MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: theme.spacing.lg,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.md,
        }}
      >
        <EvidenceHeader />

        <EvidenceFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          total={filteredData.length}
          setPage={setPage}
        />

        <EvidenceTable data={paginatedData} />

        <EvidencePagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}