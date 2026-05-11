import { useEffect, useState } from "react";

// =========================
// TYPES
// =========================
type Transaction = {
  id: number;
  riskScore: number;
  counterparty?: string;
};

type Evidence = {
  id: number;
  name?: string;
};

// =========================
// HOOK
// =========================
export function useDashboardData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, evRes] = await Promise.all([
          fetch("http://localhost:8080/api/transactions"),
          fetch("http://localhost:8080/api/evidence"),
        ]);

        const txData: Transaction[] = await txRes.json();
        const evData: Evidence[] = await evRes.json();

        setTransactions(txData);
        setEvidence(evData);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { transactions, evidence, loading };
}