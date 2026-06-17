"use client";

import { Card } from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";

type Transaction = {
  id: string | number;
  counterparty?: string;
  name?: string;
  riskScore?: number;
  evidenceStatus?: string;
};

type AlertItem = {
  id: string;
  message: string;
  severity: "critical" | "warning";
};

type Props = {
  transactions: Transaction[];
};

export default function ComplianceAlerts({ transactions }: Props) {
  const alerts: AlertItem[] = transactions
    .filter(
      (t) =>
        t.evidenceStatus === "MISSING" ||
        t.evidenceStatus === "PARTIAL" ||
        (t.riskScore ?? 0) >= 85
    )
    .slice(0, 5)
    .map((t) => ({
      id: String(t.id),
      message: `Transaction ${t.id} — ${t.counterparty ?? t.name ?? "Unknown"} (${t.evidenceStatus ?? "risk flagged"})`,
      severity: t.evidenceStatus === "MISSING" || (t.riskScore ?? 0) >= 90
        ? "critical"
        : "warning",
    }));

  return (
    <Card>
      <h3>Compliance Alerts</h3>

      {alerts.length === 0 && (
        <div style={{ color: "#6b7280", fontSize: 14 }}>No alerts 🎉</div>
      )}

      {alerts.map((alert) => (
        <div key={alert.id} style={{ marginBottom: 10 }}>
          <Badge label={alert.severity} />
          <span style={{ marginLeft: 8, fontSize: 14 }}>{alert.message}</span>
        </div>
      ))}
    </Card>
  );
}
