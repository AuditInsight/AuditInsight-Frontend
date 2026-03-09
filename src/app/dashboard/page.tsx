import DashboardStats from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";

import { dashboardPageStyles } from "./DashboardPage.styles";

export default function DashboardPage() {

  return (
    <div style={dashboardPageStyles.page}>

      <h1 style={dashboardPageStyles.tittle}>
        Dashboard
      </h1>

      <DashboardStats />

      <div style={dashboardPageStyles.mainGrid}>

        <HighRiskTransactions />
        <EvidenceChart />

        <HighRiskTransactions />
        <ComplianceAlerts />

      </div>

    </div>
  );

}