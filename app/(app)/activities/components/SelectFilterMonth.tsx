import { useSelector } from "@/app/store/store";
import { useCalendarOfActivityFilter } from "@/components/context/FilterRegionContext";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { monthOptions, wfpYearOptions } from "@/lib/data/filter";
import React from "react";

type Props = {};

function SelectFilterMonth({}: Props) {
  const { activityLoading } = useSelector((state) => state.activity);
  const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();

  const handleValueChange = (value: string) => {
    setCurrentFilter({
      region: currentFilter?.region || "",
      typeOfActivity: currentFilter?.typeOfActivity || "",
      unit: currentFilter?.unit || "",
      status: currentFilter?.status || "",
      month: value,
      wfpYear: currentFilter?.wfpYear || "",
    });
  };

  return (
    <div>
      <Label className="font-semibold text-xs md:text-sm">Month:</Label>
      <Select
        onValueChange={handleValueChange}
        value={currentFilter?.month}
        disabled={activityLoading}
      >
        <SelectTrigger className="w-fit text-xs md:text-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All" className="text-xs md:text-sm cursor-pointer">
            All
          </SelectItem>
          <SelectGroup>
            <SelectLabel className="text-xs md:text-sm cursor-default">
              Months
            </SelectLabel>
            {monthOptions.map((option, index) => (
              <SelectItem
                className="text-xs md:text-sm cursor-pointer"
                key={index}
                value={option}
              >
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectFilterMonth;
