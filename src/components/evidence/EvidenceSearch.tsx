import { Search } from "lucide-react";

export const EvidenceSearch = ({
  value,
  onChange,
  setPage, // ✅ NEW
}: {
  value: string;
  onChange: (v: string) => void;
  setPage: (page: number) => void; // ✅ NEW
}) => {
  return (
    <div style={container}>
      <Search size={14} color="#64748b" />
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value); // ✅ existing
          setPage(1);               // 🔥 RESET PAGE
        }}
        placeholder="Search documents..."
        style={input}
      />
    </div>
  );
};

const container = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: "6px 10px",
  background: "#fff",
};

const input = {
  border: "none",
  outline: "none",
  fontSize: 13,
};