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
      {/* LEFT INFO */}
      <span style={text}>Page {page} of {totalPages}</span>

      {/* PAGE NUMBERS */}
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
                    : "#fff",
                color:
                  page === current
                    ? "#fff"
                    : theme.colors.textPrimary,
                border:
                  page === current
                    ? `1px solid ${theme.colors.primary}`
                    : `1px solid ${theme.colors.border}`,
              }}
            >
              {current}
            </button>
          );
        })}

        {/* DOTS */}
        {totalPages > 5 && (
          <span style={dots}>...</span>
        )}
      </div>

      {/* NEXT BUTTON */}
      <button
        onClick={() =>
          page < totalPages && setPage(page + 1)
        }
        style={navBtn}
      >
        Next →
      </button>
    </div>
  );
}

/* =========================
   STYLES (UPGRADED)
========================= */

const container: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
};

const text: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  fontWeight: 500,
};

const pages: React.CSSProperties = {
  display: "flex",
  gap: 6,
  alignItems: "center",
  flexWrap: "wrap",
  justifyContent: "center",
};

const dots: React.CSSProperties = {
  padding: "0 6px",
  color: "#9ca3af",
  fontSize: 14,
};

const button: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  cursor: "pointer",
  background: "#fff",
  fontSize: 13,
  transition: "all 0.2s ease",
};

const navBtn: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
};


