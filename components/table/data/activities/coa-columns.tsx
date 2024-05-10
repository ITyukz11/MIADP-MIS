import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { DataTableRowActions } from "../../data-table-row-actions";
import { Badge } from "../../../ui/badge";
import { Activity } from "./schema";

export const columns: ColumnDef<Activity>[] = [
  {
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
  },
  {
    accessorKey: "coa_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="COA ID" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("coa_id")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "activity_description",
   // enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity Description" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("activity_description")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("type")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "planned_from_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Planned From Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("planned_from_date")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "secondary" | "outline" | "destructive" | "default" | null = null;

      switch (status?.toLowerCase()) {
        case "conducted":
          variant = "secondary";
          break;
        case "postponed":
          variant = "outline";
          break;
        case "re-scheduled":
        case "cancelled":
          variant = "destructive";
          break;
        default:
          variant = "default";
          break;
      }

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            <Badge variant={variant}>{status}</Badge>
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "planned_to_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Planned To Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("planned_to_date")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "target_participant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target Participant" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("target_participant")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("location")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "remarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remarks" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("remarks")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("user_id")}
        </span>
      </div>
    ),
    
  },
];
