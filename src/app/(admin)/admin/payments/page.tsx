"use client";

import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";
import { Shield } from "lucide-react";
import { usePermissions } from "@/security/access-control";
import { TransactionsPagination } from "@/components/mse/transactions/TransactionsPagination";
import PaymentsTable from "@/components/admin/payments/PaymentsTable";
import PaymentTotals from "@/components/admin/payments/PaymentTotals";
import PaymentFilters, { EMPTY_FILTERS, PaymentFilterForm, toApiFilters } from "@/components/admin/payments/PaymentFilters";
import { viewerTimeZone } from "@/components/admin/payments/paymentFormat";
import { theme } from "@/styles/theme";
import {
  getAdminPayments,
  getAdminPaymentTotals,
  AdminPaymentResponse,
  PageResult,
  PaymentLedgerTotal,
} from "@/api/admin";

export const dynamic = "force-dynamic";

export default function PaymentsPage() {
  const { canViewAdminPanel } = usePermissions();

  const [result, setResult] = useState<PageResult<AdminPaymentResponse> | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PaymentFilterForm>(EMPTY_FILTERS);
  const [totals, setTotals] = useState<PaymentLedgerTotal[] | null>(null);
  const [timeZone, setTimeZone] = useState("your local time");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAdminPayments({ ...toApiFilters(filters), page });
      setResult(data);
    } catch (err) {
      setError(
        isAxiosError(err) ? (err.response?.data?.message ?? "Failed to load payments.") : "Failed to load payments."
      );
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Totals depend on the filters, not the page.
  useEffect(() => {
    let cancelled = false;
    getAdminPaymentTotals(toApiFilters(filters))
      .then(({ data }) => {
        if (!cancelled) setTotals(data);
      })
      .catch(() => {
        // Never show zero totals that merely failed to load.
        if (!cancelled) setTotals(null);
      });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  // Read in the browser only, so the server render and the first client render agree.
  useEffect(() => {
    setTimeZone(viewerTimeZone());
  }, []);

  if (!canViewAdminPanel) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Shield size={40} color="#94a3b8" strokeWidth={1.5} style={{ marginBottom: 12 }} />
          <p style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", margin: 0 }}>Access Restricted</p>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>Only the Super Admin can view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Payments</h1>
          <p style={styles.subtitle}>
            Every payment on the platform, newest first — {result?.totalItems ?? 0} matching. Times are in{" "}
            {timeZone}.
          </p>
        </div>
      </div>

      <PaymentFilters
        value={filters}
        onApply={(next) => {
          setPage(1);
          setFilters(next);
        }}
      />

      {totals && <PaymentTotals totals={totals} />}

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.emptyState}>Loading payments…</p>
      ) : (
        <>
          <PaymentsTable payments={result?.items ?? []} />
          {result && result.totalPages > 1 && (
            <TransactionsPagination page={page} setPage={setPage} totalPages={result.totalPages} />
          )}
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#6b7280" },
  errorBanner: { marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13.5 },
  emptyState: { textAlign: "center", padding: "40px 16px", color: "#94a3b8", fontSize: 14 },
};
