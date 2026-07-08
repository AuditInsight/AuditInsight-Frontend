// StatsGrid.tsx
import React from "react"

interface StatsGridProps {
  children: React.ReactNode
}

export const StatsGrid: React.FC<StatsGridProps> = ({ children }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
      }}
    >
      {children}
    </div>
  )
}


