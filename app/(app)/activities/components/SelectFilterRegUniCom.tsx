import { useSelector } from '@/app/store/store';
import { useCurrentUser } from '@/components/context/CurrentUserContext';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { componentOptions, regionOptions, unitOptions } from '@/lib/data/filter'
import React from 'react'

type Props = {}

function SelectFilterRegUniCom({ }: Props) {
  const { currentUser } = useCurrentUser();
  const { activityLoading } = useSelector((state) => state.activity);
  const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();

  const handleValueChange = (value: string) => {
    setCurrentFilter({
      region: value,
      typeOfActivity: currentFilter?.typeOfActivity || '',
      unit: currentFilter?.unit || '',
      status: currentFilter?.status || '',
      month: currentFilter?.month || '',
      wfpYear: currentFilter?.wfpYear || ''
    });
  };

  return (
    <div >
      <Label className='font-semibold'>Region:</Label>
      <Select onValueChange={handleValueChange} value={currentFilter?.region} disabled={activityLoading}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder={currentUser?.region ? currentUser?.region : "Filter"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='All'>All</SelectItem>
          <SelectGroup>
            <SelectLabel>Regions</SelectLabel>
            {regionOptions.map((option, index) => (
              <SelectItem key={index} value={option}>{option}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

  )
}

export default SelectFilterRegUniCom