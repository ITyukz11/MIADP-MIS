"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TbCloudDataConnection } from "react-icons/tb";
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
       <Link href="/" className="mr-6 flex items-center space-x-2">
        <TbCloudDataConnection className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          MMIS        
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/docs" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Home
        </Link>
        <Link
          href="/reports"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/docs" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Reports
        </Link>
        <Link
          href="/supports"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/docs/components")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Supports
        </Link>
        <Link
          href="/users"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/themes")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Users
        </Link>
        <Link
          href="/settings"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/themes")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Settings
        </Link>
      </nav>
    </div>
  )
}