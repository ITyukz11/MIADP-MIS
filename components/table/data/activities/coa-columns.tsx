import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { DataTableRowActions } from "../pending-users/data-table-row-actions";
import { Badge } from "../../../ui/badge";
import { CalendarOfActivityType } from '@/schemas/calendar-of-activity';

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
      <DataTableColumnHeader column={column} title="Planned To Date" />
    ),
    cell: ({ row }) => {
      const dateRange = row.getValue("dateRange") as { startDate: string, endDate: string }[];
  
      // Check if dateRange has data
      if (dateRange && dateRange.length > 0) {
        // Format the dateRange
        const formattedDateRange = dateRange.map(range => {
          const startDate = new Date(range.startDate.replace(/\//g, '-')).toISOString().slice(0, 10);
          const endDate = new Date(range.endDate.replace(/\//g, '-')).toISOString().slice(0, 10);
          return `${startDate} to ${endDate}`;
        }).join(", "); // Join multiple date ranges with a comma if there are multiple ranges
  
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {formattedDateRange}
            </span>
          </div>
        );
      }
  
      // If dateRange has no data, don't display dateFrom
      return null;
    },
  },
  {
    accessorKey: "dateRange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Planned From Date" />
    ),
    cell: ({ row }) => {
      const dateRange = row.getValue("dateRange") as { startDate: string }[];
  
      // Assuming you want to display start and end dates in 'yyyy-mm-dd' format
      const formattedDateRange = dateRange.map(range => {
        const startDate = new Date(range.startDate).toISOString().slice(0, 10);
        return `${startDate}`;
      }).join(", "); // Join multiple date ranges with a comma if there are multiple ranges
  
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedDateRange}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dateRange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Planned To Date" />
    ),
    cell: ({ row }) => {
      const dateRange = row.getValue("dateRange") as {endDate: string }[];
  
      // Assuming you want to display start and end dates in 'yyyy-mm-dd' format
      const formattedDateRange = dateRange.map(range => {
        const endDate = new Date(range.endDate).toISOString().slice(0, 10);
        return `${endDate}`;
      }).join(", "); // Join multiple date ranges with a comma if there are multiple ranges
  
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedDateRange}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "timeRange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time Range" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("timeRange")}
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
