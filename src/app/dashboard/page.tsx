"use client";

import DashboardStats from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import QuickActions from "@/components/dashboard/QuickActions";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import { dashboardLayoutStyles } from "./DashboardPage.styles";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const { transactions, evidence, loading } = useDashboardData();

  if (loading) {
    return (
      <div style={{ ...dashboardLayoutStyles.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>⏳</div>
          <p style={{ margin: 0, fontSize: 14 }}>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={dashboardLayoutStyles.page}>
      <PageToolbar title="Dashboard" filters={["Last 30 Days", "Fiscal Year"]} />

      <DashboardStats transactions={transactions} evidence={evidence} />

      <div style={dashboardLayoutStyles.mainGrid}>
        <HighRiskTransactions transactions={transactions} />
        <EvidenceChart transactions={transactions} evidence={evidence} />
      </div>

      <div style={dashboardLayoutStyles.secondaryGrid}>
        <ComplianceAlerts transactions={transactions} />
        <QuickActions />
      </div>
    </div>
  );
}
