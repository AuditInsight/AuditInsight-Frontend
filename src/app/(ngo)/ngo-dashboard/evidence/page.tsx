"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/evidenceSidebar";
import { EvidenceHeader } from "@/components/mse/evidence/EvidenceHeader";
import { EvidenceFilters, EvidenceTab } from "@/components/mse/evidence/EvidenceFilters";
import { EvidenceTable } from "@/components/mse/evidence/EvidenceTable";
import { EvidencePagination } from "@/components/mse/evidence/EvidencePagination";
import { EvidenceUploadModal } from "@/components/mse/evidence/EvidenceUploadModal";
import { EvidenceDetailsModal } from "@/components/mse/evidence/EvidenceDetailsModal";
import { ConfirmDeleteEvidenceModal } from "@/components/mse/evidence/ConfirmDeleteEvidenceModal";
import NGODashboardShell from "@/components/ngo/dashboard/NGODashboardShell";
import { ProtectedRoute } from "@/components/Guards";
import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";
import { evidenceMatchesSearch } from "@/lib/evidenceSearch";
import { exportEvidenceCSV } from "@/utils/export";
import { NGO_EVIDENCE_CATEGORIES } from "@/types/ngo";
import { useRBAC } from "@/context/RBACContext";
import { useEvidence } from "@/hooks/useEvidence";

type EvidenceSection = { title: string; items: string[] };

const sections: EvidenceSection[] = (
  Object.entries(NGO_EVIDENCE_CATEGORIES) as [string, readonly string[]][]
).map(([title, items]) => ({ title, items: [...items] }));

function EvidenceContent() {
  const { can } = useRBAC();
  const canUpload = can("evidence:upload");
  const canEdit   = can("evidence:upload");
  const canDelete = can("evidence:upload");

  const { documents, loading, error, saveEvidence, deleteEvidence: apiDeleteEvidence } = useEvidence();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab]           = useState<EvidenceTab>("All");
  const [search, setSearch]                 = useState("");
  const [page, setPage]                     = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter]     = useState("All");
  const [yearFilter, setYearFilter]         = useState("All");
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  const [uploadOpen, setUploadOpen]             = useState(false);
  const [viewingEvidence, setViewingEvidence]   = useState<Evidence | null>(null);
  const [editingEvidence, setEditingEvidence]   = useState<Evidence | null>(null);
  const [evidenceToDelete, setEvidenceToDelete] = useState<Evidence | null>(null);
  const [isDeleting, setIsDeleting]             = useState(false);

  const pageSize = 25;

  const handleSave = (saved: Evidence) => {
    saveEvidence(saved);
  };

  const handleConfirmDelete = async () => {
    if (!evidenceToDelete) return;
    setIsDeleting(true);
    try {
      await apiDeleteEvidence(evidenceToDelete.id);
      if (viewingEvidence?.id === evidenceToDelete.id) setViewingEvidence(null);
    } finally {
      setEvidenceToDelete(null);
      setIsDeleting(false);
    }
  };

  const filteredData = useMemo(() => {
    return documents.filter((e) => {
      if (categoryFilter !== "All" && e.folder !== categoryFilter) return false;
      if (statusFilter !== "All" && e.status !== statusFilter) return false;
      if (yearFilter !== "All") {
        const year = e.uploadedAt ? e.uploadedAt.slice(0, 4) : "";
        if (year !== yearFilter) return false;
      }
      // Only show items that belong to the selected subfolder.
      if (activeCategory && e.subfolder !== activeCategory) return false;
      if (activeTab === "Pending"  && e.status !== "Pending")  return false;
      if (activeTab === "Complete" && e.status !== "Verified") return false;
      if (search && !evidenceMatchesSearch(e, search)) return false;
      return true;
    });
  }, [documents, activeCategory, activeTab, search, categoryFilter, statusFilter, yearFilter]);

  const categoryOptions = useMemo(() => {
    const values = Array.from(new Set(documents.map((d) => d.folder).filter(Boolean))) as string[];
    values.sort((a, b) => a.localeCompare(b));
    return ["All", ...values];
  }, [documents]);

  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(documents.map((d) => (d.uploadedAt ? d.uploadedAt.slice(0, 4) : "")).filter((y) => /^\d{4}$/.test(y)))
    );
    years.sort((a, b) => b.localeCompare(a));
    return ["All", ...years];
  }, [documents]);

  const totalPages    = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={s.page}>
      <style>{`
        .ev-layout { display: flex; min-height: 100vh; }
        .ev-sidebar { flex-shrink: 0; width: 280px; }
        .ev-main { flex: 1; min-width: 0; padding: ${theme.spacing.lg}; display: flex; flex-direction: column; gap: ${theme.spacing.md}; }
        .ev-sidebar-toggle { display: none; }
        @media (max-width: 960px) {
          .ev-sidebar { display: none; }
          .ev-sidebar.open { display: block; position: fixed; top: 0; left: 0; height: 100%; z-index: 300; overflow-y: auto; box-shadow: 4px 0 24px rgba(0,0,0,0.12); }
          .ev-sidebar-toggle { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; font-size: 13px; font-weight: 600; color: #374151; }
          .ev-main { padding: 16px; }
        }
        @media (max-width: 600px) { .ev-main { padding: 12px; } }
      `}</style>

      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(30,58,138,0.06)", border: "1px solid rgba(30,58,138,0.2)", borderRadius: 10, color: "#1e3a8a", fontSize: 13.5, margin: "16px" }}>
          {error}
        </div>
      )}

      <div className="ev-layout">
        <div className={`ev-sidebar${sidebarOpen ? " open" : ""}`}>
          <Sidebar
            sections={sections}
            evidenceData={documents}
            onSelectItem={(v) => { setActiveCategory(v); setPage(1); setSidebarOpen(false); }}
          />
        </div>

        <div className="ev-main">
          <button className="ev-sidebar-toggle" onClick={() => setSidebarOpen((o) => !o)}>
            ☰ Document Library {sidebarOpen ? "▲" : "▼"}
          </button>

          <EvidenceHeader
            onAdd={canUpload ? () => setUploadOpen(true) : undefined}
            onExport={() => exportEvidenceCSV(filteredData)}
          />

          {loading ? (
            <div style={{ padding: "48px 16px", textAlign: "center", color: "#94a3b8", fontSize: 13.5 }}>
              Loading evidence…
            </div>
          ) : (
            <>
              <EvidenceFilters
                activeTab={activeTab}
                setActiveTab={(tab) => { setActiveTab(tab); setPage(1); }}
                search={search}
                setSearch={(v) => { setSearch(v); setPage(1); }}
                categoryFilter={categoryFilter}
                setCategoryFilter={(v) => { setCategoryFilter(v); setPage(1); }}
                statusFilter={statusFilter}
                setStatusFilter={(v) => { setStatusFilter(v); setPage(1); }}
                yearFilter={yearFilter}
                setYearFilter={(v) => { setYearFilter(v); setPage(1); }}
                categoryOptions={categoryOptions}
                yearOptions={yearOptions}
                total={filteredData.length}
                setPage={setPage}
              />

              <EvidenceTable
                data={paginatedData}
                onView={setViewingEvidence}
                onEdit={canEdit ? setEditingEvidence : undefined}
                onDelete={canDelete ? setEvidenceToDelete : undefined}
              />

              <EvidencePagination page={page} setPage={setPage} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 299 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {canUpload && (
        <EvidenceUploadModal
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onSave={(saved) => { handleSave(saved); setUploadOpen(false); setPage(1); }}
          sections={sections}
          mode="add"
        />
      )}
      {canEdit && (
        <EvidenceUploadModal
          isOpen={!!editingEvidence}
          onClose={() => setEditingEvidence(null)}
          onSave={(saved) => { handleSave(saved); setEditingEvidence(null); }}
          sections={sections}
          mode="edit"
          evidence={editingEvidence}
        />
      )}
      <EvidenceDetailsModal
        isOpen={!!viewingEvidence}
        evidence={viewingEvidence}
        onClose={() => setViewingEvidence(null)}
      />
      {canDelete && (
        <ConfirmDeleteEvidenceModal
          isOpen={!!evidenceToDelete}
          evidence={evidenceToDelete}
          onClose={() => setEvidenceToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default function NGOEvidencePage() {
  return (
    <ProtectedRoute>
      <NGODashboardShell>
        <EvidenceContent />
      </NGODashboardShell>
    </ProtectedRoute>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { background: theme.colors.appBackground, minHeight: "100vh", fontFamily: theme.typography.fontFamily },
};
