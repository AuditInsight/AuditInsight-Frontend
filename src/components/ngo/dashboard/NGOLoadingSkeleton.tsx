"use client";

interface Props {
  rows?: number;
  height?: number;
}

function SkeletonLine({ width = "100%", height = 14 }: { width?: string | number; height?: number }) {
  return (
    <div
      style={{ width, height, borderRadius: 6, background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}
    />
  );
}

export default function NGOLoadingSkeleton({ rows = 4, height = 14 }: Props) {
  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 0" }}>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonLine key={i} width={i % 3 === 2 ? "60%" : i % 2 === 0 ? "85%" : "100%"} height={height} />
        ))}
      </div>
    </>
  );
}

export function NGOCardSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <SkeletonLine width="40%" height={12} />
      <SkeletonLine width="60%" height={28} />
      <SkeletonLine width="50%" height={10} />
    </div>
  );
}
