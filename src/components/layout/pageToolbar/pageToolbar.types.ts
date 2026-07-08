export interface PageToolbarProps {
  title: string;
  filters?: string[];
  showSearch?: boolean;
  primaryActionLabel?: string;

  /* ✅ NEW */
  search?: string;
  setSearch?: (value: string) => void;

  onReset?: () => void;
  onExport?: () => void;
  onAdd?: () => void;

  startDate?: string;
  endDate?: string;
  setStartDate?: (value: string) => void;
  setEndDate?: (value: string) => void;
}


