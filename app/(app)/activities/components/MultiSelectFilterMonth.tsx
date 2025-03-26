"use client";

import { useSelector } from "@/app/store/store";
import { useCalendarOfActivityMultiFilter } from "@/components/context/MultiFilterActivitiesContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { monthOptions } from "@/lib/data/filter";
import { CaretSortIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";

type Props = {};

function MultiSelectFilterMonth({}: Props) {
  const { activityLoading } = useSelector((state) => state.activity);
  const { currentMultiFilter, setCurrentMultiFilter } =
    useCalendarOfActivityMultiFilter();

  // Ensure selectedMonths is always an array
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    currentMultiFilter?.month || []
  );
  const [isOpen, setIsOpen] = useState(false); // Manually control the dropdown state

  useEffect(() => {
    setSelectedMonths(currentMultiFilter?.month || []);
  }, [currentMultiFilter?.month]);

  const handleMonthChange = (month: string, checked: boolean) => {
    let updatedMonths: React.SetStateAction<string[]>;

    if (month === "All" && checked) {
      // If "All" is selected, remove all other months
      updatedMonths = ["All"];
    } else if (month === "All" && !checked) {
      // If "All" is unchecked, set default empty state
      updatedMonths = [];
    } else {
      updatedMonths = checked
        ? [...selectedMonths, month] // Add month
        : selectedMonths.filter((m) => m !== month); // Remove month

      if (updatedMonths.includes("All")) {
        updatedMonths = updatedMonths.filter((m) => m !== "All"); // Remove "All" if other months are selected
      }

      if (updatedMonths.length === 0) {
        updatedMonths = ["All"]; // Default to "All" if nothing is selected
      }
    }

    setSelectedMonths(updatedMonths);
    setCurrentMultiFilter({
      ...currentMultiFilter,
      month: updatedMonths, // Store as array
    });

    // Keep the dropdown open
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Month:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={activityLoading}
            className="gap-0"
          >
            {selectedMonths.length > 1
              ? `${selectedMonths.length} selected`
              : selectedMonths.includes("All")
              ? "All"
              : selectedMonths.join(", ")}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <DropdownMenuLabel>Select Months</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedMonths.includes("All")}
            onCheckedChange={(checked) => handleMonthChange("All", checked)}
            onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
          >
            All
          </DropdownMenuCheckboxItem>
          {monthOptions.map((option, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              checked={selectedMonths.includes(option)}
              onCheckedChange={(checked) => handleMonthChange(option, checked)}
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

export default MultiSelectFilterMonth;
