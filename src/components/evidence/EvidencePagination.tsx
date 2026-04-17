"use client";

import { theme } from "@/styles/theme"; // ✅ ADDED

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
    </div>
  );
};

/* 🎨 STYLES */

const container: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  gap: 6,
};

const button: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
  cursor: "pointer",
  background: theme.colors.Surface,
  fontSize: theme.typography.sm,
};