import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import { DownloadIcon } from '@radix-ui/react-icons';
import { MdPreview } from 'react-icons/md';
interface Announcement {
  id: number;
  avatar: string;
  user: string;
  title: string;
  content: string;
}

const dummyAnnouncements: Announcement[] = [
  { id: 1, avatar: 'YA', user: 'Yuki Abella', title: 'MOA', content: 'Newly Appointed DA Regional Director' },
  { id: 2, avatar: 'BM', user: 'Binyang Maria', title: 'Important', content: 'Reminder on DTR Cut-Off Dates' },
  { id: 3, avatar: 'B', user: 'Boots', title: 'MOA', content: 'Components and Support Unit Head' },
  // Add more announcements as needed
];

export function Announcements() {
  return (
    <div className="space-y-8">
      {dummyAnnouncements.map((announcement) => (
        <div key={announcement.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              {/* Replace the src with the actual path */}
              <AvatarImage src={`/avatars/${announcement.avatar}.png`} alt="Avatar" />
              <AvatarFallback>{announcement.avatar}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{announcement.user}</p>
              <p className="text-sm text-muted-foreground">{announcement.content}</p>
            </div>
          </div>
          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">...</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <DownloadIcon className="mr-2 h-4 w-4" />
            <span>Download File</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MdPreview className="mr-2 h-4 w-4" />
            <span>Preview</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
        </div>
      ))}
    </div>
  )
}
