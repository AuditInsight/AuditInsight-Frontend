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
                page === currentPage ? "#0A4178" : "#fff",
              color: page === currentPage ? "#fff" : "#000",
            }}
          >
            {currentPage}
          </button>
        );
      })}
    </div>
  );
};

/* 🎨 styles */
const container: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  gap: 6,
};

const button: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  cursor: "pointer",
};