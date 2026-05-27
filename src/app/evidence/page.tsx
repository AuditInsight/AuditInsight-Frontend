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
import { EvidenceDetailsModal } from "@/components/evidence/EvidenceDetailsModal";
import { ConfirmDeleteEvidenceModal } from "@/components/evidence/ConfirmDeleteEvidenceModal";
import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";
import { evidenceMatchesSearch } from "@/lib/evidenceSearch";
import { deleteEvidence, getEvidence } from "@/utils/api";

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
    items: ["Emails", "Documentation", "Screenshots", "Supporting schedules"],
  },
];

export default function EvidencePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EvidenceTab>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [yearFilter, setYearFilter] = useState<string>("All");

  const [documents, setDocuments] = useState<Evidence[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewingEvidence, setViewingEvidence] = useState<Evidence | null>(
    null
  );
  const [editingEvidence, setEditingEvidence] = useState<Evidence | null>(
    null
  );
  const [evidenceToDelete, setEvidenceToDelete] = useState<Evidence | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const pageSize = 25;

  /* =========================
     LOAD FROM BACKEND
  ========================= */
  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await getEvidence();

        setDocuments(res.data || []);

        // 🔥 FIX: reset filters so nothing "disappears" after refresh
        setActiveCategory(null);
        setActiveTab("All");
        setCategoryFilter("All");
        setStatusFilter("All");
        setYearFilter("All");
        setPage(1);
      } catch (error) {
        console.error("Failed to load evidence:", error);
      }
    };

    fetchEvidence();
  }, []);

  /* =========================
     SAVE TO BACKEND (UI UPDATE ONLY)
  ========================= */
  const handleSaveEvidence = (savedEvidence: Evidence) => {
    setDocuments((prev) => {
      const index = prev.findIndex((e) => e.id === savedEvidence.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = savedEvidence;
        return next;
      }
      return [savedEvidence, ...prev];
    });

    setUploadOpen(false);
    setEditingEvidence(null);
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!evidenceToDelete) return;

    setIsDeleting(true);
    try {
      await deleteEvidence(evidenceToDelete.id);
      setDocuments((prev) =>
        prev.filter((e) => e.id !== evidenceToDelete.id)
      );
      if (viewingEvidence?.id === evidenceToDelete.id) {
        setViewingEvidence(null);
      }
      setEvidenceToDelete(null);
    } catch (error) {
      console.error("Failed to delete evidence:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /* =========================
     FILTERING
  ========================= */
  const filteredData = useMemo(() => {
    return documents.filter((e) => {
      if (categoryFilter !== "All" && e.category !== categoryFilter) {
        return false;
      }

      if (statusFilter !== "All" && e.status !== statusFilter) {
        return false;
      }

      if (yearFilter !== "All") {
        const year = e.date ? String(e.date).slice(0, 4) : "";
        if (year !== yearFilter) return false;
      }

      if (
        activeCategory &&
        e.subCategory &&
        e.subCategory !== activeCategory
      ) {
        return false;
      }

      if (activeCategory && !e.subCategory) {
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

      if (search && !evidenceMatchesSearch(e, search)) {
        return false;
      }

      return true;
    });
  }, [
    documents,
    activeCategory,
    activeTab,
    search,
    categoryFilter,
    statusFilter,
    yearFilter,
  ]);

  const categoryOptions = useMemo(() => {
    const values = Array.from(
      new Set(documents.map((d) => d.category).filter(Boolean))
    ) as string[];
    values.sort((a, b) => a.localeCompare(b));
    return ["All", ...values];
  }, [documents]);

  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(
        documents
          .map((d) => (d.date ? String(d.date).slice(0, 4) : ""))
          .filter((y) => /^\d{4}$/.test(y))
      )
    );
    years.sort((a, b) => b.localeCompare(a)); // newest first
    return ["All", ...years];
  }, [documents]);

  /* =========================
     PAGINATION
  ========================= */
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
      <Sidebar
        sections={sections}
        evidenceData={documents}
        onSelectItem={(value) => {
          setActiveCategory(value);
          setPage(1); // 🔥 FIX: reset pagination on filter
        }}
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
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setPage(1); // 🔥 FIX
          }}
          search={search}
          setSearch={(value) => {
            setSearch(value);
            setPage(1); // 🔥 FIX
          }}
          categoryFilter={categoryFilter}
          setCategoryFilter={(value) => {
            setCategoryFilter(value);
            setPage(1);
          }}
          statusFilter={statusFilter}
          setStatusFilter={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          yearFilter={yearFilter}
          setYearFilter={(value) => {
            setYearFilter(value);
            setPage(1);
          }}
          categoryOptions={categoryOptions}
          yearOptions={yearOptions}
          total={filteredData.length}
          setPage={setPage}
        />

        <EvidenceTable
          data={paginatedData}
          onView={setViewingEvidence}
          onEdit={setEditingEvidence}
          onDelete={setEvidenceToDelete}
        />

        <EvidencePagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>

      <EvidenceUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={handleSaveEvidence}
        sections={sections}
        mode="add"
      />

      <EvidenceUploadModal
        isOpen={!!editingEvidence}
        onClose={() => setEditingEvidence(null)}
        onSave={handleSaveEvidence}
        sections={sections}
        mode="edit"
        evidence={editingEvidence}
      />

      <EvidenceDetailsModal
        isOpen={!!viewingEvidence}
        evidence={viewingEvidence}
        onClose={() => setViewingEvidence(null)}
      />

      <ConfirmDeleteEvidenceModal
        isOpen={!!evidenceToDelete}
        evidence={evidenceToDelete}
        onClose={() => setEvidenceToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}