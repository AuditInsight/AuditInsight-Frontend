import { Evidence } from "@/types/evidence.types";
import { Badge } from "@/components/ui/badge/badge";
import { Colors } from "@/styles/colors";

interface EvidenceListProps {
  evidences: Evidence[];
}

export const EvidenceList = ({ evidences }: EvidenceListProps) => {
  if (!evidences.length) {
    return (
      <span style={{ color: Colors.textSecondary }}>
        No evidence uploaded
      </span>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {evidences.map((e) => (
        <a
          key={e.id}
          href={e.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Badge
            label={e.name}
            variant={
              e.status === "Missing"
                ? "danger"
                : e.status === "Pending"
                ? "warning"
                : "success"
            }
          />
        </a>
      ))}
    </div>
  );
};