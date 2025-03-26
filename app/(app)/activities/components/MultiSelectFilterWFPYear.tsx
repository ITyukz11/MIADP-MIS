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
import { regionOptions, wfpYearOptions } from "@/lib/data/filter";
import { CaretSortIcon } from "@radix-ui/react-icons";

function MultiSelectFilterWFPYear() {
  const { currentMultiFilter, setCurrentMultiFilter } =
    useCalendarOfActivityMultiFilter();
  const [isOpen, setIsOpen] = useState(false);

  // Ensure `wfpYear` is always an array of strings
  const selectedWFPYear: string[] = Array.isArray(currentMultiFilter?.wfpYear)
    ? currentMultiFilter.wfpYear
    : [];

  const handleTypeChange = (value: string, checked: boolean) => {
    let updatedWfpYear: string[];

    if (value === "All") {
      updatedWfpYear = checked ? ["All"] : []; // If "All" is checked, reset selection to "All"
    } else {
      updatedWfpYear = checked
        ? [...selectedWFPYear.filter((t) => t !== "All"), value] // Add new wfpYear
        : selectedWFPYear.filter((t) => t !== value); // Remove wfpYear

      // If all types are unchecked, default to "All"
      if (updatedWfpYear.length === 0) {
        updatedWfpYear = ["All"];
      }
    }

    setCurrentMultiFilter({ ...currentMultiFilter, wfpYear: updatedWfpYear });
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">WFP Year:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-0">
            {selectedWFPYear.length > 1
              ? `${selectedWFPYear.length} selected`
              : selectedWFPYear.includes("All")
              ? "All"
              : selectedWFPYear.join(", ")}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <DropdownMenuLabel>Select WFP Year</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedWFPYear.includes("All")}
            onCheckedChange={(checked) => handleTypeChange("All", checked)}
            onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
          >
            All
          </DropdownMenuCheckboxItem>
          {wfpYearOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selectedWFPYear.includes(option)}
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

export default MultiSelectFilterWFPYear;
