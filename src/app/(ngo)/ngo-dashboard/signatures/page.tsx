"use client";

import { useState, useMemo } from "react";
import { FileSignature, Upload } from "lucide-react";
import NGODashboardShell from "@/components/ngo/dashboard/NGODashboardShell";
import { ProtectedRoute } from "@/components/Guards";
import { EvidenceUploadModal } from "@/components/mse/evidence/EvidenceUploadModal";
import { SignDocumentModal } from "@/components/signature/SignDocumentModal";
import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";
import { useEvidence } from "@/hooks/useEvidence";
import { useTransactions } from "@/hooks/useTransactions";

function SignatureContent() {
  const { transactions } = useTransactions();
  const { documents, loading, saveEvidence } = useEvidence();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [signing, setSigning]       = useState<Evidence | null>(null);

  const sorted = useMemo(
    () => [...documents].sort((a, b) => (b.uploadedAt ?? "").localeCompare(a.uploadedAt ?? "")),
    [documents]
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Signatures</h1>
          <p style={s.sub}>Sign an uploaded document, or upload a new one and sign it right away.</p>
        </div>
        <button style={s.uploadBtn} onClick={() => setUploadOpen(true)}>
          <Upload size={14} /> Upload &amp; Sign
        </button>
      </div>

      <div style={s.card}>
        {loading ? (
          <div style={s.empty}>Loading documents…</div>
        ) : sorted.length === 0 ? (
          <div style={s.empty}>No evidence documents yet. Upload one to get started.</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Document</th>
                <th style={s.th}>Folder</th>
                <th style={s.th}>Uploaded</th>
                <th style={{ ...s.th, textAlign: "right" as const }}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => (
                <tr key={e.id} style={s.tr}>
                  <td style={s.td}>{e.documentName}</td>
                  <td style={s.tdMuted}>{e.folder} / {e.subfolder}</td>
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

      <EvidenceUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={(saved) => { saveEvidence(saved); setUploadOpen(false); }}
        transactions={transactions}
        mode="add"
        defaultSignNow
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
  card: { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" },
  empty: { padding: "48px 16px", textAlign: "center" as const, color: "#94a3b8", fontSize: 13.5 },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "12px 18px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "13px 18px", fontSize: 13.5, color: "#0f172a", fontWeight: 600 },
  tdMuted: { padding: "13px 18px", fontSize: 13, color: "#64748b" },
  signLink: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#1e3a8a", cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: "inherit" },
};
