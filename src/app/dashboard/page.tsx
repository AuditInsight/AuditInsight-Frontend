import DashboardStats from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import { dashboardLayoutStyles } from "./DashboardPage.styles";

export default function DashboardPage() {
  return (
    <div style={dashboardLayoutStyles.page}>
      
      {/* ⭐ PAGE TOOLBAR */}
      <PageToolbar
        title="Dashboard"
        filters={["Last 30 Days", "Fiscal Year"]}
      />

      {/* ⭐ STAT CARDS */}
      <DashboardStats />

      {/* ⭐ MAIN GRID → BIG TABLE + SMALL CHART */}
      <div style={dashboardLayoutStyles.mainGrid}>
        <HighRiskTransactions />
        <EvidenceChart />
      </div>

      
    </div>
  );
}