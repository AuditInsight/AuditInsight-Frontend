"use client";

import { Card } from "@/components/ui/card/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

type Transaction = { id: string | number };
type Evidence = { id: string | number };

type Props = {
  transactions: Transaction[];
  evidence: Evidence[];
};

const COLORS = {
  uploaded: "#4CAF50",
  missing: "#F44336",
};

export default function EvidenceChart({
  transactions,
  evidence,
}: Props) {
  const total = transactions.length;
  const uploaded = evidence.length;
  const missing = Math.max(total - uploaded, 0);

  const coverage = total ? Math.round((uploaded / total) * 100) : 0;

  const data = [
    { name: "Uploaded", value: uploaded },
    { name: "Missing", value: missing },
  ];

  return (
    <Card padding="sm">
      <h3 style={{ marginBottom: 8, fontSize: 14 }}>
        Evidence Coverage
      </h3>

      {/* PIE — compact */}
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={60} label>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? COLORS.uploaded : COLORS.missing}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* INLINE SUMMARY */}
      <div
        style={{
          marginTop: 6,
          fontSize: 13,
          color: "#374151",
        }}
      >
        <strong>Coverage:</strong> {coverage}%
      </div>
    </Card>
  );
}


