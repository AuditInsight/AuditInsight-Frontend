// components/ui/table/Table.tsx

"use client";

import { useState } from 'react';
import { TableProps } from './table.types';
import { tableStyles } from './table.styles';

export function Table<T>({
  columns,
  data,
}: TableProps<T>) {

  const [hoveredRow, setHoveredRow] =
    useState<number | null>(null);

  return (
    <div style={tableStyles.wrapper}>

      {/* ✅ SAAS ATMOSPHERIC GLOW */}
      <div style={{
        position: 'absolute',
        top: -24,
        left: -24,
        right: -24,
        bottom: -24,
        filter: 'blur(32px)',
        background: 'radial-gradient(closest-side, rgba(99,102,241,0.12), transparent)',
        pointerEvents: 'none',
        borderRadius: 'inherit',
      }} />

      <table style={tableStyles.table}>
        <thead style={tableStyles.thead}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                style={tableStyles.th}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}

              style={{
                ...tableStyles.tr,

                ...(hoveredRow === rowIndex
                  ? tableStyles.trHover
                  : {}),
              }}

              onMouseEnter={() =>
                setHoveredRow(rowIndex)
              }

              onMouseLeave={() =>
                setHoveredRow(null)
              }
            >
              {columns.map((column) => (
                <td
                  key={String(column.accessor)}
                  style={tableStyles.td}
                >
                  {String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


