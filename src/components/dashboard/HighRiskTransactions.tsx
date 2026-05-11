"use client"

import React from "react";
import { Table } from "@/components/ui/table/table";
import { Card } from "@/components/ui/card/card";
import { CardHeader } from "@/components/ui/cardHeader/CardHeader";
import { CardContent } from "@/components/ui/cardHeader/CardContent";
import { Badge } from "@/components/ui/badge/badge";

// =========================
// TYPES
// =========================
type Transaction = {
  id: number;
  riskScore: number;
  counterparty: string;
  date?: string;
};

type HighRiskRow = {
  id: string;
  date: string;
  counterparty: string;
  riskScore: number;
  status: "Observed" | "Flagged" | "Reviewed" | "Approved";
};

type Props = {
  transactions: Transaction[];
};

// =========================
// STATUS MAPPING
// =========================
const statusVariant: Record<
  HighRiskRow["status"],
  "success" | "warning" | "danger"
> = {
  Observed: "warning",
  Flagged: "danger",
  Reviewed: "success",
  Approved: "success",
};

// =========================
// COMPONENT
// =========================
export default function HighRiskTransactions({
  transactions,
}: Props) {
  // 🔥 REAL FILTERING (instead of static data)
  const highRiskData: HighRiskRow[] = transactions
    .filter((t) => t.riskScore >= 80)
    .map((t) => ({
      id: `#TXN${t.id}`,
      date: "N/A", // replace later with real backend date
      counterparty: t.counterparty,
      riskScore: t.riskScore,
      status: t.riskScore >= 90 ? "Flagged" : "Observed",
    }));

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