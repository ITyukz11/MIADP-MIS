import { useSelector } from '@/app/store/store';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

type Props = {}

function SelectTypeOfActivity({}: Props) {
    const { activityLoading } = useSelector((state) => state.activity);
    const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();
    const handleTypeOfActivtyChange = (value: string) => {
        setCurrentFilter({ 
            filter: currentFilter?.filter || '', 
            unit: currentFilter?.unit || '',
            typeOfActivity: value 
        });
      };

  return (
    <Select onValueChange={handleTypeOfActivtyChange} value={currentFilter?.typeOfActivity} disabled={activityLoading}>
    <SelectTrigger className="w-fit">
        <SelectValue placeholder={currentFilter?.typeOfActivity} />
    </SelectTrigger>
    <SelectContent>
        <SelectGroup>
            <SelectLabel>Type of Activity</SelectLabel>
            <SelectItem value='WFP Activities'>WFP Activities</SelectItem>
            <SelectItem value='Individual Activities'>Individual Activities</SelectItem>
        </SelectGroup>
    </SelectContent>
</Select>
  )
}

export default SelectTypeOfActivity