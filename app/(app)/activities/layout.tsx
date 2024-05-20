'use client'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'
import CalendarFormDialog from './calendar-form-dialog'



interface ActivitiesLayoutProps {
  children: React.ReactNode
}

export default function ActivitiesLayout({ children }: ActivitiesLayoutProps) {
  const [calendarFormOpen, setCalendarFormOpen] = useState(false)
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
     

          <Button variant='outline'onClick={() => setCalendarFormOpen(true)}>Start planning activity</Button>
          <Link href="/activities" className={cn(buttonVariants(), "rounded-[6px]")}>
            Table
          </Link>
        </PageActions>
      </PageHeader>

      {children}
      <CalendarFormDialog open={calendarFormOpen} 
                                setClose={() => setCalendarFormOpen(false)}/>
    </div>
  )
}