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
import React from "react";

type Props = {};

function SelectTypeOfActivity({}: Props) {
  const { activityLoading } = useSelector((state) => state.activity);
  const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();
  const handleTypeOfActivtyChange = (value: string) => {
    setCurrentFilter({
      region: currentFilter?.region || "",
      unit: currentFilter?.unit || "",
      typeOfActivity: value,
      status: currentFilter?.status || "",
      month: currentFilter?.month || "",
      wfpYear: currentFilter?.wfpYear || "",
    });
  };

  return (
    <div>
      <Label className="font-semibold text-xs md:text-sm">Activity:</Label>
      <Select
        onValueChange={handleTypeOfActivtyChange}
        value={currentFilter?.typeOfActivity}
        disabled={activityLoading}
      >
        <SelectTrigger className="w-fit text-xs md:text-sm">
          <SelectValue placeholder={currentFilter?.typeOfActivity} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-xs md:text-sm">
              Type of Activity
            </SelectLabel>
            <SelectItem
              className="text-xs md:text-sm cursor-pointer"
              value="WFP Activities"
            >
              WFP Activities
            </SelectItem>
            <SelectItem
              className="text-xs md:text-sm cursor-pointer"
              value="Individual Activities"
            >
              Individual Activities
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectTypeOfActivity;
