"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { usePermissions } from "@/security/access-control";
import { theme } from "@/styles/theme";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import ChangeTierModal from "@/components/admin/ChangeTierModal";
import {
  getAdminOrganisationDetail,
  AdminOrganisationDetailResponse,
} from "@/api/admin";

export const dynamic = "force-dynamic";

const SUBSCRIPTION_BADGE: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: "#dcfce7", color: "#15803d" },
  TRIAL: { bg: "#e0f2fe", color: "#0369a1" },
  PENDING: { bg: "#fef9c3", color: "#a16207" },
  EXPIRED: { bg: "#fef9c3", color: "#a16207" },
  CANCELLED: { bg: "#fee2e2", color: "#b91c1c" },
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrganisationDetailPage() {
  const { canViewAdminPanel } = usePermissions();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const organisationId = params.id;

  const [detail, setDetail] = useState<AdminOrganisationDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tierModalOpen, setTierModalOpen] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAdminOrganisationDetail(organisationId);
      setDetail(data);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to load organisation.");
      } else {
        setError("Failed to load organisation.");
      }
    } finally {
      setLoading(false);
    }
  }, [organisationId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

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

  const currentSubscription = detail?.subscriptionHistory.find((s) => s.status === "ACTIVE") ?? null;

  return (
    <div style={styles.page}>
      <button onClick={() => router.push("/admin/organizations")} style={styles.backLink}>
        <ArrowLeft size={14} /> Back to Organisations
      </button>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.emptyState}>Loading organisation…</p>
      ) : !detail ? (
        <p style={styles.emptyState}>Organisation not found.</p>
      ) : (
        <>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>{detail.name}</h1>
              <p style={styles.subtitle}>{detail.industry} · {detail.countryCode} · {detail.defaultCurrency} · Created {formatDate(detail.createdAt)}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {currentSubscription && (
                <span style={{ ...styles.statusBadge, ...SUBSCRIPTION_BADGE[currentSubscription.status] }}>
                  {currentSubscription.subscriptionType} · {currentSubscription.status}
                </span>
              )}
              <button onClick={() => setTierModalOpen(true)} style={styles.primaryBtn}>Change Tier</button>
              <button onClick={fetchDetail} style={styles.iconBtn} title="Refresh"><RefreshCw size={15} /></button>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Members ({detail.members.length})</h2>
            {detail.members.length === 0 ? (
              <p style={styles.emptyInline}>No members yet.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.headRow}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.members.map((m) => (
                    <tr key={m.userId} style={styles.row}>
                      <td style={styles.td}>{m.fullName}</td>
                      <td style={styles.td}>{m.username}</td>
                      <td style={styles.td}>{m.role}</td>
                      <td style={styles.td}>{m.status}</td>
                      <td style={styles.td}>{formatDate(m.joinedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Subscription History</h2>
            {detail.subscriptionHistory.length === 0 ? (
              <p style={styles.emptyInline}>No subscriptions yet.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.headRow}>
                    <th style={styles.th}>Plan</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Start</th>
                    <th style={styles.th}>End</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.subscriptionHistory.map((s) => (
                    <tr key={s.id} style={styles.row}>
                      <td style={styles.td}>{s.subscriptionType}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadgeSm, ...SUBSCRIPTION_BADGE[s.status] }}>{s.status}</span>
                      </td>
                      <td style={styles.td}>{formatDate(s.startDate)}</td>
                      <td style={styles.td}>{formatDate(s.endDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Payments</h2>
            {detail.payments.length === 0 ? (
              <p style={styles.emptyInline}>No payments recorded yet.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.headRow}>
                    <th style={styles.th}>Plan</th>
                    <th style={styles.th}>Provider</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.payments.map((p) => (
                    <tr key={p.id} style={styles.row}>
                      <td style={styles.td}>{p.subscriptionType}</td>
                      <td style={styles.td}>{p.provider}</td>
                      <td style={styles.td}>{p.status}</td>
                      <td style={styles.td}>{p.currency} {p.receivedAmount ?? p.expectedAmount}</td>
                      <td style={styles.td}>{formatDate(p.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <ChangeTierModal
            open={tierModalOpen}
            organisationId={detail.id}
            organisationName={detail.name}
            currentType={currentSubscription?.subscriptionType ?? null}
            onClose={() => setTierModalOpen(false)}
            onChanged={() => fetchDetail()}
          />
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh", display: "flex", flexDirection: "column", gap: 20 },
  backLink: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#1e3a8a", fontWeight: 600, fontSize: 13.5, cursor: "pointer", padding: 0, alignSelf: "flex-start" },
  errorBanner: { padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13.5 },
  emptyState: { textAlign: "center", padding: "40px 16px", color: "#94a3b8", fontSize: 14 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 },
  title: { margin: 0, fontSize: 24, fontWeight: 800, color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: 13.5, color: "#6b7280" },
  statusBadge: { padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  statusBadgeSm: { padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600 },
  primaryBtn: { padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" },
  iconBtn: { padding: 9, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px" },
  cardTitle: { margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#0f172a" },
  emptyInline: { fontSize: 13, color: "#94a3b8", margin: 0 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  headRow: { background: "#f8fafc" },
  th: { padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" },
  row: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "10px 14px", color: "#1f2937" },
};
