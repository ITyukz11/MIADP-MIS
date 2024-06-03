'use client'
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";
import { DropDownMenuComponent } from "./drop-down-menu";
import { MdNotifications } from "react-icons/md";
import { useCurrentUser } from "./CurrentUserContext";
import NotificationLottieAnimation from "./lottie-icon-animations/Notification";

export const SiteHeader = () => {
    const { currentUser } = useCurrentUser();
    return (
        <header className="sticky top-0 overflow-hidden z-50 w-full border-b-2 border-border/80 bg-black backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center gap-2">
                <MainNav />
                <MobileNav />
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                    </div>
                    <nav className="flex items-center gap-2">
                        {/* <MdNotifications size={25}/> */}
                        <NotificationLottieAnimation
                            width={25}
                            height={25}
                            loop={false}
                            autoplay={false}
                        />
                        Welcome back {currentUser?.name?.split(' ')[0]}
                        <DropDownMenuComponent />
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}