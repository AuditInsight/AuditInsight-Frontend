import DashboardStats from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import { dashboardLayoutStyles } from "@/app/dashboard/DashboardPage.styles";


export default function DashboardPage() {

  return (

    <div style={dashboardLayoutStyles.page}>

      <PageToolbar
   title="Dashboard"
   filters={["Last 30 Days", "Fiscal Year"]}
/>

      <DashboardStats />

      <div style={dashboardLayoutStyles.mainGrid}>

        <HighRiskTransactions />

        <EvidenceChart />

      </div>

      <div style={dashboardLayoutStyles.secondaryGrid}>

        <HighRiskTransactions />

        <ComplianceAlerts />

      </div>

    </div>

  )

}