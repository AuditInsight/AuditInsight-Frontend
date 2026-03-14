import { PageToolbarProps } from "./pageToolbar.types"
import { pageToolbarStyles } from "./pageToolbar.styles"

export default function PageToolbar({
  title,
  filters = [],
  showSearch = false,
  primaryActionLabel,
}: PageToolbarProps) {
  return (
    <div style={pageToolbarStyles.container}>
      {/* TITLE ROW */}
      <div style={pageToolbarStyles.topRow}>
        <h1 style={pageToolbarStyles.title}>{title}</h1>
      </div>

      {/* FILTER + ACTION ROW */}
      <div style={pageToolbarStyles.bottomRow}>
        {/* FILTERS */}
        <div style={pageToolbarStyles.filters}>
          {filters.map((filter) => (
            <button key={filter} style={pageToolbarStyles.filterButton}>
              {filter} ▼
            </button>
          ))}

          {showSearch && (
            <input
              placeholder="Search..."
              style={pageToolbarStyles.search}
            />
          )}
        </div>

        {/* ACTIONS */}
        <div style={pageToolbarStyles.actions}>
          <button style={pageToolbarStyles.exportBtn}>Export ▼</button>

          {primaryActionLabel && (
            <button style={pageToolbarStyles.primaryBtn}>
              + {primaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}