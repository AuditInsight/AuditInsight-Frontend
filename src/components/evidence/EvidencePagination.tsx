"use client";

import { theme } from "@/styles/theme";

interface EvidencePaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export const EvidencePagination = ({
  page,
  setPage,
  totalPages,
}: EvidencePaginationProps) => {
  return (
    <div style={container}>
      {/* 🔹 LABEL (this is what you wanted to add) */}
      <span style={label}>Page</span>

      {/* 🔹 PAGE BUTTONS (your existing logic untouched) */}
      {Array.from({ length: totalPages }).map((_, i) => {
        const currentPage = i + 1;

        return (
          <button
            key={currentPage}
            onClick={() => setPage(currentPage)}
            style={{
              ...button,
              background:
                page === currentPage
                  ? theme.colors.primary
                  : theme.colors.Surface,
              color:
                page === currentPage
                  ? "#fff"
                  : theme.colors.textPrimary,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                page === currentPage
                  ? theme.colors.primary
                  : theme.colors.appBackground)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                page === currentPage
                  ? theme.colors.primary
                  : theme.colors.Surface)
            }
          >
            {currentPage}
          </button>
        );
      })}

      {/* 🔹 OPTIONAL: DOTS LIKE "..." */}
      {totalPages > 5 && <span style={dots}>...</span>}
    </div>
  );
};

/* 🎨 STYLES */

const container: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const label: React.CSSProperties = {
  fontSize: theme.typography.sm,
  color: theme.colors.textMuted,
  marginRight: 6,
};

const dots: React.CSSProperties = {
  padding: "0 6px",
  color: theme.colors.textMuted,
};

const button: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
  cursor: "pointer",
  background: theme.colors.Surface,
  fontSize: theme.typography.sm,
};