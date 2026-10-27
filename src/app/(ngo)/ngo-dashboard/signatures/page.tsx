"use client";

import { useState, useMemo } from "react";
import { FileSignature, Upload, Search, Link2, FileX2 } from "lucide-react";
import NGODashboardShell from "@/components/ngo/dashboard/NGODashboardShell";
import { ProtectedRoute } from "@/components/Guards";
import { UploadDocumentModal } from "@/components/signature/UploadDocumentModal";
import { SignDocumentModal } from "@/components/signature/SignDocumentModal";
import { EvidencePagination } from "@/components/mse/evidence/EvidencePagination";
import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";
import { useEvidence } from "@/hooks/useEvidence";

type LinkFilter = "all" | "linked" | "standalone";

const PAGE_SIZE = 10;

function SignatureContent() {
  const { documents, loading, saveEvidence } = useEvidence();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [signing, setSigning]       = useState<Evidence | null>(null);
  const [search, setSearch]         = useState("");
  const [folderFilter, setFolderFilter] = useState("All");
  const [linkFilter, setLinkFilter] = useState<LinkFilter>("all");
  const [page, setPage]             = useState(1);

  const folderOptions = useMemo(() => {
    const values = Array.from(new Set(documents.map((d) => d.folder).filter(Boolean))) as string[];
    values.sort((a, b) => a.localeCompare(b));
    return ["All", ...values];
  }, [documents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return documents
      .filter((e) => {
        if (folderFilter !== "All" && e.folder !== folderFilter) return false;
        if (linkFilter === "linked" && !e.transactionId) return false;
        if (linkFilter === "standalone" && e.transactionId) return false;
        if (q && !e.documentName.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => (b.uploadedAt ?? "").localeCompare(a.uploadedAt ?? ""));
  }, [documents, search, folderFilter, linkFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Signatures</h1>
          <p style={s.sub}>Sign an uploaded document, or upload a new one — linked to a transaction or not — and sign it right away.</p>
        </div>
        <button style={s.uploadBtn} onClick={() => setUploadOpen(true)}>
          <Upload size={14} /> Upload &amp; Sign
        </button>
      </div>

      <div style={s.filterBar}>
        <div style={s.searchBox}>
          <Search size={14} color="#94a3b8" />
          <input
            placeholder="Search by document name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={s.searchInput}
          />
        </div>
        <select value={linkFilter} onChange={(e) => { setLinkFilter(e.target.value as LinkFilter); setPage(1); }} style={s.select}>
          <option value="all">All documents</option>
          <option value="linked">Linked to a transaction</option>
          <option value="standalone">Standalone documents</option>
        </select>
        <select value={folderFilter} onChange={(e) => { setFolderFilter(e.target.value); setPage(1); }} style={s.select}>
          {folderOptions.map((f) => <option key={f} value={f}>{f === "All" ? "All folders" : f}</option>)}
        </select>
        <span style={s.resultCount}>{filtered.length} of {documents.length} documents</span>
      </div>

      <div style={s.card}>
        {loading ? (
          <div style={s.empty}>Loading documents…</div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>
            {documents.length === 0 ? "No documents yet. Upload one to get started." : "No documents match your search or filters."}
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Document</th>
                <th style={s.th}>Folder</th>
                <th style={s.th}>Linked</th>
                <th style={s.th}>Uploaded</th>
                <th style={{ ...s.th, textAlign: "right" as const }}></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((e) => (
                <tr key={e.id} style={s.tr}>
                  <td style={s.td}>{e.documentName}</td>
                  <td style={s.tdMuted}>{e.folder} / {e.subfolder}</td>
                  <td style={s.tdMuted}>
                    {e.transactionId ? (
                      <span style={s.linkedBadge}><Link2 size={11} /> Transaction</span>
                    ) : (
                      <span style={s.standaloneBadge}><FileX2 size={11} /> Standalone</span>
                    )}
                  </td>
                  <td style={s.tdMuted}>{e.uploadedAt ? new Date(e.uploadedAt).toLocaleDateString() : "—"}</td>
                  <td style={{ ...s.td, textAlign: "right" as const }}>
                    <button style={s.signLink} onClick={() => setSigning(e)}>
                      <FileSignature size={13} /> Sign / View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <div style={s.paginationBar}>
          <span style={s.paginationLabel}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} documents
          </span>
          <EvidencePagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      )}

      <UploadDocumentModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={(saved) => { saveEvidence(saved); setUploadOpen(false); setPage(1); }}
      />
      <SignDocumentModal isOpen={!!signing} onClose={() => setSigning(null)} evidence={signing} />
    </div>
  );
}

export default function NGOSignaturePage() {
  return (
    <ProtectedRoute>
      <NGODashboardShell>
        <SignatureContent />
      </NGODashboardShell>
    </ProtectedRoute>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { display: "flex", flexDirection: "column", gap: theme.spacing.md, fontFamily: theme.typography.fontFamily },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a" },
  sub: { margin: "4px 0 0", fontSize: 13.5, color: "#64748b" },
  uploadBtn: { display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", cursor: "pointer", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap" as const },
  filterBar: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const },
  searchBox: { display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, background: "#fff", border: "1px solid #e2e8f0", minWidth: 220, flex: "1 1 220px" },
  searchInput: { border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#0f172a", fontFamily: "inherit", width: "100%" },
  select: { padding: "9px 12px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13, color: "#374151", fontFamily: "inherit", cursor: "pointer" },
  resultCount: { fontSize: 12.5, color: "#94a3b8", marginLeft: "auto", whiteSpace: "nowrap" as const },
  card: { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" },
  paginationBar: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 12 },
  paginationLabel: { fontSize: 12.5, color: "#94a3b8", whiteSpace: "nowrap" as const },
  empty: { padding: "48px 16px", textAlign: "center" as const, color: "#94a3b8", fontSize: 13.5 },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "12px 18px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "13px 18px", fontSize: 13.5, color: "#0f172a", fontWeight: 600 },
  tdMuted: { padding: "13px 18px", fontSize: 13, color: "#64748b" },
  linkedBadge: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, color: "#1e3a8a", background: "rgba(30,58,138,0.08)", borderRadius: 999, padding: "3px 9px" },
  standaloneBadge: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, color: "#92400e", background: "rgba(217,119,6,0.1)", borderRadius: 999, padding: "3px 9px" },
  signLink: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#1e3a8a", cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: "inherit" },
};
