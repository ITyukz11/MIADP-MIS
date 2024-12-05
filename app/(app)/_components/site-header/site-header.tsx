'use client'
import { NotificationDropdown } from "./notification-dropdown";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { DropDownMenuComponent } from "./drop-down-menu";

export const SiteHeader = () => {
  return (
    // <header className="sticky top-0 z-50 border-b-2 border-border/80 backdrop-blur dark:supports-[backdrop-filter]:bg-[#18181B]/60 supports-[backdrop-filter]:bg-[#FAFAFA]/60">
    <header className="sticky top-0 z-50 border-b-2 border-border/80 backdrop-blur dark:bg-[#020817] supports-[backdrop-filter]:bg-white/60">
     <div className="px-2 sm:pr-8 flex h-14 w-full items-center gap-2">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center gap-6 ml-auto">
            <NotificationDropdown />
            <DropDownMenuComponent />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};
