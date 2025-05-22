import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { Badge } from "@/components/ui/badge";


export const ProcessDocReportColumns: ColumnDef<any>[] = [
  {
    accessorKey: "activityTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity Title" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("activityTitle")}
      </span>
    ),
    maxSize: 300,
    minSize: 150,
  },
  {
    accessorKey: "dateConducted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Conducted" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateConducted"));
      return (
        <span className="font-medium cursor-default">
          {date.toLocaleDateString()}
        </span>
      );
    },
    maxSize: 150,
    minSize: 100,
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    cell: ({ row }) => <Badge className="flex justify-center">{row.getValue("region")}</Badge>,
    maxSize: 120,
    minSize: 80,
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Province" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("province")}
      </span>
    ),
    maxSize: 150,
    minSize: 100,
  },
  {
    accessorKey: "WFPActivity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="WFP Activity" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("WFPActivity")}
      </span>
    ),
    maxSize: 200,
    minSize: 100,
  },
  {
    accessorKey: "preparedByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prepared By" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("preparedByName")}
      </span>
    ),
    maxSize: 200,
    minSize: 100,
  },
  {
    accessorKey: "totalParticipants",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Participants" />
    ),
    cell: ({ row }) => {
      const total =
        row.original.totalMaleIP +
        row.original.totalFemaleIP +
        row.original.totalMaleNonIP +
        row.original.totalFemaleNonIP;
      return (
        <Badge variant={'outline'}>
          {total}
        </Badge>
      );
    },
    maxSize: 100,
    minSize: 80,
  },
];
