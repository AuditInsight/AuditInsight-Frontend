import DashboardStats   from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardStats />
      <EvidenceChart />
      <HighRiskTransactions />
      <ComplianceAlerts />
    </div>
  );
}