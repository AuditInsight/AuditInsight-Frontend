import { statsStyles } from "@/components/dashboard/DashboardStats.styles"

const stats = [
  { label: "Transactions", value: "12,540", trend: "+8%" },
  { label: "High Risk", value: "342", trend: "-2%" },
  { label: "Evidence Uploaded", value: "1,245", trend: "+18%" },
  { label: "Alerts", value: "27", trend: "+4%" },
]

export default function DashboardStats() {
  return (
    <div style={statsStyles.container}>
      {stats.map((s) => (
        <div key={s.label} style={statsStyles.card}>
          <div>
            <div style={statsStyles.label}>{s.label}</div>
            <div style={statsStyles.value}>{s.value}</div>
            <div style={statsStyles.trend}>{s.trend} vs last period</div>
          </div>

          <div style={statsStyles.icon} />
        </div>
      ))}
    </div>
  )
}