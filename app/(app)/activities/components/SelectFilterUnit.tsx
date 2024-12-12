import { useSelector } from '@/app/store/store';
import { useCurrentUser } from '@/components/context/CurrentUserContext';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { Label } from '@/components/ui/label';
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
          region: currentFilter?.region || '', 
          typeOfActivity:currentFilter?.typeOfActivity || '', 
          unit:value,
          status:currentFilter?.status || '',
          month: currentFilter?.month || '',
          wfpYear: currentFilter?.wfpYear || ''
        });
      };

  return (
    <div>
    <Label className='font-semibold'>Unit:</Label>
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
  </div>
  
  )
}

export default SelectFilterUnitComponent