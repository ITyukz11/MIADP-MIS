"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { priorities, statuses } from "./data/data"
import { RegisterSchema } from "@/schemas"
import { z } from "zod"
import { startTransition, useEffect, useState, useTransition } from "react"
import { register } from "@/actions/register"
import { toast } from "../ui/use-toast"
import { ToastAction } from "../ui/toast"
import { DialogApprovePendingUsers } from "../admin/dialog-accounts"


interface DataTableToolbarProps<TData> {
  data: TData[]
  table: Table<TData>
  selectedRows: Record<string, boolean>; // Define prop for selected rows as an object with boolean values
}

export function DataTableToolbar<TData>({
  data,
  table,
  selectedRows,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false); // Initialize loading state

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [approvedPendingUsersData, setApprovedPendingUsersData] = useState<TData[]>([]);

  const [filterInput, setFilterInput] = useState<string>('');


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
        {/* <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}
        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
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
          approvedPendingUsersData={approvedPendingUsersData as Array<TData & {  id?: number, name?:string, email?:string,region?:string, password?:string}>}
          disable={Object.keys(selectedRows).length > 0 ?false : true}
        />

        {/* <Button size="sm" onClick={submit}>Approved</Button> */}
      </div>
    </div>
  )
}