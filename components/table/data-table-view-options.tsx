"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useEffect } from "react"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {

  // table.getAllColumns().forEach((column) => {
  //   if (column.id === "user_id") {
  //     column.toggleVisibility(false);
  //   }
  // });
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit grid grid-cols-2 overflow-y-auto">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )
    .map((column) => {
      return (
        <DropdownMenuCheckboxItem
          key={column.id}
          className="capitalize cursor-pointer"
          checked={column.getIsVisible()}
          onCheckedChange={(value) => {column.toggleVisibility(value)}}
        >
          {column.id == "userName"? "Author": column.id}
        </DropdownMenuCheckboxItem>
      );
      
    })}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}