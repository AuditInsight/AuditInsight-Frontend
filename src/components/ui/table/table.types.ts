export interface Column<T> {
  header: string;
  accessor: keyof T;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}