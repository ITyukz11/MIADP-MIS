"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { Badge } from "../../../ui/badge";
import { FaUserCircle } from "react-icons/fa";
import { UserType } from "@/types/users/userType";
import { DataTableRowActions } from "./data-table-row-actions";

export const userColumns: ColumnDef<UserType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {

      return (
        <div
          className="max-w-[500px] truncate font-medium cursor-default flex flex-row items-center"
        >
          <FaUserCircle className="h-5 w-5 mr-2 shrink-0" />

          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {row.getValue("name")}
            </p>
            <p className="text-bold text-xs text-gray-500">
              {row.original.email}
            </p>
          </div>
        </div>
      );
    },
  },
  
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      const dateSeparated = row.original.dateSeparated as string | null;

      console.log("isActive: ", isActive)
      return (
        <div className="flex flex-col">
          <Badge
            className={`w-fit ${isActive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
          >
            {isActive ? "Yes" : "No"}
          </Badge>
          {!isActive && dateSeparated && (
            <span className="text-xs text-muted-foreground mt-1">
              {new Date(dateSeparated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "component",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Component" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <p className="text-bold text-sm capitalize">
            {row.getValue("component")}
          </p>
          <p className="text-bold text-xs text-gray-500">
            {row.original.unit}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("region")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("position")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const formattedDate = createdAt.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions rowData={row.original} />,
  },
];
