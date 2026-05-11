"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/layout/evidenceSidebar";
import { EvidenceHeader } from "@/components/evidence/EvidenceHeader";
import {
  EvidenceFilters,
  EvidenceTab,
} from "@/components/evidence/EvidenceFilters";
import { EvidenceTable } from "@/components/evidence/EvidenceTable";
import { EvidencePagination } from "@/components/evidence/EvidencePagination";
import { EvidenceUploadModal } from "@/components/evidence/EvidenceUploadModal";
import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";
import { getEvidence, createEvidence } from "@/utils/api";

/* =========================
   TYPES
========================= */
type EvidenceSection = {
  title: string;
  items: string[];
};

/* =========================
   SIDEBAR SECTIONS
========================= */
const sections: EvidenceSection[] = [
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
  {
    title: "Purchases & Procurement",
    items: [
      "Purchase orders",
      "Supplier invoices",
      "Goods received notes",
      "Supplier contracts",
      "Tender documents",
      "Approval memos",
    ],
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
    title: "Policies & Procedures",
    items: [
      "Accounting policies",
      "Procurement policies",
      "HR policies",
      "Internal control manuals",
      "Approval workflows",
      "Risk management policies",
    ],
  },
  {
    title: "Legal & Governance",
    items: [
      "Board meeting minutes",
      "Shareholder resolutions",
      "Company registration documents",
      "Litigation records",
      "Contracts & agreements",
      "Regulatory correspondence",
    ],
  },
  {
  title: "IT & Systems Evidence",
  items: [
    "System access logs",
    "User permissions reports",
    "Audit trail exports",
    "Backup reports",
    "Security incident logs",
    "ERP transaction logs",
  ],
},
  {
    title: "Other Supporting Docs",
    items: [
      "Emails",
      "Documentation", 
      "Screenshots", 
      "Supporting schedules"],
  },
];

export default function EvidencePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EvidenceTab>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [documents, setDocuments] = useState<Evidence[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const pageSize = 25;

  /* =========================
     LOAD FROM BACKEND
  ========================= */
  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await getEvidence();
        setDocuments(res.data);
      } catch (error) {
        console.error("Failed to load evidence:", error);
      }
    };

    fetchEvidence();
  }, []);

  /* =========================
     SAVE TO BACKEND
  ========================= */
  const handleAddEvidence = async (
  newEvidence: Omit<Evidence, "id" | "uploadedAt">
) => {
  try {
    const res = await createEvidence(newEvidence);

    const savedEvidence: Evidence = {
      ...res.data,

      // ✅ preserve local file preview URL if backend does not return one
      url: res.data.url || newEvidence.url,
    };

    setDocuments((prev) => [savedEvidence, ...prev]);
  } catch (error) {
    console.error("Failed to create evidence:", error);
  }
};

  /* =========================
     FILTERING
  ========================= */
  const filteredData = useMemo(() => {
    return documents.filter((e) => {
      if (activeCategory && e.subCategory !== activeCategory) {
        return false;
      }

      if (activeTab === "Pending" && e.status !== "Pending") {
        return false;
      }

      if (activeTab === "Complete" && e.status !== "Verified") {
        return false;
      }

      if (activeTab === "Red Flagged" && e.status !== "Missing") {
        return false;
      }

      if (search && !e.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [documents, activeCategory, activeTab, search]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize,
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
      <Sidebar
        sections={sections}
        evidenceData={documents}
        onSelectItem={setActiveCategory}
      />

      <div
        style={{
          flex: 1,
          padding: theme.spacing.lg,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.md,
        }}
      >
        <EvidenceHeader onAdd={() => setUploadOpen(true)} />

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

      <EvidenceUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={handleAddEvidence}
        sections={sections}
      />
    </div>
  );
}
