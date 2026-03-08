import { Card } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"

type AlertItem = {
  id: string
  message: string
  severity: "warning" | "critical" | "info"
}

const alerts: AlertItem[] = [
  {
    id: "1",
    message: "Missing invoice for transaction #TXN10451",
    severity: "warning",
  },
  {
    id: "2",
    message: "Contract not uploaded for ABC Corp",
    severity: "critical",
  },
  {
    id: "3",
    message: "Risk score above threshold",
    severity: "info",
  },
]

export default function ComplianceAlerts() {
  return (
    <Card>
      <h3>Compliance Alerts</h3>

      {alerts.map((alert) => (
        <div key={alert.id}>
          <Badge label={alert.severity} />
          <span>{alert.message}</span>
        </div>
      ))}
    </Card>
  )
}