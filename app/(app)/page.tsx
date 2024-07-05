'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"
import { Overview } from "@/components/dashboard/overview"
import { Announcements } from "@/components/dashboard/announcements"
import { Label } from "@/components/ui/label"


export default function AnnouncementsPage() {
  return (
    <div className="">
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
            <Label className='text-xs text-gray-500'>
              ** All data here are still not real **
            </Label>
            <div className="flex items-center space-x-2 flex-wrap justify-center">
              <div className="hidden sm:block">
                {/* <CalendarDateRangePicker /> */}
              </div>
              <Button>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="hidden sm:flex w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Announcements
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Target Accomplishments
                    </CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>

                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">47%</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Accomplishments
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active ADAIF
                    </CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                      <path d="M20 7v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2zM10 4h4" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="9" y1="10" x2="9" y2="14" />
                      <line x1="15" y1="10" x2="15" y2="14" />
                    </svg>

                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+5</div>
                    <p className="text-xs text-muted-foreground">
                      +2 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:h-[500px]">
                <Card className="shadow-lg h-full lg:col-span-3 md:col-span-2">
                  <CardHeader>
                    <CardTitle>Activities Type Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2 overflow-hidden">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="h-full shadow-lg overflow-hidden overflow-y-auto scrollbar-thin lg:col-span-1 md:col-span-1">
                  <CardHeader>
                    <CardTitle>Announcements</CardTitle>
                    <CardDescription>
                      10 new announcements today.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Announcements />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
