import statsStyles from "@/components/mse/dashboard/DashboardStats.styles";

type Transaction = {
  id: string | number;
  riskScore?: number;
  evidenceStatus?: string;
};

type Evidence = {
  id: string | number;
};

type Props = {
  transactions?: Transaction[];
  evidence?: Evidence[];
};

export default function DashboardStats({ transactions, evidence }: Props) {
  const totalTransactions = transactions?.length || 0;

  const highRisk =
    transactions?.filter(
      (t) => t.evidenceStatus === "MISSING" || (t.riskScore ?? 0) >= 80
    ).length || 0;

  const evidenceCount = evidence?.length || 0;

  const coverage =
    totalTransactions > 0
      ? Math.round((evidenceCount / totalTransactions) * 100)
      : 0;

  const stats = [
    { label: "Transactions", value: totalTransactions, trend: "+ realtime" },
    { label: "High Risk", value: highRisk, trend: "needs review" },
    { label: "Evidence Coverage", value: `${coverage}%`, trend: "auto-calculated" },
    { label: "Evidence Files", value: evidenceCount, trend: "uploaded" },
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
          <div style={statsStyles.icon} />
        </div>
      ))}
    </div>
  );
}


