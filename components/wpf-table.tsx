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


const data: WPFDATA[] = [
    {
      majorComponent: "Component 2",
      subComponent: "Sub-Component 2",
      wfpItem: "Item 2",
      physical: "1200",
      financial: "8000",
      verificationStatus: "Pending",
      action: "View"
      },
      {
        majorComponent: "Component 3",
        subComponent: "Sub-Component 2",
        wfpItem: "Item 2",
        physical: "1200",
        financial: "8000",
        verificationStatus: "Pending",
        action: "View"
      },
      {
        majorComponent: "Component 4",
        subComponent: "Sub-Component 2",
        wfpItem: "Item 2",
        physical: "1200",
        financial: "8000",
        verificationStatus: "Pending",
        action: "View"
        },
        {
          majorComponent: "Component 62",
          subComponent: "Sub-Component 2",
          wfpItem: "Item 2",
          physical: "1200",
          financial: "8000",
          verificationStatus: "Pending",
          action: "View"
        },
        {
          majorComponent: "Component 7",
          subComponent: "Sub-Component 2",
          wfpItem: "Item 2",
          physical: "1200",
          financial: "8000",
          verificationStatus: "Pending",
          action: "View"
          },
          {
            majorComponent: "Component 37",
            subComponent: "Sub-Component 2",
            wfpItem: "Item 2",
            physical: "1200",
            financial: "8000",
            verificationStatus: "Pending",
            action: "View"
          },
          {
            majorComponent: "Component 32",
            subComponent: "Sub-Component 2",
            wfpItem: "Item 2",
            physical: "1200",
            financial: "8000",
            verificationStatus: "Pending",
            action: "View"
            },
            {
              majorComponent: "Component 21",
              subComponent: "Sub-Component 2",
              wfpItem: "Item 2",
              physical: "1200",
              financial: "8000",
              verificationStatus: "Pending",
              action: "View"
            },
            {
              majorComponent: "Component 5",
              subComponent: "Sub-Component 2",
              wfpItem: "Item 2",
              physical: "1200",
              financial: "8000",
              verificationStatus: "Pending",
              action: "View"
              },
              {
                majorComponent: "Component 12",
                subComponent: "Sub-Component 2",
                wfpItem: "Item 2",
                physical: "1200",
                financial: "8000",
                verificationStatus: "Pending",
                action: "View"
              },
]

export type WPFDATA = {
    majorComponent: string;
    subComponent: string;
    wfpItem: string;
    physical: string;
    financial: string
    verificationStatus: string;
    action: string;
  };
    
  export const columns: ColumnDef<WPFDATA>[] = [
    {
      accessorKey: "majorComponent",
      header: "Major Component",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("majorComponent")}</div>
      ),
    },
    {
      accessorKey: "subComponent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sub-Component
            <RiArrowUpDownFill className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("subComponent")}</div>,
    },
    {
      accessorKey: "wfpItem",
      header: () => <div>WFP Item / Deliverables</div>,
      cell: ({ row }) => {
        return (
          <div>
            {row.getValue("wfpItem")}
          </div>
        );
      },
    },
    {
      id: "physical",
      header: "Physical",
      columns: [
        { accessorKey: "target", header: "Target" },
        { accessorKey: "actual", header: "Actual" },
        { accessorKey: "accomplishment", header: "Accom.%" },
      ],
    },
    {
      id: "financial",
      header: "Financial",
      columns: [
        { accessorKey: "target", header: "Target" },
        { accessorKey: "actual", header: "Actual" },
        { accessorKey: "accomplishment", header: "Accom.%" },
      ],
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button variant={'outline'} className="text-center">{row.getValue("action")}</Button>
      ),
    },
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
          placeholder="Filter Major Component..."
          value={(table.getColumn("majorComponent")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("majorComponent")?.setFilterValue(event.target.value)
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
              <IoMdAdd/> Add 
            </Button>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
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
 
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="border text-center">
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
