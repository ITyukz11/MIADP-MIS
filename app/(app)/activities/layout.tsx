'use client'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'



interface ActivitiesLayoutProps {
  children: React.ReactNode
}

export default function ActivitiesLayout({ children }: ActivitiesLayoutProps) {
  return (
    <div className="container relative">
            <PageHeader>
        <PageHeaderHeading className="hidden md:block">
          Welcome to the Calendar of Activities
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">Activity Calendar</PageHeaderHeading>
        <PageHeaderDescription>
          Explore and manage your scheduled activities with ease. This calendar provides a comprehensive view of all planned activities, allowing you to stay organized and efficient.
        </PageHeaderDescription>
        <PageActions>
          <Link href="/activities/calendar" className={cn(buttonVariants(), "rounded-[6px]")}>
            Show Calendar
          </Link>
          <Link
            href="/plan-activities"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-[6px]"
            )}
          >
            Start Planning Activities
          </Link>
        </PageActions>
      </PageHeader>

      {children}
    </div>
  )
}