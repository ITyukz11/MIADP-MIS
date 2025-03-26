import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import GlobalError from "../error";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import FloatingAIChat from "@/components/FloatingAIChat";
import ReduxProvider from "@/components/ReduxProvider";
import { CalendarOfActivityFilterProvider } from "@/components/context/FilterRegionContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteSideBar } from "./_components/site-aside/side-nav";
import { SiteHeader } from "./_components/site-header/site-header";
import { SiteFooter } from "./_components/site-footer/site-footer";
import { AuthProvider } from "@/lib/SessionProvider";
import { CalendarOfActivityMultiFilterProvider } from "@/components/context/MultiFilterActivitiesContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  //const user = await getCurrentUser()
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || "/auth/login");
  }

  // Default value for typeOfActivity
  const initialFilter = {
    region: "All",
    typeOfActivity: "WFP Activities", // Default value or set as needed
    unit: "All",
    status: "All",
    wfpYear: "All",
    month: "All",
    type: "All",
  };
  const initialMultiFilter = {
    region: ["All"],
    typeOfActivity: ["WFP Activities"], // Default value or set as needed
    unit: ["All"],
    status: ["All"],
    wfpYear: ["All"],
    month: ["All"],
    type: ["All"],
  };
  // console.log(
  //   "session.user.verificationAnswer:",
  //   session.user.verificationAnswer
  // );
  return (
    <ReduxProvider>
      <AuthProvider>
        <SidebarProvider>
          <CalendarOfActivityFilterProvider initialFilter={initialFilter}>
            <CalendarOfActivityMultiFilterProvider
              initialMultiFilter={initialMultiFilter}
            >
              <ErrorBoundary errorComponent={GlobalError}>
                {/* Sidebar */}
                <SiteSideBar />

                {/* Main Content */}
                <div className="flex flex-col flex-1">
                  <main className="dark:bg-black bg-[#F1F5F9] flex flex-col flex-1 w-full relative">
                    {/* Adjusted SiteHeader */}
                    <SiteHeader />
                    <div className="p-4 overflow-x-hidden">{children}</div>
                  </main>
                  <FloatingAIChat />
                  <SiteFooter />
                  {!session.user.verificationAnswer && (
                    <>
                      {/* <SecurityQuestionDialog open={!session.user.verificationAnswer}/> */}
                    </>
                  )}
                </div>
              </ErrorBoundary>
            </CalendarOfActivityMultiFilterProvider>
          </CalendarOfActivityFilterProvider>
        </SidebarProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
