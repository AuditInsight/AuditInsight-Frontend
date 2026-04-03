"use client";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import TransactionsStats from "@/components/transactions/stats/TransactionsStats";
import TransactionsFilters from "@/components/transactions/filters/TransactionsFilters";
import TransactionsAlerts from "@/components/transactions/alerts/TransactionsAlerts";
import TransactionsTable from "@/components/transactions/table/TransactionsTable";

export default function TransactionsPage() {
  return (
    <div>
      <PageToolbar
        title="Transactions"
        filters={["Date", "Amount", "Type", "Risk Score", "Evidence"]}
        showSearch
        primaryActionLabel="Add Transaction"
      />

      <TransactionsStats />
      <TransactionsFilters />
      <TransactionsAlerts />
      <TransactionsTable />
    </div>
  );
}
