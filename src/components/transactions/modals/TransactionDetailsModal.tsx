"use client";

import { Modal } from "@/components/ui/modal/modal";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { EvidenceList } from "../EvidenceList";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  evidences: Evidence[];
}

export const TransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction,
  evidences,
}: Props) => {
  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Transaction ${transaction.id}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        
        {/* 🔹 Transaction Info */}
        <div>
          <strong>Counterparty:</strong> {transaction.counterparty}
        </div>

        <div>
          <strong>Amount:</strong> {transaction.amount}
        </div>

        <div>
          <strong>Status:</strong> {transaction.status}
        </div>

        <div>
          <strong>Risk Score:</strong> {transaction.riskScore}%
        </div>

        {/* 🔥 Evidence Section */}
        <div>
          <h4>Supporting Documents</h4>
          <EvidenceList evidences={evidences} />
        </div>

      </div>
    </Modal>
  );
};