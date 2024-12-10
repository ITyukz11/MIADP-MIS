'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/components/context/CurrentUserContext";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FaFacebook, FaFrog } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { Separator } from "@/components/ui/separator";
import { ChevronUp, User2 } from "lucide-react";
import { managementLinks, navLinks } from "../site-header/nav-links";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const SiteSideBar = () => {
  const pathname = usePathname();
  const { currentUser } = useCurrentUser();
  // Use `useSidebar` to access the sidebar state
  const { open } = useSidebar();

  return (
    <Sidebar variant="sidebar" className="shadow-lg z-50">
      {/* Sidebar Header */}
      <SidebarHeader>
        <div className="flex h-fit w-full justify-center border-b">
          <Image
            className="shrink-0"
            src="/miadp-official-logo.png"
            alt="MIADP Official transparent logo"
            width={200}
            height={100}
          />
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((link, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild isActive={pathname === link.href ? true : false}>
                    <Link href={link.href}>
                      <link.icon />
                      <span>{link.text}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        {currentUser?.role == "ADMIN" &&
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <Collapsible defaultOpen className="group/collapsible">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <GrUserAdmin /> Management
                  <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {managementLinks.map((link, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild isActive={pathname === link.href ? true : false}>
                        <Link href={link.href}>
                          <link.icon />
                          <span>{link.text}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>}
      </SidebarContent>

      <Separator />
      {/* Sidebar Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="text-center">
            <Label className="font-bold text-xl">&copy; MIADP 2024</Label>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
