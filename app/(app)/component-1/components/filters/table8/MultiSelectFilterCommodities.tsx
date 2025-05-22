"use client";

import { useADPlanTable8MultiFilter } from "@/components/context/ad-plan/MultiFilterTable8Context";
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
import { adPlanCommoditiesOption } from "@/lib/ad-plan/data/data";
import { useADPlanTable8Data } from "@/lib/ad-plan/table8/useTable8DataHook";
import { CaretSortIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";

type Props = {};

function MultiSelectFilterCommodities({}: Props) {
  const { adPlanTable8Loading } = useADPlanTable8Data();
  const { currentMultiFilter, setCurrentMultiFilter } =
    useADPlanTable8MultiFilter();

  // Ensure selectedCommodities is always an array
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>(
    currentMultiFilter?.commodities || []
  );
  const [isOpen, setIsOpen] = useState(false); // Manually control the dropdown state

  useEffect(() => {
    setSelectedCommodities(currentMultiFilter?.commodities || []);
  }, [currentMultiFilter?.commodities]);

  const handleCommoditiesChange = (commodities: string, checked: boolean) => {
    let updatedCommodities: React.SetStateAction<string[]>;

    if (commodities === "All" && checked) {
      // If "All" is selected, remove all other months
      updatedCommodities = ["All"];
    } else if (commodities === "All" && !checked) {
      // If "All" is unchecked, set default empty state
      updatedCommodities = [];
    } else {
      updatedCommodities = checked
        ? [...selectedCommodities, commodities] // Add commodities
        : selectedCommodities.filter((m) => m !== commodities); // Remove commodities

      if (updatedCommodities.includes("All")) {
        updatedCommodities = updatedCommodities.filter((m) => m !== "All"); // Remove "All" if other months are selected
      }

      if (updatedCommodities.length === 0) {
        updatedCommodities = ["All"]; // Default to "All" if nothing is selected
      }
    }

    setSelectedCommodities(updatedCommodities);
    setCurrentMultiFilter({
      ...currentMultiFilter,
      commodities: updatedCommodities, // Store as array
    });

    // Keep the dropdown open
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Commodities:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={adPlanTable8Loading}
            className="gap-0 w-fit"
          >
            {selectedCommodities.length > 1
              ? `${selectedCommodities.length} selected`
              : selectedCommodities.includes("All")
              ? "All"
              : selectedCommodities.join(", ")}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-fit max-h-96 overflow-y-auto" // Add max height & overflow-y
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <div className="sticky -top-1 bg-white z-10 py-2 border-b">
            <DropdownMenuLabel>Select Commodities</DropdownMenuLabel>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedCommodities.includes("All")}
            onCheckedChange={(checked) =>
              handleCommoditiesChange("All", checked)
            }
            onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
          >
            All
          </DropdownMenuCheckboxItem>
          {adPlanCommoditiesOption.map((option, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              checked={selectedCommodities.includes(option.value)}
              onCheckedChange={(checked) =>
                handleCommoditiesChange(option.value, checked)
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

export default MultiSelectFilterCommodities;
