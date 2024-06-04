import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { CSVLink } from "react-csv";
import { useEffect, useState, useTransition } from "react";
import { DialogApprovePendingUsers } from "../admin/dialog-accounts";
import { AiOutlineExport, AiOutlinePrinter } from "react-icons/ai";
import { Printer } from "lucide-react";

interface DataTableToolbarProps<TData extends object> {
  data: TData[];
  table: Table<TData>;
  selectedRows: Record<string, boolean>; // Define prop for selected rows as an object with boolean values
}

export function DataTableToolbar<TData extends object>({
  data,
  table,
  selectedRows,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false); // Initialize loading state

  const [filterInput, setFilterInput] = useState<string>("");

  const filteredData = table.getFilteredRowModel().rows.map((row) => row.original);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      table.setGlobalFilter(filterInput || undefined);
    }, 300); // Debounce filter input to avoid rapid API calls or rendering

    return () => clearTimeout(timeoutId);
  }, [filterInput, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter..."
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <CSVLink data={filteredData} filename="filtered_data.csv">
          <Button variant="outline"><AiOutlineExport className="w-4 h-4"/> Export</Button>
        </CSVLink>
        <Button variant="outline"><AiOutlinePrinter className="w-5 h-5 shrink-0" /> Print</Button>
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
