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
import { EvidenceUploadModal } from "@/components/evidence/EvidenceUploadModal"; // ✅ ADD THIS
import { evidenceData } from "@/data/evidence.data";
import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";

/* ✅ SIDEBAR SECTIONS */
const sections = [
  {
    title: "Financial Reporting",
    items: [
      "Financial statements",
      "Trial balance",
      "General ledger extracts",
    ],
  },
  {
    title: "Banking & Cash",
    items: [
      "Bank statements",
      "Bank reconciliations",
      "Payment confirmations",
    ],
  },
  {
    title: "Sales Evidence",
    items: ["Sales invoices", "Receipts", "Credit notes"],
  },
  {
    title: "Payroll & HR",
    items: [
      "Payroll registers",
      "Employment contracts",
      "Leave records",
      "Staff ID documents",
      "Salary change approvals",
      "Timesheets",
      "Pension contribution records",
    ],
  },
  {
    title: "Tax & Compliance",
    items: [
      "VAT returns",
      "PAYE filings",
      "Corporate tax returns",
      "Tax clearance certificates",
      "RRA correspondence",
      "Withholding tax records",
      "Compliance licenses",
    ],
  },
  {
    title: "Inventory & Assets",
    items: [
      "Stock count sheets",
      "Asset register",
      "Purchase records",
      "Disposal approvals",
      "Depreciation schedules",
      "Warehouse reports",
      "Transfer forms",
    ],
  },
  {
    title: "Other Supporting Docs",
    items: ["Emails", "Screenshots", "Supporting schedules"],
  },
];

export default function EvidencePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EvidenceTab>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ✅ LIVE STATE */
  const [documents, setDocuments] = useState<Evidence[]>(evidenceData);
  const [uploadOpen, setUploadOpen] = useState(false);

  const pageSize = 25;

  /* ✅ ADD EVIDENCE HANDLER */
  const handleAddEvidence = (newEvidence: Evidence) => {
    setDocuments((prev) => [newEvidence, ...prev]);
  };

  /* ✅ FILTERING */
  const filteredData = useMemo(() => {
    return documents.filter((e) => {
      if (activeCategory && e.subCategory !== activeCategory) return false;

      if (activeTab === "Pending" && e.status !== "Pending") return false;
      if (activeTab === "Complete" && e.status !== "Verified") return false;
      if (activeTab === "Red Flagged" && e.status !== "Missing") return false;

      if (
        search &&
        !e.name.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [documents, activeCategory, activeTab, search]);

  /* ✅ PAGINATION */
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div
      style={{
        display: "flex",
        background: theme.colors.appBackground,
        minHeight: "100vh",
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* 🔹 SIDEBAR */}
      <Sidebar
        sections={sections}
        evidenceData={documents}
        onSelectItem={setActiveCategory}
      />

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
        {/* HEADER */}
        <EvidenceHeader onAdd={() => setUploadOpen(true)} />

        {/* FILTERS */}
        <EvidenceFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          total={filteredData.length}
          setPage={setPage}
        />

        {/* TABLE */}
        <EvidenceTable data={paginatedData} />

        {/* PAGINATION */}
        <EvidencePagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>

      {/* ✅ THIS IS WHERE THE MODAL GOES (IMPORTANT) */}
      <EvidenceUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={handleAddEvidence}
        sections={sections}
      />
    </div>
  );
}