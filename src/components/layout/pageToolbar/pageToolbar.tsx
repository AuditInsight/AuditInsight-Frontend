"use client"

import {
  Calendar,
  Search,
  RotateCcw,
  Download,
  Plus,
} from "lucide-react"

import { PageToolbarProps } from "./pageToolbar.types"
import { pageToolbarStyles } from "./pageToolbar.styles"

export default function PageToolbar({
  title,
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
      <div style={pageToolbarStyles.topRow}>
        <h1 style={pageToolbarStyles.title}>{title}</h1>
      </div>

      <div style={pageToolbarStyles.bottomRow}>
        <div style={pageToolbarStyles.filters}>
          <div style={pageToolbarStyles.inputWrapper}>
            <Calendar size={16} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate?.(e.target.value)}
              style={pageToolbarStyles.input}
            />
          </div>

          <div style={pageToolbarStyles.inputWrapper}>
            <Calendar size={16} />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate?.(e.target.value)}
              style={pageToolbarStyles.input}
            />
          </div>

          {showSearch && (
            <div style={pageToolbarStyles.inputWrapper}>
              <Search size={16} />
              <input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch?.(e.target.value)}
                style={pageToolbarStyles.input}
              />
            </div>
          )}

          <button
            onClick={onReset}
            style={pageToolbarStyles.button}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div style={pageToolbarStyles.actions}>
          <button
            onClick={onExport}
            style={pageToolbarStyles.exportBtn}
          >
            <Download size={16} />
            Export
          </button>

          {primaryActionLabel && (
            <button
              onClick={onAdd}
              style={pageToolbarStyles.primaryBtn}
            >
              <Plus size={16} />
              {primaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


