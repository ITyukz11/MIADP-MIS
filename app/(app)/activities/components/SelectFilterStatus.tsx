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
import { statusOptions } from "@/lib/data/filter";
import React from "react";

type Props = {};

function SelectFilterStatus({}: Props) {
  const { activityLoading } = useSelector((state) => state.activity);
  const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();

  const handleValueChange = (value: string) => {
    setCurrentFilter({
      region: currentFilter?.region || "",
      type: currentFilter?.type || "",
      typeOfActivity: currentFilter?.typeOfActivity || "",
      unit: currentFilter?.unit || "",
      wfpYear: currentFilter?.wfpYear || "",
      month: currentFilter?.month || "",
      status: value,
    });
  };

  return (
    <div>
      <Label className="font-semibold text-xs md:text-sm">Status:</Label>
      <Select
        onValueChange={handleValueChange}
        value={currentFilter?.status}
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
            <SelectLabel className="text-xs md:text-sm">Status</SelectLabel>
            {statusOptions.map((option, index) => (
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

export default SelectFilterStatus;
