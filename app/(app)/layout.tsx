import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { ErrorBoundary } from "next/dist/client/components/error-boundary"
import GlobalError from "../error"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import FloatingAIChat from "@/components/FloatingAIChat"
import { UsersProvider } from "@/components/context/UsersContext"
import { CurrentUserProvider } from "@/components/context/CurrentUserContext"
import { CalendarOfActivityProvider } from "@/components/context/CalendarOfActivityContext"

interface AppLayoutProps {
    children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
    //const user = await getCurrentUser()
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect(authOptions?.pages?.signIn || "/auth/login")
    }

    return (
        <CurrentUserProvider initialUser={session.user as any}>
            <UsersProvider>
                <CalendarOfActivityProvider>
                    <div className="flex flex-col">
                        <ErrorBoundary errorComponent={GlobalError}>
                            <SiteHeader />
                            <main className="flex-1 mt-4 mb-auto h-full min-w-[320px]">{children}</main>
                            <FloatingAIChat />
                            <SiteFooter />
                        </ErrorBoundary>
                    </div>
                </CalendarOfActivityProvider>
            </UsersProvider>
        </CurrentUserProvider>

    )
}