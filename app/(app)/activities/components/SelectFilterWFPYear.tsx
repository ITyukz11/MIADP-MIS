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
      typeOfActivity: currentFilter?.typeOfActivity || "",
      unit: currentFilter?.unit || "",
      status: currentFilter?.status || "",
      month: currentFilter?.month || "",
      wfpYear: value,
    });
  };

  return (
    <div className={className}>
      <Label className="font-semibold">WFP Year:</Label>
      <Select
        onValueChange={handleValueChange}
        value={currentFilter?.wfpYear}
        disabled={activityLoading}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          <SelectGroup>
            <SelectLabel>WFP Year</SelectLabel>
            {wfpYearOptions.map((option, index) => (
              <SelectItem key={index} value={option}>
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
