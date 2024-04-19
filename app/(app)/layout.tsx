import RequireAuth from "@/components/require-auth"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

interface AppLayoutProps {
    children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <>
        <RequireAuth>
         <SiteHeader />
            <main className="flex-1 mt-4">{children}</main>
            <SiteFooter />
        </RequireAuth>
        </>
    )
}