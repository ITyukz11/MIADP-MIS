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
      <Label className="font-semibold">Month:</Label>
      <Select
        onValueChange={handleValueChange}
        value={currentFilter?.month}
        disabled={activityLoading}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          <SelectGroup>
            <SelectLabel>Months</SelectLabel>
            {monthOptions.map((option, index) => (
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

export default SelectFilterMonth;
