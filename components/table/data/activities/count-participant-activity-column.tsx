import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { UserWithActivityCount } from '@/types/calendar-of-activity/calendar-of-activity';
import { Badge } from '@/components/ui/badge';

export const countParticipantActivityColumn: ColumnDef<UserWithActivityCount>[] = [

  {
    accessorKey: "name",
   // enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium cursor-default">
          <Badge>{row.original.region}</Badge> {row.getValue("name")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium cursor-default">
            {row.getValue("position")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit/Component" />
    ),
    cell: ({ row }) => {
      const unit:string = row.getValue("unit");
      const component:string = row.original.component
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium cursor-default">
            {unit ? `${component} - ${unit}` :component}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalActivities",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Activities" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium cursor-default text-lg">
         <Badge variant={'outline'} className='text-lg'>{row.getValue("totalActivities")}</Badge> 
        </span>
      </div>
    ),
  },
];
