import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { UnderDevelopmentDialog } from '@/components/UnderDevDialog';
import { ProfileNameUpdateDialog } from '../(components)/updateProfile';

type PersonalInformationProps = {
  data: any
  OpenUnderDevDialog: () => void
};

const PersonalInformationTab: React.FC<PersonalInformationProps> = ({ data, OpenUnderDevDialog }) => {

  const [updateNameDialog, setUpdateNameDialog] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  const handleEdit = (field: any) => {
    alert(field)
  }
  return (
    <>
      <Card className="w-full px-4 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
          <CardDescription>
            Review and update your personal details. Click on any field to make changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {['Name', 'Email', 'Position', 'Region', 'Component'].map((field, idx) => (
            <React.Fragment key={idx}>
              <Separator />
              <div
                className='flex flex-row justify-between items-center dark:hover:bg-slate-900 hover:bg-slate-100 p-3 hover:cursor-pointer rounded-md'
                onClick={field == 'Name' ? () => { setUpdateNameDialog(!updateNameDialog); setName(data[field]) } : OpenUnderDevDialog}>
                <div className='flex flex-row w-full'>
                  <Label className='font-light w-1/5 self-center'>{field}</Label>
                  <span className='w-4/5'>{data[field.toLowerCase()]}</span>
                </div>
                <ChevronRight />
              </div>
            </React.Fragment>
          ))}

          {/* Conditionally render the Unit if component is 'Component 4' */}
          {data.component === 'Component 4' && (
            <>
              <Separator />
              <div className='flex flex-row justify-between items-center dark:hover:bg-slate-900 hover:bg-slate-100 p-3 hover:cursor-pointer rounded-md'
                onClick={OpenUnderDevDialog}>
                <div className='flex flex-row w-full'>
                  <Label className='font-light w-1/5 self-center'>Unit</Label>
                  <span className='w-4/5'>{data.unit}</span>
                </div>
                <ChevronRight />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <ProfileNameUpdateDialog open={updateNameDialog} 
                               setClose={() => setUpdateNameDialog(!updateNameDialog)} 
                               name={name}/>
    </>

  );
};

export default PersonalInformationTab;
