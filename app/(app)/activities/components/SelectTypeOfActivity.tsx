import { useSelector } from '@/app/store/store';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

type Props = {}

function SelectTypeOfActivity({ }: Props) {
    const { activityLoading } = useSelector((state) => state.activity);
    const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();
    const handleTypeOfActivtyChange = (value: string) => {
        setCurrentFilter({
            filter: currentFilter?.filter || '',
            unit: currentFilter?.unit || '',
            typeOfActivity: value,
            status: currentFilter?.status || ''
        });
    };

    return (
        <div>
            <Label className='font-semibold'>Activity:</Label>
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
        </div>

    )
}

export default SelectTypeOfActivity