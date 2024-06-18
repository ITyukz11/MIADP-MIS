import { SidebarNav } from "@/components/admin/sidebar-nav"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

const sidebarNavItems = [
    {
        title: "Account",
        href: "/admin/account",
      },
  {
    title: "Datas",
    href: "/admin",
  },

//   {
//     title: "Appearance",
//     href: "/examples/forms/appearance",
//   },
//   {
//     title: "Notifications",
//     href: "/examples/forms/notifications",
//   },
//   {
//     title: "Display",
//     href: "/examples/forms/display",
//   },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container relative">
      <div className="space-y-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Admin Settings</h2>
          <p className="text-muted-foreground">
            Manage data configurations and approve user registrations.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 w-full">{children}</div>
        </div>
      </div>
    </div>
  )
}