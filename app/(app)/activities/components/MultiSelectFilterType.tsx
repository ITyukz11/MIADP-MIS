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
import { TypeData } from "@/components/calendar-of-activity/data";
import { useCalendarOfActivityMultiFilter } from "@/components/context/MultiFilterActivitiesContext";
import { Label } from "@/components/ui/label";
import { CaretSortIcon } from "@radix-ui/react-icons";

function MultiSelectFilterType() {
  const { currentMultiFilter, setCurrentMultiFilter } =
    useCalendarOfActivityMultiFilter();
  const [isOpen, setIsOpen] = useState(false);

  // Ensure `type` is always an array of strings
  const selectedTypes: string[] = Array.isArray(currentMultiFilter?.type)
    ? currentMultiFilter.type
    : [];

  const handleTypeChange = (value: string, checked: boolean) => {
    let updatedTypes: string[];

    if (value === "All") {
      updatedTypes = checked ? ["All"] : []; // If "All" is checked, reset selection to "All"
    } else {
      updatedTypes = checked
        ? [...selectedTypes.filter((t) => t !== "All"), value] // Add new type
        : selectedTypes.filter((t) => t !== value); // Remove type

      // If all types are unchecked, default to "All"
      if (updatedTypes.length === 0) {
        updatedTypes = ["All"];
      }
    }

    setCurrentMultiFilter({ ...currentMultiFilter, type: updatedTypes });
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Type:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-0">
            {selectedTypes.length > 1
              ? `${selectedTypes.length} selected`
              : selectedTypes.includes("All")
              ? "All"
              : selectedTypes.join(", ")}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <DropdownMenuLabel>Select Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedTypes.includes("All")}
            onCheckedChange={(checked) => handleTypeChange("All", checked)}
            onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
          >
            All
          </DropdownMenuCheckboxItem>
          {TypeData.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedTypes.includes(option.value)}
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

export default MultiSelectFilterType;
