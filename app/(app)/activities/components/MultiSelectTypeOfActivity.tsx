import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCalendarOfActivityMultiFilter } from "@/components/context/MultiFilterActivitiesContext";
import { Label } from "@/components/ui/label";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ActivityOption, TypeOfActivity } from "@/components/forms/data";

function MultiSelectTypeOfActivity() {
  const { currentMultiFilter, setCurrentMultiFilter } =
    useCalendarOfActivityMultiFilter();
  const [isOpen, setIsOpen] = useState(false);

  // Ensure `typeOfActivity` is always an array of strings
  const selectedTypeOfActivity: string[] = Array.isArray(
    currentMultiFilter?.typeOfActivity
  )
    ? currentMultiFilter.typeOfActivity
    : [];

  const handleTypeChange = (value: string, checked: boolean) => {
    let updatedTypeOfActivity: string[];

    if (value === "All") {
      updatedTypeOfActivity = checked ? ["All"] : []; // If "All" is checked, reset selection to "All"
    } else {
      updatedTypeOfActivity = checked
        ? [...selectedTypeOfActivity.filter((t) => t !== "All"), value] // Add new typeOfActivity
        : selectedTypeOfActivity.filter((t) => t !== value); // Remove typeOfActivity

      // If all types are unchecked, default to "All"
      if (updatedTypeOfActivity.length === 0) {
        updatedTypeOfActivity = ["All"];
      }
    }

    setCurrentMultiFilter({
      ...currentMultiFilter,
      typeOfActivity: updatedTypeOfActivity,
    });
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Activity:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-0">
            {selectedTypeOfActivity.length > 1
              ? `${selectedTypeOfActivity.length} selected`
              : selectedTypeOfActivity.includes("All")
              ? "All"
              : selectedTypeOfActivity.join(", ")}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <DropdownMenuLabel>Select Activity</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedTypeOfActivity.includes("All")}
            onCheckedChange={(checked) => handleTypeChange("All", checked)}
            onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
          >
            All
          </DropdownMenuCheckboxItem>
          {ActivityOption.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedTypeOfActivity.includes(option.value)}
              onCheckedChange={(checked) =>
                handleTypeChange(option.value, checked)
              }
              onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default MultiSelectTypeOfActivity;
