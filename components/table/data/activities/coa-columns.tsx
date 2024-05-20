import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { DataTableRowActions } from "../pending-users/data-table-row-actions";
import { Badge } from "../../../ui/badge";
import { CalendarOfActivityType } from '@/schemas/calendar-of-activity';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const time = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  return `${time}`;
};

export const columns: ColumnDef<CalendarOfActivityType>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="COA ID" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("id")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "authorizeOther",
   // enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Authorized" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("authorizeOther")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "activityTitle",
   // enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity Title" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("activityTitle")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "activityDescription",
   // enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity Description" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("activityDescription")}
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
    accessorKey: "targetParticipant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target Participant" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("targetParticipant")}
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
    accessorKey: "dateFrom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Planned From Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {formatDate(row.getValue("dateFrom"))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "dateTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Planned To Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {formatDate(row.getValue("dateTo"))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "timeStart",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time Start" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {formatTime(row.getValue("timeStart"))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "timeEnd",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time End" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {formatTime(row.getValue("timeEnd"))}
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
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("userName")}
        </span>
      </div>
    ),
    
  },
];
