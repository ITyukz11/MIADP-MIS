import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { TbActivity } from 'react-icons/tb';
import { Keyboard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

type ProfileOverviewTabProps = {
  data: any
  dataLoading: boolean
  dataError: string
  OpenUnderDevDialog:()=> void
};

const ProfileOverviewTab: React.FC<ProfileOverviewTabProps> = ({ data,dataLoading,dataError,OpenUnderDevDialog }) => {
  const participantCount = data.CalendarOfActivityParticipant?.length || 0; // Count participants
  const encodedActivityCount = data.calendarOfActivities?.length || 0; // Count participants
  return (
    <Card className="w-full px-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Overview <Label className="text-destructive">{dataError}</Label></CardTitle>
        <CardDescription>
          A summary of your recent activities and participation within the MIADP MIS system.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-4">
        <Card className='hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participated Activity
            </CardTitle>
            <TbActivity className='ml-2 w-5 h-5' />
          </CardHeader>
          <CardContent onClick={OpenUnderDevDialog}>
            <div className="text-2xl font-bold">
              {dataLoading? 
              <Skeleton className='w-full h-14'/>:participantCount}
            </div>
            <p className="text-xs text-muted-foreground">
            {dataLoading? 
              '':'+20.1% from last month'}
            </p>
          </CardContent>
        </Card>
        <Card className='hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Encoded Activity
            </CardTitle>
            <Keyboard className='ml-2 w-5 h-5' />
          </CardHeader>
          <CardContent onClick={OpenUnderDevDialog}>
            <div className="text-2xl font-bold">
            {dataLoading? 
              <Skeleton className='w-full h-14'/>:encodedActivityCount}
            </div>
            <p className="text-xs text-muted-foreground">
            {dataLoading? 
              '':'+7.9% from last month'}
      
            </p>
          </CardContent>
        </Card>

      </CardContent>
    </Card>
  );
};

export default ProfileOverviewTab;
