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
import { unitOptions } from "@/lib/data/filter";
import { CaretSortIcon } from "@radix-ui/react-icons";

function MultiSelectFilterUnit() {
  const { currentMultiFilter, setCurrentMultiFilter } =
    useCalendarOfActivityMultiFilter();
  const [isOpen, setIsOpen] = useState(false);

  // Ensure `unit` is always an array of strings
  const selectedUnits: string[] = Array.isArray(currentMultiFilter?.unit)
    ? currentMultiFilter.unit
    : [];

  const handleTypeChange = (value: string, checked: boolean) => {
    let updatedUnits: string[];

    if (value === "All") {
      updatedUnits = checked ? ["All"] : []; // If "All" is checked, reset selection to "All"
    } else {
      updatedUnits = checked
        ? [...selectedUnits.filter((t) => t !== "All"), value] // Add new unit
        : selectedUnits.filter((t) => t !== value); // Remove unit

      // If all unit are unchecked, default to "All"
      if (updatedUnits.length === 0) {
        updatedUnits = ["All"];
      }
    }

    setCurrentMultiFilter({ ...currentMultiFilter, unit: updatedUnits });
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Unit:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-0">
            {selectedUnits.length > 1
              ? `${selectedUnits.length} selected`
              : selectedUnits.includes("All")
              ? "All"
              : selectedUnits.join(", ")}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <DropdownMenuLabel>Select Unit</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedUnits.includes("All")}
            onCheckedChange={(checked) => handleTypeChange("All", checked)}
            onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
          >
            All
          </DropdownMenuCheckboxItem>
          {unitOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedUnits.includes(option.value)}
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

export default MultiSelectFilterUnit;
