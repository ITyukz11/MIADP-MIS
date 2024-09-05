import { useSelector } from '@/app/store/store';
import { useCurrentUser } from '@/components/context/CurrentUserContext';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { componentOptions, regionOptions, unitOptions } from '@/lib/data/filter'
import React from 'react'

type Props = {}

function SelectFilterRegUniCom({}: Props) {
    const { currentUser } = useCurrentUser();
    const { activityLoading } = useSelector((state) => state.activity);
    const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();

    const handleValueChange = (value: string) => {
        setCurrentFilter({ 
          filter: value, 
          typeOfActivity:currentFilter?.typeOfActivity || '', 
          unit:currentFilter?.unit || ''});
      };

  return (
    <Select onValueChange={handleValueChange} value={currentFilter?.filter} disabled={activityLoading}>
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
  )
}

export default SelectFilterRegUniCom