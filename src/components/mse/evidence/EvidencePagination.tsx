"use client";

import { theme } from "@/styles/theme";

interface EvidencePaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export const EvidencePagination = ({ page, setPage, totalPages }: EvidencePaginationProps) => {
  const goToPrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div style={container}>
      <button onClick={goToPrevious} disabled={page === 1} style={button}>
        Previous
      </button>

      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: totalPages }).map((_, i) => {
          const current = i + 1;
          return (
            <button
              key={current}
              onClick={() => setPage(current)}
              style={{
                ...button,
                background: page === current ? theme.colors.primary : "#fff",
                color: page === current ? "#fff" : theme.colors.textPrimary,
              }}
            >
              {current}
            </button>
          );
        })}
      </div>

      <button onClick={goToNext} disabled={page === totalPages} style={button}>
        Next
      </button>
    </div>
  );
};

const container: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const button: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  cursor: "pointer",
  background: "#fff",
  fontSize: theme.typography.sm,
};
