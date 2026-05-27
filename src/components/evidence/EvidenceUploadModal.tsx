"use client";

import { useEffect, useState } from "react";
import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";
import { Transaction } from "@/types/transaction.types";
import {
  getTransactions,
  updateEvidence,
  uploadEvidence,
} from "@/utils/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: Evidence) => void;
  sections: {
    title: string;
    items: string[];
  }[];
  mode?: "add" | "edit";
  evidence?: Evidence | null;
}

export const EvidenceUploadModal = ({
  isOpen,
  onClose,
  onSave,
  sections,
  mode = "add",
  evidence = null,
}: Props) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [notes, setNotes] = useState("");

  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [counterpartyName, setCounterpartyName] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const res = await getTransactions();
        setTransactions(res.data);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    loadTransactions();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && evidence) {
      setName(evidence.name);
      setCategory(evidence.category);
      setSubCategory(evidence.subCategory);
      setNotes(evidence.notes || "");
      setTransactionId(
        evidence.transactionId ? String(evidence.transactionId) : ""
      );
      setAmount(evidence.amount != null ? String(evidence.amount) : "");
      setCounterpartyName(evidence.counterpartyName || "");
      setFile(null);
      setFileType("");
    } else if (mode === "add") {
      setName("");
      setCategory("");
      setSubCategory("");
      setNotes("");
      setTransactionId("");
      setAmount("");
      setCounterpartyName("");
      setFile(null);
      setFileType("");
    }
  }, [isOpen, mode, evidence]);

  if (!isOpen) return null;

  const isEdit = mode === "edit";

  const handleTransactionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value;
    setTransactionId(id);

    const selected = transactions.find((t) => String(t.id) === id);
    if (selected) {
      setAmount(String(selected.amount));
      setCounterpartyName(selected.counterparty);
    } else {
      setAmount("");
      setCounterpartyName("");
    }
  };

  const formatTransactionLabel = (t: Transaction) =>
    `${t.id} — ${t.counterparty}`;

  const selectedSection = sections.find((s) => s.title === category);

  // ✅ FILE VALIDATION
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Invalid file type");
      return;
    }

    setFile(selectedFile);
  };

  // =========================
  // SAVE HANDLER
  // =========================
  const resetForm = () => {
    setName("");
    setCategory("");
    setSubCategory("");
    setNotes("");
    setTransactionId("");
    setAmount("");
    setCounterpartyName("");
    setFile(null);
    setFileType("");
  };

  const handleSave = async () => {
    try {
      if (!transactionId) {
        alert("Please select a transaction");
        return;
      }

      if (isEdit && evidence) {
        const response = await updateEvidence(evidence.id, {
          name,
          category,
          subCategory,
          notes,
          transactionId: Number(transactionId),
          amount: amount ? Number(amount) : undefined,
          counterpartyName: counterpartyName || undefined,
        });
        onSave(response.data);
        resetForm();
        onClose();
        return;
      }

      if (!file) {
        alert("Please select a file");
        return;
      }

      const response = await uploadEvidence(file, {
        transactionId: Number(transactionId),
        name,
        category,
        subCategory,
        notes,
        amount: amount ? Number(amount) : undefined,
        counterpartyName: counterpartyName || undefined,
      });

      onSave(response.data);
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      alert(isEdit ? "Update failed" : "Upload failed");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>{isEdit ? "Update Evidence" : "Add Evidence"}</h3>

        <input
          placeholder="Document name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <select
          value={transactionId}
          onChange={handleTransactionChange}
          style={input}
          disabled={loadingTransactions}
        >
          <option value="">
            {loadingTransactions
              ? "Loading transactions…"
              : "Select transaction"}
          </option>

          {transactions.map((t) => (
            <option key={t.id} value={t.id}>
              {formatTransactionLabel(t)}
            </option>
          ))}
        </select>

        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={input}
        />

        <input
          placeholder="Counterparty Name"
          value={counterpartyName}
          onChange={(e) => setCounterpartyName(e.target.value)}
          style={input}
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory("");
          }}
          style={input}
        >
          <option value="">Select category</option>

          {sections.map((section) => (
            <option key={section.title} value={section.title}>
              {section.title}
            </option>
          ))}
        </select>

        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          style={input}
        >
          <option value="">Select subcategory</option>

          {selectedSection?.items.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={textarea}
        />

        {!isEdit && (
          <>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              style={input}
            >
              <option value="">Choose file type</option>
              <option value="image">Image</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="word">Word</option>
            </select>

            <input
              type="file"
              accept={
                fileType === "image"
                  ? ".png,.jpg,.jpeg"
                  : fileType === "pdf"
                    ? ".pdf"
                    : fileType === "excel"
                      ? ".xlsx"
                      : fileType === "word"
                        ? ".docx"
                        : ".pdf,.png,.jpg,.jpeg,.xlsx,.docx"
              }
              onChange={handleFileChange}
              style={input}
            />

            {file && <span style={fileName}>Selected: {file.name}</span>}
          </>
        )}

        <div style={actions}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button style={saveBtn} onClick={handleSave}>
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   STYLES (UNCHANGED)
========================= */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal: React.CSSProperties = {
  width: 500,
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const input: React.CSSProperties = {
  padding: 10,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: 8,
};

const textarea: React.CSSProperties = {
  padding: 10,
  minHeight: 100,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: 8,
};

const fileName: React.CSSProperties = {
  fontSize: 12,
  color: theme.colors.textMuted,
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const cancelBtn: React.CSSProperties = {
  padding: "8px 14px",
};

const saveBtn: React.CSSProperties = {
  padding: "8px 14px",
  background: theme.colors.primary,
  color: "#fff",
  border: "none",
  borderRadius: 8,
};
