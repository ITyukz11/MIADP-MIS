import { useSelector } from '@/app/store/store';
import { useCurrentUser } from '@/components/context/CurrentUserContext';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { componentOptions, regionOptions, unitOptions } from '@/lib/data/filter'
import React from 'react'

type Props = {}

function SelectFilterUnitComponent({}: Props) {
    const { currentUser } = useCurrentUser();
    const { activityLoading } = useSelector((state) => state.activity);
    const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();

    const handleValueChange = (value: string) => {
        setCurrentFilter({ 
          filter: currentFilter?.filter || '', 
          typeOfActivity:currentFilter?.typeOfActivity || '', 
          unit:value
        });
      };

  return (
    <Select onValueChange={handleValueChange} value={currentFilter?.unit} disabled={activityLoading}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder={currentUser?.unit ? currentUser?.unit : "Filter Unit"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>All</SelectItem>
              <SelectGroup>
                <SelectLabel>Components</SelectLabel>
                {componentOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Units</SelectLabel>
                {unitOptions.map((option, index) => (
                  <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
  )
}

export default SelectFilterUnitComponent