"use client";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";

export const EvidenceToolbar = () => {
  return (
    <PageToolbar
      title="Document Control Center"
      filters={["Category", "Status", "Date"]}
      showSearch
      primaryActionLabel="+ Add Evidence"
    />
  );
};


