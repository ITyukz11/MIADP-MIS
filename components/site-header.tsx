'use client'
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";
import { useSession } from "next-auth/react";
import { DropDownMenuComponent } from "./drop-down-menu";
import { MdNotifications } from "react-icons/md";
import { getCurrentUser } from "@/lib/session";

interface SiteHeaderProps{
    currentUser: string
}
export const SiteHeader=({currentUser}:SiteHeaderProps) =>{


    return (
        <header className="sticky top-0 z-50 w-full border-b-2 border-border/80 bg-black backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center gap-2">
                <MainNav />
                <MobileNav />
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                    </div>
                    <nav className="flex items-center gap-2">
                        <MdNotifications/>
                            Welcome back {currentUser}
                        <DropDownMenuComponent/>
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}