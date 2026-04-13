"use client";

import { theme } from "@/styles/theme";

interface TransactionsPaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export const TransactionsPagination = ({
  page,
  setPage,
  totalPages,
}: TransactionsPaginationProps) => {
  const goToPrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div style={container}>
      
      {/* 🔙 PREVIOUS */}
      <button onClick={goToPrevious} style={button}>
        Previous
      </button>

      {/* 🔢 PAGE NUMBERS */}
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: totalPages }).map((_, i) => {
          const current = i + 1;

          return (
            <button
              key={current}
              onClick={() => setPage(current)}
              style={{
                ...button,

                /* ✅ THEME-BASED ACTIVE STATE */
                background:
                  page === current
                    ? theme.colors.primary
                    : "#fff",

                color:
                  page === current
                    ? "#fff"
                    : theme.colors.textPrimary,
              }}
            >
              {current}
            </button>
          );
        })}
      </div>

      {/* 🔜 NEXT */}
      <button onClick={goToNext} style={button}>
        Next
      </button>
    </div>
  );
};

/* 🎨 STYLES */

const container: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

/* ✅ UPDATED BUTTON (THEME-BASED) */
const button: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  cursor: "pointer",
  background: "#fff",
  fontSize: theme.typography.sm,
};