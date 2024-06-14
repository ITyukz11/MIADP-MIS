"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { RiShoppingCart2Fill } from "react-icons/ri"
import { TbGraph } from "react-icons/tb"
import { GearIcon } from "@radix-ui/react-icons"

const FinancialMenuData: { title: string; href: string; description: string }[] = [
  {
    title: "Certificate of Availability of Fund (CAF)",
    href: "/supports",
    description:
      "Confirms fund availability for specific use.",
  },
  {
    title: "Obligations",
    href: "/supports",
    description:
      "Refer to legal or moral commitments to fulfill duties or responsibilities.",
  },
  {
    title: "Disbursements",
    href: "/supports",
    description:
      "Involve the distribution or payment of funds, typically from a designated source to recipients.",
  },
  {
    title: "Liquidations",
    href: "/supports",
    description:
      "Entail the process of converting assets into cash to settle financial obligations or debts.",
  },
]

const ProcurementMenuData: { title: string; href: string; description: string }[] = [

  {
    title: "Infrastructure Subprojects",
    href: "/supports",
    description:
      "The smaller parts of larger infrastructure initiatives.",
  },
  {
    title: "WFP-PAPs",
    href: "/supports",
    description:
      "Word Financial Plan of Project Action Plan",
  },
  {
    title: "Enterprise Subprojects",
    href: "/supports",
    description:
      "The smaller segments within broader enterprise initiatives.",
  },
]


export function NavigationMenuDemo() {
  return (
    <NavigationMenu className="flex-wrap">
      <NavigationMenuList className="flex-wrap">
      <NavigationMenuItem>
          <Link href="/supports" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            WFP Module
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem >
          <NavigationMenuTrigger className="flex gap-1"><TbGraph/> Finance Module</NavigationMenuTrigger>
          <NavigationMenuContent className="flex flex-wrap">
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {FinancialMenuData.map((data) => (
                <ListItem
                  key={data.title}
                  title={data.title}
                  href={data.href}
                >
                  {data.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex gap-1"><RiShoppingCart2Fill/>Procurement Module</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {ProcurementMenuData.map((data) => (
                <ListItem
                  key={data.title}
                  title={data.title}
                  href={data.href}
                >
                  {data.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/supports" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()+ "flex gap-1"}>
            <GearIcon/>Configuration
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
  
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
