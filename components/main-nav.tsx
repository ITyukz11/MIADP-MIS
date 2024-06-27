'use client'
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TbCloudDataConnection } from "react-icons/tb";
import { cn } from "@/lib/utils"
import { navLinks } from "@/config/nav-links";
import { Badge } from "./ui/badge";
import { useCurrentUser } from "./context/CurrentUserContext";

export const MainNav = () => {
  const pathname = usePathname()
  // Define an array of navigation links
  const { currentUser } = useCurrentUser();

  // console.log("currentUser: ", currentUser)
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <TbCloudDataConnection className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          MMIS
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {/* Map over the array of navigation links */}
        {navLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === link.href ? "text-foreground" : "text-foreground/60"
            )}
          >
            {link.text}
          </Link>
        ))}

        {currentUser?.role == "ADMIN" &&
          <Link
            key={currentUser?.name}
            href='/admin/account'
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === '/admin/account' ? "text-foreground" : "text-foreground/60"
            )}
          >
            <Badge>Admin</Badge>
          </Link>
        }
      </nav>
    </div>
  )
}
