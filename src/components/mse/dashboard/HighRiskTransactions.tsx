"use client";

import React from "react";
import { Table } from "@/components/ui/table/table";
import { Card } from "@/components/ui/card/card";
import { CardHeader } from "@/components/ui/cardHeader/CardHeader";
import { CardContent } from "@/components/ui/cardHeader/CardContent";
import { Badge } from "@/components/ui/badge/badge";

type Transaction = {
  id: string | number;
  riskScore?: number;
  evidenceStatus?: string;
  counterparty?: string;
  name?: string;
  date?: string;
};

type HighRiskRow = {
  id: string;
  date: string;
  label: string;
  evidenceStatus: string;
  status: "Observed" | "Flagged" | "Reviewed" | "Approved";
};

type Props = {
  transactions: Transaction[];
};

const statusVariant: Record<
  HighRiskRow["status"],
  "success" | "warning" | "danger"
> = {
  Observed: "warning",
  Flagged: "danger",
  Reviewed: "success",
  Approved: "success",
};

export default function HighRiskTransactions({ transactions }: Props) {
  const highRiskData: HighRiskRow[] = transactions
    .filter(
      (t) =>
        t.evidenceStatus === "MISSING" ||
        t.evidenceStatus === "PARTIAL" ||
        (t.riskScore ?? 0) >= 80
    )
    .slice(0, 10)
    .map((t) => ({
      id: `TXN-${t.id}`,
      date: t.date ?? "—",
      label: t.counterparty ?? t.name ?? `Transaction ${t.id}`,
      evidenceStatus: t.evidenceStatus ?? "—",
      status: t.evidenceStatus === "MISSING" ? "Flagged" : "Observed",
    }));

  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Transaction", accessor: "label" as const },
    { header: "Evidence", accessor: "evidenceStatus" as const },
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
      <CardHeader title="Attention Required" />
      <CardContent>
        <div style={{ width: "100%", overflowX: "auto", maxHeight: 260 }}>
          {highRiskData.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 14, padding: "16px 0" }}>
              No transactions need attention.
            </p>
          ) : (
            <Table columns={columns} data={highRiskData} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}


