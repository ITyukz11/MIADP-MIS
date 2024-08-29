import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { CorrespondenceDocumentType } from '@/types/document-tracking/correspondence-documents';
import { Button } from '@/components/ui/button';
import { Route, RouteIcon, View } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MdPreview } from 'react-icons/md';
import { Badge } from '@/components/ui/badge';

interface DocumentColumnProps {
    onRouteClick?: (row: any) => void;
    onPreviewClick?: (row: any) => void;
}

export const documentColumn = ({ onRouteClick, onPreviewClick }: DocumentColumnProps): ColumnDef<CorrespondenceDocumentType>[] => [
    {
        accessorKey: "subject",
        // enableHiding: false,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Subject" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium cursor-default gap-1 flex">
                <Badge>{row.original.routeType}</Badge> {row.getValue("subject")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "description",
        // enableHiding: false,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium cursor-default">
                    {row.getValue("description")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "link",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Link" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium cursor-default">
                    {row.getValue("link")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "from",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="From" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium cursor-default">
                    {row.getValue("from")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate">
                        {row.getValue("date")}
                    </span>
                </div>

            );
        },
    },
    {
        accessorKey: "encoder",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Encoder" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium cursor-default">
                    {row.getValue("encoder")}
                </span>
            </div>
        )
    },
    {
        accessorKey: "action",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Action" />
        ),
        cell: ({row}) => (
            <div className="flex space-x-2">
                <span className="p-1 max-w-[500px] truncate font-medium cursor-default">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">...</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => onRouteClick?.(row)}>
                                    <RouteIcon className="mr-2 h-4 w-4" />
                                    <span>Route</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onPreviewClick?.(row)}>
                                    <MdPreview className="mr-2 h-4 w-4" />
                                    <span>Preview</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </span>
            </div>
        )
    }
];
