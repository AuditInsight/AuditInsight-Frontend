"use client";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export const TransactionsFilters = ({ search, setSearch }: Props) => {
  return (
    <div style={{ marginBottom: 20 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* LEFT */}
        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="Search counterparty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={input}
          />

          <button style={btn}>Date: 03/01/2026 → 03/30/2026</button>
          <button style={btn}>Reset</button>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", gap: 10 }}>
          <button style={primary}>+ Add Transaction</button>
          <button style={btn}>Export</button>
        </div>
      </div>
    </div>
  );
};

/* 🎨 STYLES */

const input: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  padding: "6px 10px",
  borderRadius: 6
};

const btn: React.CSSProperties = {
  padding: "6px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  background: "#fff"
};

const primary: React.CSSProperties = {
  ...btn,
  background: "rgba(10, 65, 120, 0.92)",
  color: "#fff"
};