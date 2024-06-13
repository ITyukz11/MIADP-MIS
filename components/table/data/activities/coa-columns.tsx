import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { DataTableRowActions } from "../pending-users/data-table-row-actions";
import { Badge } from "../../../ui/badge";
import { CalendarOfActivityType } from '@/schemas/calendar-of-activity';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

export const formatTime = (timeString: string) => {
  // Check if the timeString is already in "HH:MM" format
  const timePattern = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  if (timePattern.test(timeString)) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  }

  // Attempt to parse as an ISO 8601 date string
  const date = new Date(timeString);
  if (!isNaN(date.getTime())) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  }

  // If parsing fails, return the original string
  return timeString;
};
export const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-[#00a354]'; // Green
      case 'Upcoming':
        return 'bg-[#f2c018]'; // Yellow
      case 'Completed':
        return 'bg-[#4682B4]'; // Blue
      case 'Cancelled':
        return 'bg-[#b03620]'; // Red
      case 'Postponed':
        return 'bg-[#e38812]'; // Orange
      default:
        return 'bg-[#FFFFFF]'; // Default color
    }
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
        <Badge variant='outline'> {row.getValue("type")}</Badge>
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
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
      // let variant: "secondary" | "outline" | "destructive" | "default" | null = null;
      
      return (
        <div className="flex space-x-2">
        <span className="max-w-[500px] truncate">
          <Badge
            // variant={variant}
            className={`font-medium cursor-default shadow-sm z-10 dark:text-white hover:${
              getStatusColor(status) 
            } ${
              getStatusColor(status) 
            }`}
          >
            {status}
          </Badge>
        </span>
      </div>
      
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "dateFrom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium cursor-default">
          {formatDate(row.getValue("dateFrom"))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "dateTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium cursor-default">
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
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
        <span className="max-w-[500px] truncate font-medium cursor-default">
          {row.getValue("remarks")}
        </span>
      </div>
    ),
  },

  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium cursor-default">
          {row.getValue("userName")}
        </span>
      </div>
    ),
    
  },
];
