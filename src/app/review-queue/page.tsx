"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import ReviewStats from "@/components/review-queue/ReviewStats";
import ReviewFilters from "@/components/review-queue/ReviewFilters";
import ReviewSidebar from "@/components/review-queue/ReviewSidebar";
import ReviewTable from "@/components/review-queue/ReviewTable";
import ReviewPagination from "@/components/review-queue/ReviewPagination";

import { theme } from "@/styles/theme";
import { transactionsData } from "@/data/transactions.data";
import { evidenceData } from "@/data/evidence.data";
import { buildReviewQueue } from "@/lib/reviewEngine";

export default function ReviewQueuePage() {
  const router = useRouter();

  /* =========================
     STATE
  ========================= */
  const [page, setPage] = useState<number>(1);

  const [activeIssue, setActiveIssue] = useState<string>("All");

  // ✅ FIX: severity state added
  const [severity, setSeverity] = useState<string>("All");

  /* =========================
     BUILD DATA
  ========================= */
  const reviews = useMemo(() => {
    return buildReviewQueue(transactionsData, evidenceData);
  }, []);

  /* =========================
     FILTER LOGIC
  ========================= */
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesIssue =
        activeIssue === "All" || r.type === activeIssue;

      const matchesSeverity =
        severity === "All" || r.severity === severity;

      return matchesIssue && matchesSeverity;
    });
  }, [reviews, activeIssue, severity]);

  /* =========================
     PAGINATION
  ========================= */
  const pageSize = 10;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / pageSize)
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredReviews.slice(start, start + pageSize);
  }, [page, filteredReviews]);

  /* =========================
     UI
  ========================= */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <PageToolbar
        title="Review Queue"
        filters={["All Issues", "My Issues"]}
        primaryActionLabel="Export"
      />

      {/* STATS */}
      <ReviewStats data={reviews} />

      {/* FILTERS (FIXED) */}
      <ReviewFilters
        severity={severity}
        setSeverity={setSeverity}
      />

      {/* MAIN LAYOUT */}
      <div style={styles.layout}>
        <ReviewSidebar
          data={reviews}
          active={activeIssue}
          setActive={setActiveIssue}
        />

        <ReviewTable
          data={paginated}
          onRowClick={(row) =>
            router.push(
              `/transactions?transactionId=${row.transactionId}`
            )
          }
        />
      </div>

      {/* PAGINATION */}
      <ReviewPagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
}

/* =========================
   STYLES
========================= */
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