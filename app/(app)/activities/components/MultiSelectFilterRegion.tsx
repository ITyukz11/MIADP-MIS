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
import { regionOptions } from "@/lib/data/filter";
import { CaretSortIcon } from "@radix-ui/react-icons";

function MultiSelectFilterRegion() {
  const { currentMultiFilter, setCurrentMultiFilter } =
    useCalendarOfActivityMultiFilter();
  const [isOpen, setIsOpen] = useState(false);

  // Ensure `region` is always an array of strings
  const selectedRegion: string[] = Array.isArray(currentMultiFilter?.region)
    ? currentMultiFilter.region
    : [];

  const handleTypeChange = (value: string, checked: boolean) => {
    let updatedRegion: string[];

    if (value === "All") {
      updatedRegion = checked ? ["All"] : []; // If "All" is checked, reset selection to "All"
    } else {
      updatedRegion = checked
        ? [...selectedRegion.filter((t) => t !== "All"), value] // Add new region
        : selectedRegion.filter((t) => t !== value); // Remove region

      // If all types are unchecked, default to "All"
      if (updatedRegion.length === 0) {
        updatedRegion = ["All"];
      }
    }

    setCurrentMultiFilter({ ...currentMultiFilter, region: updatedRegion });
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Region:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-0">
            {selectedRegion.length > 1
              ? `${selectedRegion.length} selected`
              : selectedRegion.includes("All")
              ? "All"
              : selectedRegion.join(", ")}
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
            checked={selectedRegion.includes("All")}
            onCheckedChange={(checked) => handleTypeChange("All", checked)}
            onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
          >
            All
          </DropdownMenuCheckboxItem>
          {regionOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selectedRegion.includes(option)}
              onCheckedChange={(checked) => handleTypeChange(option, checked)}
              onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default MultiSelectFilterRegion;
