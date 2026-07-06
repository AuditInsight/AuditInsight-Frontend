"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import ReviewStats from "@/components/review-queue/ReviewStats";
import ReviewFilters from "@/components/review-queue/ReviewFilters";
import ReviewTable from "@/components/review-queue/ReviewTable";
import ReviewPagination from "@/components/review-queue/ReviewPagination";
import FlagIssueModal from "@/components/review-queue/FlagIssueModal";
import ResolveIssueModal from "@/components/review-queue/ResolveIssueModal";

import { theme } from "@/styles/theme";
import { useReviewQueue } from "@/hooks/useReviewQueue";
import { useTransactions } from "@/hooks/useTransactions";
import { usePermissions } from "@/security/access-control";
import { useAuth } from "@/context/AuthContext.production";
import { appendAuditLog } from "@/security/audit-logger";
import { ReviewItem } from "@/lib/reviewEngine";
import { exportReviewQueueCSV } from "@/utils/export";

export default function ReviewQueuePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, loading, flagIssue, resolveIssue } = useReviewQueue();
  const { transactions, evidences } = useTransactions();
  const { canFlagIssue, canResolveIssue } = usePermissions();

  const [page, setPage]                   = useState(1);
  const [activeIssue, setActiveIssue]     = useState("All");
  const [severity, setSeverity]           = useState("All");
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [resolveTarget, setResolveTarget] = useState<{ id: string; transactionId: string } | null>(null);

  const filteredReviews = useMemo(() => {
    return items.filter((r) => {
      const matchesIssue    = activeIssue === "All" || r.type === activeIssue;
      const matchesSeverity = severity === "All"    || r.severity === severity;
      return matchesIssue && matchesSeverity;
    });
  }, [items, activeIssue, severity]);

  const pageSize   = 10;
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const paginated  = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [page, filteredReviews]);

  const handleFlagSubmit = (flag: { transactionId: string; type: string; severity: string; notes: string }) => {
    flagIssue({
      type: flag.type as ReviewItem["type"],
      transactionId: flag.transactionId,
      amount: "—",
      risk: flag.severity as "Critical" | "Medium" | "Low",
      severity: flag.severity as "Critical" | "Medium" | "Low",
      due: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Open",
      description: flag.notes,
      flaggedBy: user?.fullName ?? "Auditor",
    });
    appendAuditLog({
      userId: user?.id ?? 0, userEmail: user?.email ?? "",
      userRole: user?.role ?? "AUDITOR", action: "FLAG_CREATED",
      targetResourceId: flag.transactionId,
      detail: `Flagged: ${flag.type} — ${flag.severity}${flag.notes ? ` — ${flag.notes}` : ""}`,
    });
    setFlagModalOpen(false);
  };

  const handleResolve = (id: string) => {
    const item = items.find((i) => i.id === id);
    setResolveTarget({ id, transactionId: String(item?.transactionId ?? id) });
  };

  const handleResolveSubmit = (id: string, note: string, fileName?: string) => {
    const item = items.find((i) => i.id === id);
    resolveIssue(id, note);
    appendAuditLog({
      userId: user?.id ?? 0, userEmail: user?.email ?? "",
      userRole: user?.role ?? "MEMBER", action: "FLAG_RESOLVED",
      targetResourceId: id,
      detail: `Resolved flag for ${item?.transactionId ?? id}${fileName ? ` — attachment: ${fileName}` : ""}. Note: ${note}`,
    });
    setResolveTarget(null);
  };

  const handleExport = () => exportReviewQueueCSV(filteredReviews);

  if (loading) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading review queue…</p>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`
        .rq-stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; margin-bottom: 16px; }
        .rq-filters { display: flex; align-items: center; gap: 10; flex-wrap: wrap; margin-top: 12px; margin-bottom: 16px; }
        .rq-issue-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        .rq-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        @media (max-width: 1024px) { .rq-stats { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 600px)  { .rq-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 400px)  { .rq-stats { grid-template-columns: 1fr; } }
      `}</style>

      <PageToolbar
        title="Review Queue"
        onExport={handleExport}
        primaryActionLabel={canFlagIssue ? "Flag Issue" : undefined}
        onAdd={canFlagIssue ? () => setFlagModalOpen(true) : undefined}
      />

      <ReviewStats transactions={transactions} evidence={evidences} />

      <div style={s.filtersRow}>
        <div style={s.issueTabs}>
          {["All", "Missing Evidence", "Verification Problems", "Compliance Issues", "Control Violations", "AI / Risk Flags", "System Errors"].map((label) => (
            <button
              key={label}
              onClick={() => setActiveIssue(label)}
              style={{ ...s.issueTab, ...(activeIssue === label ? s.issueTabActive : {}) }}
            >
              {label}
            </button>
          ))}
        </div>
        <ReviewFilters severity={severity} setSeverity={setSeverity} />
      </div>

      <div className="rq-table-wrap">
        <ReviewTable
          data={paginated}
          onRowClick={(row) => router.push(`/transactions?transactionId=${row.transactionId}`)}
          onResolve={canResolveIssue ? handleResolve : undefined}
        />
      </div>

      <ReviewPagination page={page} setPage={setPage} totalPages={totalPages} />

      <FlagIssueModal
        open={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        onSubmit={handleFlagSubmit}
      />
      <ResolveIssueModal
        open={!!resolveTarget}
        issueId={resolveTarget?.id ?? ""}
        transactionId={resolveTarget?.transactionId ?? ""}
        onClose={() => setResolveTarget(null)}
        onSubmit={handleResolveSubmit}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:          { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh" },
  filtersRow:    { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, margin: "12px 0 16px" },
  issueTabs:     { display: "flex", gap: 6, flexWrap: "wrap" },
  issueTab:      { padding: "7px 14px", borderRadius: 20, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer", whiteSpace: "nowrap" as const },
  issueTabActive:{ background: "#1e3a8a", color: "#fff", border: "1px solid #1e3a8a", fontWeight: 600 },
};
