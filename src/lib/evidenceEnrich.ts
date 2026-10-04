import { Evidence } from "@/types/evidence.types";

interface TransactionInfo {
  id: string;
  amount?: number | string;
  counterparty?: string | null;
}

/**
 * The evidence endpoint does not return amount/counterparty — they belong to the
 * linked transaction, so fill them in from the transaction list for display.
 */
export function withTransactionInfo(evidence: Evidence[], transactions: TransactionInfo[]): Evidence[] {
  const byId = new Map(transactions.map((t) => [t.id, t]));
  return evidence.map((e) => {
    const tx = byId.get(e.transactionId);
    if (!tx) return e;
    return {
      ...e,
      amount: e.amount ?? (tx.amount != null ? Number(tx.amount) : undefined),
      counterparty: e.counterparty || tx.counterparty || undefined,
    };
  });
}
