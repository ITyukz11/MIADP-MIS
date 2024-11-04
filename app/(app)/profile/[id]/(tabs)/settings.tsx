import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';

type ProfileSettingsTabProps = {
  data: any
  OpenUnderDevDialog:()=> void
};

const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ data, OpenUnderDevDialog}) => {

  return (
    <Card className="w-full px-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Settings</CardTitle>
        <CardDescription>
          Manage your account settings here. You can update your password and configure your security questions to enhance the protection of your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col">
        {/* Password Row */}
        <Separator />
        <div className='flex flex-row justify-between items-center dark:hover:bg-slate-900 hover:bg-slate-100 p-3 hover:cursor-pointer rounded-md'
         onClick={OpenUnderDevDialog}>
          <div className='flex flex-row w-full'>
            <Label className='font-light w-1/5 self-center'>Password</Label>
            <span className='w-4/5'>*****</span>
          </div>
          <ChevronRight />
        </div>

        {/* Security Question Row */}
        <Separator />
        <div className='flex flex-row justify-between items-center dark:hover:bg-slate-900 hover:bg-slate-100 p-3 hover:cursor-pointer rounded-md'
         onClick={OpenUnderDevDialog}>
          <div className='flex flex-row w-full'>
            <Label className='font-light w-1/5 self-center'>Security Question</Label>
            <Label className='w-4/5'>You don&apos;t have any security question...</Label>
          </div>
          <ChevronRight />
        </div>

        {/* Optional separator for styling */}
        <Separator />
      </CardContent>
    </Card>
  );
};

export default ProfileSettingsTab;
