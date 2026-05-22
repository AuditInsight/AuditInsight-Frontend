"use client";

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
// STATUS
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

export default function HighRiskTransactions({
  transactions,
}: Props) {
  const highRiskData: HighRiskRow[] = transactions
    .filter((t) => t.riskScore >= 80)
    .map((t) => ({
      id: `TXN${t.id}`,
      date: "N/A",
      counterparty: t.counterparty,
      riskScore: t.riskScore,
      status: t.riskScore >= 90 ? "Flagged" : "Observed",
    }));

  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Counterparty", accessor: "counterparty" as const },
    { header: "Risk", accessor: "riskScore" as const },
    {
      header: "Status",
      accessor: "status" as const,
      cell: (value: string | number) => {
        const status = value as HighRiskRow["status"];
        return <Badge label={status} variant={statusVariant[status]} />;
      },
    },
  ];

  return (
    <Card padding="sm">
      <CardHeader title="High-Risk Transactions" />

      <CardContent>
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            maxHeight: 260, // 🔥 KEY: keeps it compact
          }}
        >
          <Table
            columns={columns}
            data={highRiskData}
          />
        </div>
      </CardContent>
    </Card>
  );
}