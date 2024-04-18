import { Button } from "./ui/button";
import { IoMdNotifications } from "react-icons/io";
import { TbCloudDataConnection } from "react-icons/tb";
import { Label } from "./ui/label";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";



export function SiteHeader() {

    const menuStyle = {

    }
    return (
        <header className="sticky top-0 z-50 w-full border-b-2 border-border/80 bg-black backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center gap-2">
                <MainNav />
                <MobileNav />

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                    </div>
                    <nav className="flex items-center gap-2">
                        <IoMdNotifications />
                        <Button variant='outline'>Logout</Button>
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}