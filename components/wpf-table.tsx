"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDownIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import { RiArrowUpDownFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";




export type WPFDATA = {
  operatingUnit: string;
  component: string;
  resultIndicator: string;
  outputIndicator: string;
  majorActivity: string
  activities: string;
  indicator: string;
  // target: AnnualQuarterlyData;
  // actualBudget: AnnualQuarterlyData;
  // budget: AnnualQuarterlyData;
  // physicalActual: AnnualQuarterlyData;
  // accomplishment: AnnualQuarterlyData;
};
export type AnnualQuarterlyData = {
  annual: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
};
const data: WPFDATA[] = [
  {
    operatingUnit: "Region 10",
    component: "Component 1",
    resultIndicator: "-",
    outputIndicator: "-",
    majorActivity: "-",
    activities: "-",
    indicator: "-",
    // target: {
    //   annual: '1',
    //   q1: '1',
    //   q2: '1',
    //   q3: '1',
    //   q4: '1'
    // },
    // actualBudget: {
    //   annual: '2',
    //   q1: '2',
    //   q2: '2',
    //   q3: '2',
    //   q4: '2'
    // },
    // budget: {
    //   annual: '3',
    //   q1: '3',
    //   q2: '3',
    //   q3: '3',
    //   q4: '3'
    // },
    // physicalActual: {
    //   annual: '4',
    //   q1: '4',
    //   q2: '4',
    //   q3: '4',
    //   q4: '4'
    // },
    // accomplishment: {
    //   annual: '5',
    //   q1: '5',
    //   q2: '5',
    //   q3: '5',
    //   q4: '5'
    // },
  },
  

]

export const columns: ColumnDef<WPFDATA>[] = [
  {
    accessorKey: "operatingUnit",
    header: "Operating Unit",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("operatingUnit")}</div>
    ),
  },
  {
    accessorKey: "component",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Component
          <RiArrowUpDownFill className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("component")}</div>,
  },
  {
    accessorKey: "resultIndicator",
    header: () => <div>Result Indicator</div>,
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("resultIndicator")}
        </div>
      );
    },
  },
  {
    accessorKey: "outputIndicator",
    header: () => <div>Output Indicator</div>,
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("outputIndicator")}
        </div>
      );
    },
  },
  {
    accessorKey: "majorActivity",
    header: () => <div>Major Activity</div>,
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("majorActivity")}
        </div>
      );
    },
  },
  {
    accessorKey: "activities",
    header: () => <div>Activities</div>,
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("activities")}
        </div>
      );
    },
  },
  {
    accessorKey: "indicator",
    header: () => <div>Indicator</div>,
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("indicator")}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "target",
  //   id: "target",
  //   header: "Target",
  //   enableGrouping: true,
  //   columns: [
  //     { accessorKey: "Annual", id: "Annual", header: () => <div>Annual</div>, cell: ({ row }) => row.original.target.annual },
  //     { accessorKey: "Q1", header: () => <div>Q1</div>, cell: ({ row }) => row.original.target.q1 },
  //     { accessorKey: "Q2", header: () => <div>Q2</div>, cell: ({ row }) => row.original.target.q2 },
  //     { accessorKey: "Q3", header: () => <div>Q3</div>, cell: ({ row }) => row.original.target.q3 },
  //     { accessorKey: "Q4", header: () => <div>Q4</div>, cell: ({ row }) => row.original.target.q4 },
  //   ],
  // },
  // {
  //   id: "actualBudget",
  //   header: "Actual Budget",
  //   columns: [
  //     { accessorKey: "Annual", header: "Annual", cell: ({ row }) => row.original.actualBudget.annual },
  //     { accessorKey: "Q1", header: "Q1", cell: ({ row }) => row.original.actualBudget.q1 },
  //     { accessorKey: "Q2", header: "Q2", cell: ({ row }) => row.original.actualBudget.q2 },
  //     { accessorKey: "Q3", header: "Q3", cell: ({ row }) => row.original.actualBudget.q3 },
  //     { accessorKey: "Q4", header: "Q4", cell: ({ row }) => row.original.actualBudget.q4 },
  //   ],
  // },
  // {
  //   id: "budget",
  //   header: "Budget",
  //   columns: [
  //     { accessorKey: "Annual", header: "Annual", cell: ({ row }) => row.original.budget.annual },
  //     { accessorKey: "Q1", header: "Q1", cell: ({ row }) => row.original.budget.q1 },
  //     { accessorKey: "Q2", header: "Q2", cell: ({ row }) => row.original.budget.q2 },
  //     { accessorKey: "Q3", header: "Q3", cell: ({ row }) => row.original.budget.q3 },
  //     { accessorKey: "Q4", header: "Q4", cell: ({ row }) => row.original.budget.q4 },
  //   ],
  // },
  // {
  //   id: "physicalActual",
  //   header: "Physical-Actual",
  //   columns: [
  //     { accessorKey: "Annual", header: "Annual", cell: ({ row }) => row.original.physicalActual.annual },
  //     { accessorKey: "Q1", header: "Q1", cell: ({ row }) => row.original.physicalActual.q1 },
  //     { accessorKey: "Q2", header: "Q2", cell: ({ row }) => row.original.physicalActual.q2 },
  //     { accessorKey: "Q3", header: "Q3", cell: ({ row }) => row.original.physicalActual.q3 },
  //     { accessorKey: "Q4", header: "Q4", cell: ({ row }) => row.original.physicalActual.q4 },
  //   ],
  // },
  // {
  //   id: "accomplishment",
  //   header: "Accomplishment",
  //   columns: [
  //     { accessorKey: "Annual", header: "Annual", cell: ({ row }) => row.original.accomplishment.annual },
  //     { accessorKey: "Q1", header: "Q1", cell: ({ row }) => row.original.accomplishment.q1 },
  //     { accessorKey: "Q2", header: "Q2", cell: ({ row }) => row.original.accomplishment.q2 },
  //     { accessorKey: "Q3", header: "Q3", cell: ({ row }) => row.original.accomplishment.q3 },
  //     { accessorKey: "Q4", header: "Q4", cell: ({ row }) => row.original.accomplishment.q4 },
  //   ],
  // },
  // {
  //   accessorKey: "action",
  //   header: "Action",
  //   cell: ({ row }) => (
  //     <Button variant={'outline'} className="text-center">{row.getValue("action")}</Button>
  //   ),
  // },
];


export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full shadow-xl rounded-md p-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Component..."
          value={(table.getColumn("component")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("component")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <div>

          </div>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <Button variant="outline" className="ml-2">
            <IoMdAdd /> Add
          </Button>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide()) // Include all columns, including subcolumns
              .map((column) => {
                if (column.id.includes('.')) {
                  return (
                    column.columns.map((subColumn) => (
                      <DropdownMenuCheckboxItem
                        key={subColumn.id}
                        className="capitalize"
                        checked={subColumn.getIsVisible()}
                        onCheckedChange={(value) => subColumn.toggleVisibility(!!value)}
                      >
                        {subColumn.id}
                      </DropdownMenuCheckboxItem>
                    ))

                  );
                }
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>



        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={index}>
                {headerGroup.headers.map((header) => {
                  const colSpan = header.colSpan == 1 ? 0 : header.colSpan
                  const rowSPan = header.colSpan > 1 ? 2 : 1
                  return (
                    <TableHead key={header.id} colSpan={colSpan} className={`text-center ${colSpan == 0 ? '' : 'border'}`}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
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
                    <TableCell key={cell.id} className="text-center">
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
