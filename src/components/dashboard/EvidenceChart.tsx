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

// =========================
// TYPES
// =========================
type Transaction = {
  id: number;
};

type Evidence = {
  id: number;
};

type Props = {
  transactions: Transaction[];
  evidence: Evidence[];
};

// =========================
// COLORS
// =========================
const COLORS = {
  uploaded: "#4CAF50",
  missing: "#F44336",
};

// =========================
// COMPONENT
// =========================
export default function EvidenceChart({
  transactions,
  evidence,
}: Props) {
  const total = transactions.length;
  const uploaded = evidence.length;
  const missing = Math.max(total - uploaded, 0);

  const coverage =
    total > 0 ? Math.round((uploaded / total) * 100) : 0;

  const data = [
    { name: "Uploaded", value: uploaded },
    { name: "Missing", value: missing },
  ];

  const barData = [
    {
      name: "Evidence Coverage",
      uploaded,
      missing,
    },
  ];

  return (
    <Card>
      <h3>Evidence Coverage</h3>

      {/* ================= PIE CHART ================= */}
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    index === 0
                      ? COLORS.uploaded
                      : COLORS.missing
                  }
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= BAR CHART ================= */}
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="uploaded" fill={COLORS.uploaded} />
            <Bar dataKey="missing" fill={COLORS.missing} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= SUMMARY ================= */}
      <div style={{ marginTop: 12 }}>
        <strong>Coverage:</strong> {coverage}%
      </div>
    </Card>
  );
}