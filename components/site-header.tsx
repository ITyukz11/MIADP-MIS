'use client'
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";
import { DropDownMenuComponent } from "./drop-down-menu";
import { MdNotifications } from "react-icons/md";
import { useCurrentUser } from "./context/CurrentUserContext";
import { Label } from "./ui/label";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { NotificationDropdown } from "./notification-dropdown";

export const SiteHeader = () => {
    const { currentUser } = useCurrentUser();

    // useEffect(() => {
    //     const socket = io('http://localhost:3001');
    //     socket.on('connect', () => {
    //       console.log('Connected to WebSocket server');
    //     });
    //     return () => {
    //       socket.disconnect();
    //     };
    //   }, []);

    return (
        <header className="sticky top-0 overflow-hidden z-50 w-full border-b-2 border-border/80 bg-black backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-2 sm:px-8 w-full flex h-14 w-min-[320px] items-center gap-2">
                <MainNav />
                <MobileNav />
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                    </div>
                    <nav className="flex items-center gap-5 ml-auto">
                        <NotificationDropdown />
                        {/* <NotificationLottieAnimation
                            width={25}
                            height={25}
                            loop={false}
                            autoplay={false}
                        /> */}
                        <Label> Welcome back {currentUser?.name?.split(' ')[0]}</Label>
                        <DropDownMenuComponent />
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}