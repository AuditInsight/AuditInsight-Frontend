"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import ReviewStats from "@/components/review-queue/ReviewStats";
import ReviewFilters from "@/components/review-queue/ReviewFilters";
import ReviewSidebar from "@/components/review-queue/ReviewSidebar";
import ReviewTable from "@/components/review-queue/ReviewTable";
import ReviewPagination from "@/components/review-queue/ReviewPagination";

import { theme } from "@/styles/theme";
import { getReviewQueue, type ReviewQueueResponse, type IssueType } from "@/utils/api";
import type { ReviewItem } from "@/lib/reviewEngine";

/* =========================
   MAP API → ReviewItem
========================= */
const issueTypeLabel: Record<IssueType, ReviewItem["type"]> = {
  MISSING_EVIDENCE: "Missing Evidence",
  COMPLIANCE_ISSUE: "Compliance Issues",
  RISK_FLAG: "AI / Risk Flags",
  VERIFICATION_PROBLEM: "Verification Problems",
};

const issueRisk: Record<IssueType, ReviewItem["risk"]> = {
  MISSING_EVIDENCE: "Critical",
  COMPLIANCE_ISSUE: "Critical",
  RISK_FLAG: "Critical",
  VERIFICATION_PROBLEM: "Medium",
};

const statusLabel: Record<string, ReviewItem["status"]> = {
  OPEN: "Open",
  RESOLVED: "Resolved",
  ESCALATED: "Escalated",
};

function toReviewItem(item: ReviewQueueResponse): ReviewItem {
  const risk = issueRisk[item.issueType] ?? "Medium";
  return {
    id: item.id,
    type: issueTypeLabel[item.issueType] ?? "System Errors",
    transactionId: item.transactionId,
    amount: "—",
    risk,
    severity: risk,
    due: item.createdAt ? item.createdAt.split("T")[0] : "—",
    status: statusLabel[item.status] ?? "Open",
  };
}

export default function ReviewQueuePage() {
  const router = useRouter();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeIssue, setActiveIssue] = useState("All");
  const [severity, setSeverity] = useState("All");

  useEffect(() => {
    const orgId = localStorage.getItem("organisationId") ?? "";
    getReviewQueue(orgId)
      .then(({ data }) => setReviews((data ?? []).map(toReviewItem)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesIssue = activeIssue === "All" || r.type === activeIssue;
      const matchesSeverity = severity === "All" || r.severity === severity;
      return matchesIssue && matchesSeverity;
    });
  }, [reviews, activeIssue, severity]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [page, filteredReviews]);

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading review queue…</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <PageToolbar
        title="Review Queue"
        filters={["All Issues", "My Issues"]}
        primaryActionLabel="Export"
      />

      <ReviewStats data={reviews} />

      <ReviewFilters severity={severity} setSeverity={setSeverity} />

      <div style={styles.layout}>
        <ReviewSidebar data={reviews} active={activeIssue} setActive={setActiveIssue} />
        <ReviewTable
          data={paginated}
          onRowClick={(row) =>
            router.push(`/transactions?transactionId=${row.transactionId}`)
          }
        />
      </div>

      <ReviewPagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: theme.spacing.lg,
    background: theme.colors.appBackground,
    minHeight: "100vh",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
    alignItems: "start",
  },
};
