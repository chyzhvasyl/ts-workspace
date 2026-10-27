import type { ReactNode } from 'react';

import styles from './table.module.scss';

export interface Column<Row> {
  key: string;
  header: ReactNode;
  render: (row: Row) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

interface TableProps<Row> {
  columns: ReadonlyArray<Column<Row>>;
  rows: ReadonlyArray<Row>;
  rowKey: (row: Row) => string;
  empty?: ReactNode;
  onRowClick?: (row: Row) => void;
}

export function Table<Row>({
  columns,
  rows,
  rowKey,
  empty,
  onRowClick,
}: TableProps<Row>) {
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align ?? 'left', width: c.width }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                {empty ?? 'Немає даних'}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                className={onRowClick ? styles.clickable : ''}
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
