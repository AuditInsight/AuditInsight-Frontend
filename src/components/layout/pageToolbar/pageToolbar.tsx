"use client";

import { PageToolbarProps } from "./pageToolbar.types";
import { pageToolbarStyles } from "./pageToolbar.styles";

export default function PageToolbar({
  title,
  filters = [],
  showSearch = false,
  primaryActionLabel,

  search,
  setSearch,
  onReset,
  onExport,
  onAdd,

  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: PageToolbarProps) {
  return (
    <div style={pageToolbarStyles.container}>
      
      {/* 🔹 TITLE */}
      <div style={pageToolbarStyles.topRow}>
        <h1 style={pageToolbarStyles.title}>{title}</h1>
      </div>

      {/* 🔹 CONTROLS */}
      <div style={pageToolbarStyles.bottomRow}>
        
        {/* LEFT */}
        <div style={pageToolbarStyles.filters}>
          
          {/* 📅 DATE FILTER */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate?.(e.target.value)}
            style={pageToolbarStyles.search}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate?.(e.target.value)}
            style={pageToolbarStyles.search}
          />

          {/* 🔍 SEARCH */}
          {showSearch && (
            <input
              placeholder="🔍 Search transactions..."
              value={search}
              onChange={(e) => setSearch?.(e.target.value)}
              style={pageToolbarStyles.search}
            />
          )}

          {/* 🔄 RESET */}
          <button onClick={onReset} style={pageToolbarStyles.button}>
            🔄 Reset
          </button>
        </div>

        {/* RIGHT */}
        <div style={pageToolbarStyles.actions}>
          
          {/* 📤 EXPORT */}
          <button onClick={onExport} style={pageToolbarStyles.exportBtn}>
            📤 Export
          </button>

          {/* ➕ ADD */}
          {primaryActionLabel && (
            <button onClick={onAdd} style={pageToolbarStyles.primaryBtn}>
              + {primaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}