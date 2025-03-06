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
import { wfpYearOptions } from "@/lib/data/filter";
import React from "react";

function SelectFilterWFPYear(className: any) {
  const { activityLoading } = useSelector((state) => state.activity);
  const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();

  const handleValueChange = (value: string) => {
    setCurrentFilter({
      region: currentFilter?.region || "",
      type: currentFilter?.type || "",
      typeOfActivity: currentFilter?.typeOfActivity || "",
      unit: currentFilter?.unit || "",
      status: currentFilter?.status || "",
      month: currentFilter?.month || "",
      wfpYear: value,
    });
  };

  return (
    <div className={className}>
      <Label className="font-semibold text-xs md:text-sm">WFP Year:</Label>
      <Select
        onValueChange={handleValueChange}
        value={currentFilter?.wfpYear}
        disabled={activityLoading}
      >
        <SelectTrigger className="w-fit text-xs md:text-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="text-xs md:text-sm cursor-pointer" value="All">
            All
          </SelectItem>
          <SelectGroup>
            <SelectLabel className="text-xs md:text-sm">WFP Year</SelectLabel>
            {wfpYearOptions.map((option, index) => (
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

export default SelectFilterWFPYear;
