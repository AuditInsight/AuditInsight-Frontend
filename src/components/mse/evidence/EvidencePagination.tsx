"use client";

import { theme } from "@/styles/theme";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EvidencePaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export const EvidencePagination = ({ page, setPage, totalPages }: EvidencePaginationProps) => {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div style={container}>
      <span style={info}>Page {page} of {totalPages}</span>

      <div style={btnGroup}>
        <button
          style={{ ...navBtn, opacity: page === 1 ? 0.4 : 1 }}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft size={14} />
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={dots}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p as number)}
              style={{
                ...pageBtn,
                background: page === p ? "#1e3a8a" : "#fff",
                color: page === p ? "#fff" : theme.colors.textPrimary,
                borderColor: page === p ? "#1e3a8a" : theme.colors.border,
                fontWeight: page === p ? 700 : 400,
              }}
            >
              {p}
            </button>
          )
        )}

        <button
          style={{ ...navBtn, opacity: page === totalPages ? 0.4 : 1 }}
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

const container: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 4px",
  flexWrap: "wrap",
  gap: 8,
};

const info: React.CSSProperties = {
  fontSize: 13,
  color: theme.colors.textMuted,
};

const btnGroup: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
};

const pageBtn: React.CSSProperties = {
  minWidth: 32,
  height: 32,
  padding: "0 8px",
  borderRadius: 8,
  border: "1px solid",
  cursor: "pointer",
  fontSize: 13,
  fontFamily: "inherit",
  transition: "all 0.15s",
};

const navBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: `1px solid ${theme.colors.border}`,
  background: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.colors.textSecondary,
};

const dots: React.CSSProperties = {
  padding: "0 4px",
  color: theme.colors.textMuted,
  fontSize: 14,
  lineHeight: "32px",
};
