"use client";

export const EvidenceHeader = () => {
  return (
    <div style={header}>
      <h2 style={title}>Document Control Center</h2>

      <div style={actions}>
        <button style={secondaryBtn}>Export</button>
        <button style={primaryBtn}>+ Add Evidence</button>
      </div>
    </div>
  );
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const title = { fontSize: 22, fontWeight: 600 };

const actions = { display: "flex", gap: 10 };

const secondaryBtn = {
  padding: "8px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  background: "#fff",
};

const primaryBtn = {
  padding: "8px 14px",
  borderRadius: 6,
  background: "#0A4178",
  color: "#fff",
  border: "none",
};