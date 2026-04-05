import { transactionsData } from "@/data/transactions.data";
import { evidenceData } from "@/data/evidence.data";
import { TransactionRow } from "./TransactionRow";
import { tableStyles } from "@/components/ui/table/table.styles";

export const TransactionsTable = () => {
  return (
    <div style={tableStyles.wrapper}>
      <table style={tableStyles.table}>
        <thead style={tableStyles.thead}>
          <tr>
            <th style={tableStyles.th}>Counterparty</th>
            <th style={tableStyles.th}>Amount</th>
            <th style={tableStyles.th}>Status</th>
            <th style={tableStyles.th}>Risk</th>
            <th style={tableStyles.th}>Evidence</th>
            <th style={tableStyles.th}>Coverage</th>
          </tr>
        </thead>

        <tbody>
          {transactionsData.map((transaction) => {
            // 🔥 CORE LOGIC
            const relatedEvidence = evidenceData.filter(
              (e) => e.transactionId === transaction.id
            );

            return (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                evidences={relatedEvidence}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};