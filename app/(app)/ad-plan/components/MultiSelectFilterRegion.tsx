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
import { adPlanRegionOption } from "@/lib/ad-plan/data/data";
import { useADPlanTable8Data } from "@/lib/ad-plan/table8/useTable8DataHook";
import { CaretSortIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";

type Props = {};

function MultiSelectFilterRegion({}: Props) {
  const { adPlanTable8Loading } = useADPlanTable8Data();
  const { currentMultiFilter, setCurrentMultiFilter } =
    useADPlanTable8MultiFilter();

  // Ensure selectedRegions is always an array
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    currentMultiFilter?.region || []
  );
  const [isOpen, setIsOpen] = useState(false); // Manually control the dropdown state

  useEffect(() => {
    setSelectedRegions(currentMultiFilter?.region || []);
  }, [currentMultiFilter?.region]);

  const handleRegionChange = (region: string, checked: boolean) => {
    let updatedRegions: React.SetStateAction<string[]>;

    if (region === "All" && checked) {
      // If "All" is selected, remove all other months
      updatedRegions = ["All"];
    } else if (region === "All" && !checked) {
      // If "All" is unchecked, set default empty state
      updatedRegions = [];
    } else {
      updatedRegions = checked
        ? [...selectedRegions, region] // Add region
        : selectedRegions.filter((m) => m !== region); // Remove region

      if (updatedRegions.includes("All")) {
        updatedRegions = updatedRegions.filter((m) => m !== "All"); // Remove "All" if other months are selected
      }

      if (updatedRegions.length === 0) {
        updatedRegions = ["All"]; // Default to "All" if nothing is selected
      }
    }

    setSelectedRegions(updatedRegions);
    setCurrentMultiFilter({
      ...currentMultiFilter,
      region: updatedRegions, // Store as array
    });

    // Keep the dropdown open
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Regions:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={adPlanTable8Loading}
            className="gap-0"
          >
            {selectedRegions.length > 1
              ? `${selectedRegions.length} selected`
              : selectedRegions.includes("All")
              ? "All"
              : selectedRegions.join(", ")}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-fit"
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <div className="sticky -top-1 bg-white z-10 py-2 border-b">
            <DropdownMenuLabel>Select Regions</DropdownMenuLabel>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedRegions.includes("All")}
            onCheckedChange={(checked) => handleRegionChange("All", checked)}
            onSelect={(e) => e.preventDefault()} // Prevent closing when selecting
          >
            All
          </DropdownMenuCheckboxItem>
          {adPlanRegionOption.map((option, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              checked={selectedRegions.includes(option.value)}
              onCheckedChange={(checked) =>
                handleRegionChange(option.value, checked)
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

export default MultiSelectFilterRegion;
