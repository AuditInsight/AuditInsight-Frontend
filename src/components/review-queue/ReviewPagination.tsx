"use client";

import { theme } from "@/styles/theme";

interface ReviewPaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function ReviewPagination({
  page,
  setPage,
  totalPages,
}: ReviewPaginationProps) {
  return (
    <div style={container}>
      {/* 🔹 LEFT TEXT */}
      <span style={text}>Page</span>

      {/* 🔹 PAGE NUMBERS */}
      <div style={pages}>
        {Array.from({ length: totalPages }).map((_, i) => {
          const current = i + 1;

          return (
            <button
              key={current}
              onClick={() => setPage(current)}
              style={{
                ...button,
                background:
                  page === current
                    ? theme.colors.primary
                    : theme.colors.Surface,
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

        {/* 🔹 OPTIONAL DOTS */}
        {totalPages > 5 && <span style={dots}>...</span>}
      </div>

      {/* 🔹 NEXT BUTTON */}
      <button
        onClick={() => page < totalPages && setPage(page + 1)}
        style={navBtn}
      >
        Next →
      </button>
    </div>
  );
}
// 🎨 STYLES

const container: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const text: React.CSSProperties = {
  fontSize: theme.typography.sm,
  color: theme.colors.textMuted,
};

const pages: React.CSSProperties = {
  display: "flex",
  gap: 6,
  alignItems: "center",
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

const navBtn: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.Surface,
  cursor: "pointer",
};