
import { statsStyles } from "@/components/dashboard/DashboardStats.styles";

export default function TransactionsStats() {
  const stats = [
    {
      label: "Transactions Today",
      value: "2,726",
      trend: "+219 New",
    },
    {
      label: "Verified Evidence",
      value: "95.6%",
      trend: "35 Missing",
    },
    {
      label: "Flagged Risks",
      value: "123",
      trend: "89 High Risk",
    },
    {
      label: "Past Due Approvals",
      value: "94",
      trend: "14 Overdue > 3 Days",
    },
  ];

  return (
    <div style={statsStyles.container}>
      {stats.map((s) => (
        <div key={s.label} style={statsStyles.card}>
          <div>
            <div style={statsStyles.label}>{s.label}</div>
            <div style={statsStyles.value}>{s.value}</div>
            <div style={statsStyles.trend}>{s.trend}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
