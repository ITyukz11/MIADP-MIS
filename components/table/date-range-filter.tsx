import { FilterFn } from '@tanstack/react-table';
import { DateRange } from 'react-day-picker';

export const dateInRangeFilter: FilterFn<any> = (row, columnId, filterValue: DateRange) => {
  const rowValue = row.getValue(columnId) as string;
  const rowDate = new Date(rowValue);

  if (isNaN(rowDate.getTime())) return false; // Ensure the date is valid

  if (!filterValue.from || !filterValue.to) return true;
  return rowDate >= filterValue.from && rowDate <= filterValue.to;
};
