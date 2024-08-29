import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { DocumentIncomingRouteType } from '@/types/document-tracking/correspondence-documents';
import { Button } from '@/components/ui/button';
import { History, Route, RouteIcon, View } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MdPreview } from 'react-icons/md';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '../activities/coa-columns';
import { getUserById } from '@/actions/profile/getUserById';

interface DocumentColumnProps {
    onRouteClick?: (row: any) => void;
    onPreviewClick?: (row: any) => void;
    onHistoryStatusClick?:(row: any) =>void;
    handleRouteReceived?: (documentId: string) => void;
}

export const incomingDocumentRouteColumn = ({ onRouteClick, onPreviewClick, onHistoryStatusClick, handleRouteReceived }: DocumentColumnProps): ColumnDef<DocumentIncomingRouteType>[] => [
    {
        accessorKey: "subject",
        // enableHiding: false,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Subject" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium cursor-default gap-1 flex">
                    {row.getValue("subject")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "purpose",
        // enableHiding: false,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Purpose" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium cursor-default">
                    <Badge variant="secondary">{row.getValue("purpose")}</Badge>
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
        accessorKey: "doctrackDocumentIncomingRouteStatus",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const statusArray = row.getValue("doctrackDocumentIncomingRouteStatus") as Array<{ status: string }>;
            const latestStatus = statusArray.length > 0 ? statusArray[statusArray.length - 1].status : "No status";
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium cursor-default">
                        <Badge>{latestStatus}</Badge>
                    </span>
                </div>
            );
        },
    },

    {
        accessorKey: "action",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Action" />
        ),
        cell: ({ row }) => {
            const statusArray = row.getValue("doctrackDocumentIncomingRouteStatus") as Array<{ status: string }>;
            const latestStatus = statusArray.length > 0 ? statusArray[statusArray.length - 1].status : "No status";

            // Check if the latest status contains "received" (case-insensitive)
            const isReceived = latestStatus.toLowerCase().includes("received");
            return (
                <div className="flex space-x-2">
                    <span className="p-1 max-w-[500px] truncate font-medium cursor-default">
                        {isReceived ?
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
                                        <DropdownMenuItem onClick={() => onHistoryStatusClick?.(row)}>
                                            <History className="mr-2 h-4 w-4" />
                                            <span>History</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            :
                            <Button onClick={() => handleRouteReceived?.(row.original.id)}>Received</Button>
                        }

                    </span>
                </div>
            )
        }
    }
];
