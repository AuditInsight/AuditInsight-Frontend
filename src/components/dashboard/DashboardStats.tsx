import { Card } from "@/components/ui/card/card"
import { StatsGrid } from "./DashboardStats.styles"
import { DashboardStat } from "./DashboardStats.types"

const stats: DashboardStat[] = [
  {
    title: "Total Transactions",
    value: 24567,
    change: "+2.5%",
    status: "success"
  },
  {
    title: "Audit Ready",
    value: 23100,
    change: "+1.8%",
    status: "success"
  },
  {
    title: "Missing Evidence",
    value: 310,
    change: "-0.4%",
    status: "warning"
  }
]

export default function DashboardStats() {
  return (
    <StatsGrid>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <h4>{stat.title}</h4>
          <h2>{stat.value}</h2>
          <span>{stat.change}</span>
        </Card>
      ))}
    </StatsGrid>
  )
}