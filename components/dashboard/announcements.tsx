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
  { id: 3, avatar: 'B', user: 'Butz Muyco', title: 'MOA', content: 'Components and Support Unit Head' },
  { id: 4, avatar: 'NF', user: 'Nelson Faustino', title: 'Calendar of Activity', content: '' },
  { id: 5, avatar: 'NF', user: 'Carlo', title: 'GIS Memo', content: 'Upcoming memo needs to be address' },
  { id: 6, avatar: 'JM', user: 'Juan Miguel', title: 'Event', content: 'Upcoming training session on June 20th' },
  { id: 7, avatar: 'RL', user: 'Rosa Lopez', title: 'Notice', content: 'Office closed on public holidays' },
  { id: 8, avatar: 'ST', user: 'Sammy Tan', title: 'Update', content: 'New guidelines for remote work' },
  { id: 9, avatar: 'AC', user: 'Arlene Cruz', title: 'Announcement', content: 'Annual team-building event next month' },
  { id: 10, avatar: 'LM', user: 'Luis Mendoza', title: 'News', content: 'New health and safety protocols' }
];

export function Announcements() {
  return (
    <div className="space-y-8 overflow-y-auto h-full">
      {dummyAnnouncements.map((announcement) => (
        <div key={announcement.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              {/* Replace the src with the actual path */}
              <AvatarImage alt="Avatar" />
              <AvatarFallback>{announcement.avatar}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-semi-bold leading-none">{announcement.title}</p>
              <p className="text-sm text-muted-foreground">{announcement.content}</p>
              <p className="text-sm text-muted-foreground">Uploader: {announcement.user}</p>
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
