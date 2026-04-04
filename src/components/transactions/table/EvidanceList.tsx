import { Evidance } from "@/types/evidance.types";
import { Badge } from "@/components/ui/badge/badge";
import { Colors } from "@/styles/colors";

interface EvidanceListProps {
  evidances: Evidance[];
}

export const EvidanceList = ({ evidances }: EvidanceListProps) => {
  if (!evidances.length) {
    return (
      <span style={{ color: Colors.textSecondary }}>No evidance uploaded</span>
    );
  }

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {evidances.map((e) => (
        <li key={e.id}>
          <a
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: Colors.primary }}
          >
            <Badge
              label={
                e.versionStatus === "superseded" ? "Old Version" : e.status
              }
              variant={
                e.versionStatus === "superseded"
                  ? "warning"
                  : e.status === "Verified"
                    ? "success"
                    : e.status === "Pending"
                      ? "warning"
                      : "danger"
              }
            />
          </a>
        </li>
      ))}
    </ul>
  );
};
