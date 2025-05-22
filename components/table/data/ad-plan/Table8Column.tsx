import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { Badge } from "../../../ui/badge";
import { ColumnMeta } from "@/types/table/table";

export const AdPlanTable8Column: ColumnDef<any>[] = [
  // {
  //   accessorKey: "id", // IMPORTANT FOR UPDATING RECORDS
  // },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    cell: ({ row }) => <Badge>{row.getValue("region")}</Badge>,
    maxSize: 150,
    minSize: 50,
  },
  {
    accessorKey: "ancestralDomain",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ancestral Domain" />
    ),
    cell: ({ row }) => (
      <Badge
        className="font-medium cursor-default shadow-sm z-10 dark:text-white hover:bg-gray-600 bg-gray-600 text-white text-center"
        variant={"outline"}
      >
        {row.getValue("ancestralDomain")}
      </Badge>
    ),
    maxSize: 200,
    minSize: 100,
  },
  {
    accessorKey: "lgu",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LGU" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">{row.getValue("lgu")}</span>
    ),
    maxSize: 250,
    minSize: 100,
  },

  {
    accessorKey: "commodities",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commodities" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("commodities")}
      </span>
    ),
    maxSize: 250,
    minSize: 100,
  },
  {
    accessorKey: "infraEntrep",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Infra/Entrep" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("infraEntrep")}
      </span>
    ),
    maxSize: 250,
    minSize: 100,
  },
  {
    accessorKey: "subproject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subproject" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("subproject")}
      </span>
    ),
    maxSize: 250,
    minSize: 100,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("location")}
      </span>
    ),
    maxSize: 250,
    minSize: 100,
  },
  {
    accessorKey: "typeOfSP",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type of SP" />
    ),
    cell: ({ row }) => (
      <span className="font-medium cursor-default">
        {row.getValue("typeOfSP")}
      </span>
    ),
    maxSize: 100,
    minSize: 0,
  },
  {
    accessorKey: "validated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Validated" />
    ),
    cell: ({ row }) => (
      <Badge
        className={`font-medium cursor-default ${
          row.getValue("validated") ? "bg-green-600" : "bg-red-600"
        } text-white`}
      >
        {row.getValue("validated") ? "Yes" : "No"}
      </Badge>
    ),
    maxSize: 100,
    minSize: 50,
  },
  {
    accessorKey: "conceptNote",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Concept Note" />
    ),
    cell: ({ row }) => (
      <Badge
        className={`font-medium cursor-default ${
          row.getValue("conceptNote") ? "bg-green-600" : "bg-red-600"
        } text-white`}
      >
        {row.getValue("conceptNote") ? "Yes" : "No"}
      </Badge>
    ),
    maxSize: 100,
    minSize: 50,
  },
];
