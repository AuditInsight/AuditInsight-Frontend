import { Table } from "@/components/ui/table/table";
import { Card } from "@/components/ui/card/card";
import { CardHeader } from "@/components/ui/cardHeader/CardHeader";
import { CardContent } from "@/components/ui/cardHeader/CardContent";
import { Badge } from "@/components/ui/badge/badge";

type HighRiskRow = {
  id: string;
  date: string;
  counterparty: string;
  riskScore: number;
  status: "Observed" | "Flagged" | "Reviewed" | "Approved";
};

// Demo data
const highRiskData: HighRiskRow[] = [
  {
    id: "#TXN10451",
    date: "03/20/2026",
    counterparty: "MFI Distributors",
    riskScore: 92,
    status: "Flagged",
  },
  {
    id: "#TXN10389",
    date: "03/15/2026",
    counterparty: "ABC Corp",
    riskScore: 85,
    status: "Flagged",
  },
  {
    id: "#TXN10372",
    date: "03/10/2026",
    counterparty: "Global Logistics Ltd",
    riskScore: 88,
    status: "Observed",
  },
];

// ✅ NEW: use variant instead of color
const statusVariant: Record<
  HighRiskRow["status"],
  "success" | "warning" | "danger"
> = {
  Observed: "warning",
  Flagged: "danger",
  Reviewed: "success",
  Approved: "success",
};

export default function HighRiskTransactions() {
  const columns: {
    header: string;
    accessor: keyof HighRiskRow;
    cell?: (value: string | number) => React.ReactNode;
  }[] = [
    { header: "ID", accessor: "id" },
    { header: "Date", accessor: "date" },
    { header: "Counterparty", accessor: "counterparty" },
    { header: "Risk Score", accessor: "riskScore" },

    {
      header: "Status",
      accessor: "status",

      // ✅ FIXED CELL FUNCTION
      cell: (value: string | number) => {
        const status = value as HighRiskRow["status"];

        return (
          <Badge
            label={status}
            variant={statusVariant[status]}
          />
        );
      },
    },
  ];

  return (
    <Card padding="lg">
      <CardHeader title="High-Risk Transactions" />
      <CardContent>
        <Table columns={columns} data={highRiskData} />
      </CardContent>
    </Card>
  );
}