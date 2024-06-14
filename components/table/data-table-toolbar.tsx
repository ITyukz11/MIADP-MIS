import React, { useEffect, useRef, useState, useTransition } from 'react';
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table as TanstackTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { CSVLink } from "react-csv";
import { DialogApprovePendingUsers } from '../admin/dialog-accounts';
import { AiOutlineExport, AiOutlinePrinter } from "react-icons/ai";
import { Search, SearchIcon } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  data: TData[];
  table: TanstackTable<TData>;
  selectedRows: Record<string, boolean>;
}
type CSVRow = Record<string, any>;

export function DataTableToolbar<TData>({
  data,
  table,
  selectedRows,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [filterInput, setFilterInput] = useState<string>("");

  const filteredData = table.getFilteredRowModel().rows.map((row) => row.original);

  // Transform data to CSVRow type using type assertion
  const csvData: CSVRow[] = filteredData as CSVRow[];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      table.setGlobalFilter(filterInput || undefined);
    }, 300); // Debounce filter input to avoid rapid API calls or rendering

    return () => clearTimeout(timeoutId);
  }, [filterInput, table]);

  return (
    <div className="flex items-center justify-between flex-wrap overflow-x-auto">
      <div className="flex flex-1 items-center space-x-2">
        <div className='relative'>
          <Input
            placeholder="Filter..."
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <SearchIcon className='absolute right-2 top-2 h-4 w-4'/>
        </div>

        <CSVLink data={csvData} filename="filtered_data.csv">
          <Button variant="outline"><AiOutlineExport className='w-4 h-4 shrink-0' /> Export</Button>
        </CSVLink>
        <Button variant="outline" disabled className='cursor-not-allowed'>
          <AiOutlinePrinter className='w-5 h-5 shrink-0' /> Print
        </Button>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <DataTableViewOptions table={table} />
        <DialogApprovePendingUsers
          approvedPendingUsersData={filteredData as Array<
            TData & {
              id?: number;
              name?: string;
              email?: string;
              region?: string;
              color?: string;
              password?: string;
            }
          >}
          disable={Object.keys(selectedRows).length > 0 ? false : true}
        />
      </div>

    </div>
  );
}
