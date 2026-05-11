import DashboardStats from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import QuickActions from "@/components/dashboard/QuickActions";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import { dashboardLayoutStyles } from "./DashboardPage.styles";

export default function DashboardPage() {

  // ✅ FIXED: id must be number (matches Transaction type)
  const transactions = [
    { id: 1, riskScore: 92, counterparty: "ABC Ltd" },
    { id: 2, riskScore: 70, counterparty: "XYZ Ltd" },
    { id: 3, riskScore: 88, counterparty: "Global Co" },
  ];

  const evidence = [
    { id: 1 },
    { id: 2 },
  ];

  return (
    <div style={dashboardLayoutStyles.page}>
      
      {/* ⭐ PAGE TOOLBAR */}
      <PageToolbar
        title="Dashboard"
        filters={["Last 30 Days", "Fiscal Year"]}
      />

      {/* 🔥 1. INSIGHTS FIRST */}
      <DashboardStats
        transactions={transactions}
        evidence={evidence}
      />

      {/* 🔥 2. RISK VIEW (MOST IMPORTANT) */}
      <div style={dashboardLayoutStyles.mainGrid}>
        <HighRiskTransactions transactions={transactions} />
        <EvidenceChart
          transactions={transactions}
          evidence={evidence}
        />
      </div>

      {/* 🔥 3. ACTION LAYER */}
      <div style={dashboardLayoutStyles.secondaryGrid}>
        <ComplianceAlerts transactions={transactions} />
        <QuickActions />
      </div>

    </div>
  );
}