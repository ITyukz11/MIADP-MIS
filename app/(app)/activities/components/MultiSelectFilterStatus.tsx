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
import { statusOptions } from "@/lib/data/filter";
import { CaretSortIcon } from "@radix-ui/react-icons";

function MultiSelectFilterStatus() {
  const { currentMultiFilter, setCurrentMultiFilter } =
    useCalendarOfActivityMultiFilter();
  const [isOpen, setIsOpen] = useState(false);

  // Ensure `status` is always an array of strings
  const selectedStatus: string[] = Array.isArray(currentMultiFilter?.status)
    ? currentMultiFilter.status
    : [];

  const handleTypeChange = (value: string, checked: boolean) => {
    let updatedTypes: string[];

    if (value === "All") {
      updatedTypes = checked ? ["All"] : []; // If "All" is checked, reset selection to "All"
    } else {
      updatedTypes = checked
        ? [...selectedStatus.filter((t) => t !== "All"), value] // Add new status
        : selectedStatus.filter((t) => t !== value); // Remove status

      // If all types are unchecked, default to "All"
      if (updatedTypes.length === 0) {
        updatedTypes = ["All"];
      }
    }

    setCurrentMultiFilter({ ...currentMultiFilter, status: updatedTypes });
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Status:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-0">
            {selectedStatus.length > 1
              ? `${selectedStatus.length} selected`
              : selectedStatus.includes("All")
              ? "All"
              : selectedStatus.join(", ")}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <DropdownMenuLabel>Select Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedStatus.includes("All")}
            onCheckedChange={(checked) => handleTypeChange("All", checked)}
            onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
          >
            All
          </DropdownMenuCheckboxItem>
          {statusOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selectedStatus.includes(option)}
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

export default MultiSelectFilterStatus;
