"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { GrUserAdmin } from "react-icons/gr";
import { Separator } from "@/components/ui/separator";
import { ChevronUp } from "lucide-react";
import {
  activityLinks,
  managementLinks,
  navLinks,
} from "../site-header/nav-links";

import { TbActivity } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";

export const SiteSideBar = () => {
  const pathname = usePathname();
  const { data: currentUser } = useSession();

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
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href ? true : false}
                  >
                    <Link
                      href={link.href}
                      className={cn("hover:text-popover-foreground", {
                        "text-popover-foreground": pathname === link.href,
                      })}
                    >
                      <link.icon />
                      <span>{link.text}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Collapsible className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <TbActivity /> Activities
                    <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent
                  className={cn(
                    "outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                  )}
                >
                  <SidebarMenuSub>
                    {activityLinks.map((link, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === link.href ? true : false}
                        >
                          <Link
                            href={link.href}
                            className="hover:text-popover-foreground "
                          >
                            <link.icon />
                            <span>{link.text}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        {currentUser?.user.role == "ADMIN" && (
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
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === link.href ? true : false}
                      >
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
          </SidebarGroup>
        )}
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
