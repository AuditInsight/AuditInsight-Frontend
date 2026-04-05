"use client";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import { TransactionsTable } from "@/components/transactions/table/TransactiosTable";

export default function TransactionsPage() {
  return (
    <div>
      <PageToolbar
        title="Transactions"
        filters={["Status", "Risk", "Date"]}
        showSearch
        primaryActionLabel="Add Transaction"
      />

      <TransactionsTable />
    </div>
  );
}