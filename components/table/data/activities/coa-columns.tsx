import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { DataTableRowActions } from "../pending-users/data-table-row-actions";
import { Badge } from "../../../ui/badge";
// import { dateInRangeFilter } from '../../date-range-filter';
import { Activity } from "@/types/calendar-of-activity/calendar-of-activity";
import { Label } from "@/components/ui/label";
import { ColumnMeta } from "@/types/table/table";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
};

export const formatTime = (timeString: string) => {
  // Check if the timeString is already in "HH:MM" format
  const timePattern = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  if (timePattern.test(timeString)) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const amOrPm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  }

  // Attempt to parse as an ISO 8601 date string
  const date = new Date(timeString);
  if (!isNaN(date.getTime())) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  }

  // If parsing fails, return the original string
  return timeString;
};
export const getStatusColor = (status: string) => {
  switch (status) {
    case "Ongoing":
      return "bg-[#00a354]"; // Green
    case "Upcoming":
      return "bg-[#f2c018]"; // Yellow
    case "Completed":
      return "bg-[#4682B4]"; // Blue
    case "Cancelled":
      return "bg-[#b03620]"; // Red
    case "Postponed":
      return "bg-[#e38812]"; // Orange
    default:
      return "bg-[#FFFFFF]"; // Default color
  }
};

export const columns: ColumnDef<Activity>[] = [
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
    maxSize: 100,
    minSize: 0,
  },
  {
    accessorKey: "activityTitle",
    // enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity Title" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Label className="truncate font-medium cursor-default gap-1 flex">
          <Badge className="hidden sm:block">{row.original.user?.region}</Badge>
          <Badge className="hidden md:block" variant={"outline"}>
            {row.original.user?.unit
              ? row.original.user?.unit
              : row.original.user?.component}
          </Badge>
          {row.getValue("activityTitle")}
        </Label>
      </div>
    ),
    maxSize: 700,
    size: 500,
    minSize: 100,
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
    meta: { columnClasses: "hidden md:table-cell" } as ColumnMeta,
    maxSize: 400,
    minSize: 0,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium cursor-default">
          <Badge variant={"secondary"}>
            {" "}
            {row.getValue("type") === "Other"
              ? `Other-${row.original.otherType}`
              : row.getValue("type")}
          </Badge>
        </span>
      </div>
    ),
    meta: { columnClasses: "hidden md:table-cell" } as ColumnMeta,
    maxSize: 150,
    minSize: 0,
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
    meta: { columnClasses: "hidden md:table-cell" } as ColumnMeta,
    maxSize: 300,
    minSize: 0,
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
              className={`font-medium cursor-default shadow-sm z-10 dark:text-white hover:${getStatusColor(
                status
              )} ${getStatusColor(status)}`}
            >
              {status}
              {status === "Ongoing" && (
                <div className="h-3 w-3 rounded-full bg-white animate-pulse ml-1"></div>
              )}
            </Badge>
          </span>
        </div>
      );
    },
    meta: { columnClasses: "hidden sm:table-cell" } as ColumnMeta,
    maxSize: 100,
    minSize: 0,
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
    meta: { columnClasses: "hidden sm:table-cell" } as ColumnMeta,
    maxSize: 100,
    minSize: 0,
    // filterFn: dateInRangeFilter,
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
    meta: { columnClasses: "hidden md:table-cell" } as ColumnMeta,
    maxSize: 100,
    minSize: 0,
    // filterFn: dateInRangeFilter,
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
    meta: { columnClasses: "hidden md:table-cell" } as ColumnMeta,
    maxSize: 100,
    minSize: 0,
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
    meta: { columnClasses: "hidden md:table-cell" } as ColumnMeta,
    maxSize: 100,
    minSize: 0,
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
    meta: { columnClasses: "hidden md:table-cell" } as ColumnMeta,
    maxSize: 150,
    minSize: 0,
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
    meta: { columnClasses: "hidden md:table-cell" } as ColumnMeta,
    maxSize: 400,
    minSize: 0,
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
    meta: { columnClasses: "hidden md:table-cell" } as ColumnMeta,
    maxSize: 100,
    minSize: 0,
  },
];
