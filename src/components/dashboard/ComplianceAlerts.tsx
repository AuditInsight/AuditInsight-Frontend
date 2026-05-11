import { Card } from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";

// =========================
// TYPES
// =========================
type Transaction = {
  id: number;
  counterparty: string;
  riskScore: number;
};

type AlertItem = {
  id: string;
  message: string;
  severity: "warning" | "critical" | "info";
};

type Props = {
  transactions: Transaction[];
};

// =========================
// COMPONENT
// =========================
export default function ComplianceAlerts({ transactions }: Props) {
  // 🚨 REAL ALERT GENERATION
  const alerts: AlertItem[] = transactions
    .filter((t) => t.riskScore >= 85)
    .slice(0, 5)
    .map((t) => ({
      id: String(t.id),
      message: `High risk transaction ${t.id} (${t.counterparty})`,
      severity: t.riskScore >= 90 ? "critical" : "warning",
    }));

  return (
    <Card>
      <h3>Compliance Alerts</h3>

      {alerts.length === 0 && <div>No alerts 🎉</div>}

      {alerts.map((alert) => (
        <div key={alert.id} style={{ marginBottom: 10 }}>
          <Badge label={alert.severity} />
          <span style={{ marginLeft: 8 }}>{alert.message}</span>
        </div>
      ))}
    </Card>
  );
}