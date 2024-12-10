import { useSelector } from '@/app/store/store';
import { useCurrentUser } from '@/components/context/CurrentUserContext';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { componentOptions, regionOptions, statusOptions, unitOptions } from '@/lib/data/filter'
import React from 'react'

type Props = {}

function SelectFilterStatus({ }: Props) {
  const { activityLoading } = useSelector((state) => state.activity);
  const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();

  const handleValueChange = (value: string) => {
    setCurrentFilter({
      filter: currentFilter?.filter || '',
      typeOfActivity: currentFilter?.typeOfActivity || '',
      unit: currentFilter?.unit || '',
      status: value
    });
  };

  return (
    <div>
      <Label className='font-semibold'>Status:</Label>
      <Select onValueChange={handleValueChange} value={currentFilter?.status} disabled={activityLoading}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder='All' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='All'>All</SelectItem>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {statusOptions.map((option, index) => (
              <SelectItem key={index} value={option}>{option}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

  )
}

export default SelectFilterStatus