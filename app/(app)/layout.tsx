import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { ErrorBoundary } from "next/dist/client/components/error-boundary"
import GlobalError from "../error"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import FloatingAIChat from "@/components/FloatingAIChat"
import { CurrentUserProvider } from "@/components/context/CurrentUserContext"
import ReduxProvider from "@/components/ReduxProvider"
import { CalendarOfActivityFilterProvider } from "@/components/context/FilterRegionContext"
import { SecurityQuestionDialog } from "@/components/dialog/security-question-dialog"

interface AppLayoutProps {
    children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
    //const user = await getCurrentUser()
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect(authOptions?.pages?.signIn || "/auth/login")
    }

    // Default value for typeOfActivity
    const initialFilter = {
        filter: session.user.region as string,
        typeOfActivity: 'WFP Activities', // Default value or set as needed
        unit: 'All'
    };
    console.log("session.user:", session.user.verificationAnswer)
    return (
        <ReduxProvider>
            <CurrentUserProvider initialUser={session.user as any}>
                <CalendarOfActivityFilterProvider initialFilter={initialFilter}>
                    <div className="flex flex-col min-w-[320px] items-center">
                        <ErrorBoundary errorComponent={GlobalError}>
                            <SiteHeader />
                            <main className="flex-1 mt-4 mb-auto h-full min-w-[320px] max-w-[2560px] w-[98vw] px-2 sm:px-8 relative">{children}</main>
                            <FloatingAIChat />
                            <SiteFooter />
                            {!session.user.verificationAnswer &&
                                <>
                                {/* <SecurityQuestionDialog open={!session.user.verificationAnswer}/> */}
                                </>}
                        </ErrorBoundary>
                    </div>
                </CalendarOfActivityFilterProvider>
            </CurrentUserProvider>
        </ReduxProvider>
    )
}