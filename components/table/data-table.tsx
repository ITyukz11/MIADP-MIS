import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Checkbox } from "@/components/ui/checkbox"; // Adjust the import according to your file structure

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hiddenColumns?: string[];
  onSelectedRowIdsChange?: (selectedRowIds: string[]) => void;
  allowSelectRow: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  hiddenColumns = [],
  onSelectedRowIdsChange,
  allowSelectRow
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    const initialVisibility: VisibilityState = {};
    hiddenColumns.forEach((columnId) => {
      initialVisibility[columnId] = false;
    });
    return initialVisibility;
  });

  React.useEffect(() => {
    const updatedVisibility: VisibilityState = {};
    hiddenColumns.forEach((columnId) => {
      updatedVisibility[columnId] = false;
    });

    setColumnVisibility((prevVisibility) => {
      if (JSON.stringify(prevVisibility) !== JSON.stringify(updatedVisibility)) {
        return updatedVisibility;
      }
      return prevVisibility;
    });
  }, [hiddenColumns]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const numberingColumn: ColumnDef<TData, any> = {
    id: "numbering",
    header: "#",
    cell: (info) => info.row.index + 1,
  };

   // Add the "select" column conditionally
   const selectColumn: ColumnDef<TData, any> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

   // Conditionally include the select column
   const columnsWithNumbering = allowSelectRow
   ? [selectColumn, numberingColumn, ...columns]
   : [numberingColumn, ...columns];

  const table = useReactTable({
    data,
    columns: columnsWithNumbering,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: allowSelectRow,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Using a ref to store the latest value of the callback
  const onSelectedRowIdsChangeRef = React.useRef(onSelectedRowIdsChange);
  onSelectedRowIdsChangeRef.current = onSelectedRowIdsChange;

  React.useEffect(() => {
    if (onSelectedRowIdsChangeRef.current) {
      const selectedRowIds = Object.keys(rowSelection)
        .filter((id) => rowSelection[id])
        .map((rowId) => table.getRow(rowId).getValue('id') as string); // Get the value of the 'id' column for selected rows and assert it as string
      onSelectedRowIdsChangeRef.current(selectedRowIds);
    }
  }, [rowSelection, table]);

  return (
    <div className="space-y-4">
      <DataTableToolbar data={data} table={table} selectedRows={rowSelection}/>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithNumbering.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
