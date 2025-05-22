import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const KoboIpoValidationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "validation_process_001/name_ipo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IPO Name" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("validation_process_001/name_ipo")}
      </span>
    ),
    maxSize: 250,
    minSize: 100,
  },
  {
    accessorKey: "validation_process_001/name_ad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AD Name" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("validation_process_001/name_ad")}
      </span>
    ),
    maxSize: 250,
    minSize: 100,
  },
  {
    accessorKey: "validation_process_001/cadt_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CADT No." />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("validation_process_001/cadt_no")}
      </Badge>
    ),
    maxSize: 150,
    minSize: 80,
  },
  {
    accessorKey: "validation_process_001/office_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Office Address" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("validation_process_001/office_address")}
      </span>
    ),
    maxSize: 300,
    minSize: 150,
  },
  {
    accessorKey: "validation_process_001/location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("validation_process_001/location")}
      </span>
    ),
    maxSize: 200,
    minSize: 100,
  },
  {
    accessorKey: "validation_process_001/potential_enterprise_projects",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Potential Enterprise Projects"
      />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("validation_process_001/potential_enterprise_projects")}
      </span>
    ),
    maxSize: 250,
    minSize: 100,
  },
  {
    accessorKey: "validation_process_001/priority_commodity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority Commodity" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("validation_process_001/priority_commodity")}
      </Badge>
    ),
    maxSize: 200,
    minSize: 100,
  },
  {
    accessorKey: "validation_process_001/prioritized_enterprise",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioritized Enterprise" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("validation_process_001/prioritized_enterprise")}
      </span>
    ),
    maxSize: 250,
    minSize: 100,
  },
  {
    accessorKey: "validation_process_001/validation_conducted_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Validated By" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("validation_process_001/validation_conducted_by")}
      </span>
    ),
    maxSize: 200,
    minSize: 100,
  },
  {
    accessorKey: "validation_process_001/date_conducted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Conducted" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("validation_process_001/date_conducted")}
      </span>
    ),
    maxSize: 150,
    minSize: 100,
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="p-1 max-w-[500px] truncate font-medium cursor-default">
          <Link href={`/component-3/ipo-validation/${row.original._id}`}>
            View
          </Link>
        </span>
      </div>
    ),
  },
];
