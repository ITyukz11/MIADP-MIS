'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import MajorOrIndividualDialog from './major-or-individual-dialog'
import CalendarFormDialog from './calendar-form-dialog'
import { useDispatch, useSelector } from '@/app/store/store'
// import { useActivitiesData } from '@/lib/calendar-of-activity/useActivitiesDataHook'
// import { setActivitiesData, setActivityError, setActivityLoading } from '@/app/store/activityReducer'
import { Calendar, RefreshCw, TableIcon } from 'lucide-react'
import { Label } from '@radix-ui/react-label'
import { Card, CardContent } from '@/components/ui/card'
import { ViewMySchedDialog } from './view-my-sched-dialog'
import { ViewMyParticipatedSchedDialog } from './view-participated-activity-dialog'
import { FaPlusCircle } from 'react-icons/fa'
import { TbReportAnalytics } from 'react-icons/tb'
import { fetchActivitiesData } from '@/app/store/activityAction'

interface ActivitiesLayoutProps {
  children: React.ReactNode
}

export default function ActivitiesLayout({ children }: ActivitiesLayoutProps) {
  const [planningActivityOpen, setPlanningActivityOpen] = useState(false)
  const [calendarFormOpen, setCalendarFormOpen] = useState(false)
  const [individualActivity, setIndividualActivity] = useState(false)


  const handleSetIndividualActivity = (isIndividual: boolean) => {
    // Logic to handle setting individual activity state or any other actions
    setIndividualActivity(isIndividual)
  };

  const dispatch = useDispatch();
  const { activitiesData, activityLoading, activityError } = useSelector((state) => state.activity);

  useEffect(() => {
    if (activitiesData.length === 0) {
      dispatch(fetchActivitiesData());
    }
  }, [dispatch, activitiesData.length]);


  return (
    <div className="xs:container space-y-2">
      <div className='flex flex-row flex-wrap justify-center gap-2 md:justify-between'>
        <div className='flex flex-col'>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight">Calendar of Activities</h2>
          <Label className='text-xs sm:text-sm text-muted-foreground'>
            Explore and manage your scheduled activities with ease. This calendar provides a comprehensive view of all planned activities, allowing you to stay organized and efficient.
          </Label>
          {activityError && <Label className='text-destructive'>{activityError}</Label>}
        </div>
        <Card className='flex flex-row gap-2 w-full shadow-none'>
          <CardContent className='flex items-center justify-center md:justify-between gap-2 w-full p-4 flex-wrap'>
            <div className='flex flex-wrap justify-center md:justify-start sm:flex-row gap-2 '>
              <Button
                variant="default"
                className='flex flex-row items-center gap-1 justify-center text-xs lg:text-sm'
                onClick={() => setPlanningActivityOpen(true)}><FaPlusCircle size={18} className='shrink-0' /> Create new activity</Button>
              <ViewMySchedDialog />
              <ViewMyParticipatedSchedDialog />
            </div>
            <div className='flex sm:flex-row gap-2 flex-wrap justify-center sm:justify-end'>
              <Link href="/activities" className={cn(buttonVariants({ variant: 'secondary' }), "rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm")}>
                <TableIcon size={22} /> Table
              </Link>
              <Link href="/activities/calendar"
                className={cn(buttonVariants({ variant: 'secondary' }), "rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm")}>
                <Calendar size={22} /> Calendar
              </Link>
              <Link href="/activities/report" className={cn(buttonVariants({ variant: 'secondary' }), "rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm")}>
                <TbReportAnalytics size={25} />  Report
              </Link>
              <Button
                className='flex flex-row items-center gap-1 justify-center text-xs lg:text-sm'
                onClick={() => dispatch(fetchActivitiesData())}
                disabled={activityLoading}
              >
                <RefreshCw className={activityLoading ? 'animate-spin' : ''} size={20} /> Refresh
              </Button>
            </div>


          </CardContent>
        </Card>
      </div>

      {children}
      <MajorOrIndividualDialog
        open={planningActivityOpen}
        setClose={() => setPlanningActivityOpen(!planningActivityOpen)}
        setCalendarFormOpen={() => setCalendarFormOpen(true)}
        setIndividualActivity={handleSetIndividualActivity}
      />

      <CalendarFormDialog open={calendarFormOpen}
        setClose={() => setCalendarFormOpen(false)}
        individualActivity_={individualActivity} />
    </div>
  )
}

