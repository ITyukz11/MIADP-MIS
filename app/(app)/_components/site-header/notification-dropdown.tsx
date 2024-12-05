'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns'; // To format date like "33 minutes ago"
import React from "react";
import { MdNotifications } from "react-icons/md";
import { FaCircle } from "react-icons/fa"; // Import circle icon

interface NotificationDropdownProps { }

export const NotificationDropdown = ({ }: NotificationDropdownProps) => {

  const testNotification = [
    {
      id: 1,
      isRead: false,
      message: 'Butz Muyco posted new activity for PMEU',
      createdAt: '2024-10-01T13:24:01.562Z'
    },
    {
      id: 2,
      isRead: true,
      message: 'New memorandum has been posted',
      createdAt: '2024-09-30T08:10:05.123Z'
    },
    {
      id: 3,
      isRead: false,
      message: 'Maintenance scheduled for system upgrade on 2024-10-05',
      createdAt: '2024-09-29T15:43:30.852Z'
    },
    {
      id: 4,
      isRead: false,
      message: 'Your password was successfully changed',
      createdAt: '2024-09-28T12:00:00.000Z'
    },
    {
      id: 5,
      isRead: true,
      message: 'Your profile was successfully updated',
      createdAt: '2024-09-27T09:30:45.789Z'
    },
  ];

  // Count unread notifications
  const unreadCount = testNotification.filter(notification => !notification.isRead).length;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer">
            <MdNotifications size={25} />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit p-4">
          <DropdownMenuLabel className="text-lg font-bold mb-2">Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup className="max-h-80 overflow-y-auto">
            {testNotification.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex justify-between items-start gap-2 py-2 cursor-pointer">
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p
                    className="text-xs"
                    style={{ color: notification.isRead ? 'inherit' : '#236FE8' }} // Apply the color conditionally
                  >
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notification.isRead && (
                  <FaCircle className="text-blue-500 h-3 w-3" /> // Show blue circle for unread
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <Button className="w-full mt-2" variant="outline" onClick={() => {/* handle mark all as read logic */}}>
            Mark all as read
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
