"use client";

import { useState } from "react";
import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: Evidence) => void;
  sections: {
    title: string;
    items: string[];
  }[];
}

export const EvidenceUploadModal = ({
  isOpen,
  onClose,
  onSave,
  sections,
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

  if (!isOpen) return null;

  const selectedSection = sections.find(
    (s) => s.title === category
  );

  // ✅ FILE VALIDATION
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
  const handleSave = () => {
    const newEvidence: Evidence = {
      id: Date.now(),
      name,
      category,
      subCategory,
      type: file?.type || "Document",

      // ✅ safer object URL
      url: file ? URL.createObjectURL(file) : "#",

      // ✅ store original uploaded file
      fileObject: file || undefined,

      date: new Date().toISOString().split("T")[0],
      uploadedBy: "Current User",
      uploadedAt: new Date().toISOString(),
      status: "Pending",
      notes,

      transactionId: transactionId
        ? Number(transactionId)
        : undefined,
      amount: amount ? Number(amount) : undefined,
      counterpartyName: counterpartyName || undefined,
    };

    onSave(newEvidence);

    // 🔥 CLEANUP FIX
    setFile(null);

    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Add Evidence</h3>

        <input
          placeholder="Document name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          style={input}
        />

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
          onChange={(e) =>
            setCounterpartyName(e.target.value)
          }
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
            <option
              key={section.title}
              value={section.title}
            >
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
            <option key={item}>{item}</option>
          ))}
        </select>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={textarea}
        />

        {/* FILE TYPE */}
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

        {/* FILE UPLOAD */}
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

        {/* FILE NAME */}
        {file && (
          <span style={fileName}>
            Selected: {file.name}
          </span>
        )}

        <div style={actions}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button style={saveBtn} onClick={handleSave}>
            Save
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