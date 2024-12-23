"use client"
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { SubProjectCodeType } from "@/types/subproject/subproject-type";
import { SubprojectDataTableRowActions } from "./data-table-row-actions";
import Link from "next/link";

export const subprojectColumn: ColumnDef<SubProjectCodeType>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subproject Code" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          <Link href={`subproject/${row.getValue("code")}`} className="text-[#0000EE] underline">{row.getValue("code")}</Link>
        </span>
      </div>
    ),
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("region")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "subprojectTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subproject Title" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("subprojectTitle")}
      </span>
    ),
  },
  {
    accessorKey: "component",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Component" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("component")}
      </span>
    ),
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Province" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("province")}
      </span>
    ),
  },
  {
    accessorKey: "municipality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Municipality" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("municipality")}
      </span>
    ),
  },
  {
    accessorKey: "ancestralDomainLoc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ancestral Domain Location" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("ancestralDomainLoc")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("type")}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {new Date(row.getValue("createdAt")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({row}) => (
        <div className="flex space-x-2">
            <span className="p-1 max-w-[500px] truncate font-medium cursor-default">
               <SubprojectDataTableRowActions rowData={row.original}/>
            </span>
        </div>
    )
}
];
  