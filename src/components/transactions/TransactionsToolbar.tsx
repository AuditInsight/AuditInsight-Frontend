// src/components/layout/pageToolbar/TransactionsToolbar.tsx
"use client";

import React, { useState } from "react";
import { toolbarStyles } from "@/styles/toolbar.styles";

interface TransactionsToolbarProps {
  title: string;
  filters?: string[];
  showSearch?: boolean;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

const TransactionsToolbar: React.FC<TransactionsToolbarProps> = ({
  title,
  filters = [],
  showSearch = false,
  primaryActionLabel,
  onPrimaryAction,
}) => {
  const [search, setSearch] = useState("");

  return (
    <div style={toolbarStyles.container}>
      {/* ===== Top Row: Title + Primary Button ===== */}
      <div style={toolbarStyles.row}>
        <h2>{title}</h2>
        {primaryActionLabel && (
          <button
            style={toolbarStyles.primaryBtn}
            onClick={onPrimaryAction}
          >
            {primaryActionLabel}
          </button>
        )}
      </div>

      {/* ===== Second Row: Filters + Search ===== */}
      {(filters.length > 0 || showSearch) && (
        <div style={toolbarStyles.row}>
          {/* Filters */}
          <div style={toolbarStyles.left}>
            {filters.map((filter) => (
              <button key={filter} style={toolbarStyles.button}>
                {filter}
              </button>
            ))}
          </div>

          {/* Search */}
          {showSearch && (
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: `1px solid #ccc`,
                fontSize: "14px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionsToolbar;