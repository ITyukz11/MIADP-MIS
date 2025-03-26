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
import { useADPlanTable8Data } from "@/lib/ad-plan/table8/useTable8DataHook";
import { CaretSortIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";

type Props = {};

// Use label & value for better clarity
const options = [
  { label: "All", value: "All" },
  { label: "Infrastructure", value: "INFRA" },
  { label: "Enterprise", value: "ENTREP" },
];

function MultiSelectFilterInfraEntrep({}: Props) {
  const { adPlanTable8Loading } = useADPlanTable8Data();
  const { currentMultiFilter, setCurrentMultiFilter } =
    useADPlanTable8MultiFilter();

  // Ensure selectedFilters is always an array
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    currentMultiFilter?.infraEntrep || []
  );
  const [isOpen, setIsOpen] = useState(false); // Manually control the dropdown state

  useEffect(() => {
    setSelectedFilters(currentMultiFilter?.infraEntrep || []);
  }, [currentMultiFilter?.infraEntrep]);

  const handleInfraEntrepChange = (value: string, checked: boolean) => {
    let updatedFilters: string[];

    if (value === "All") {
      updatedFilters = checked ? ["All"] : [];
    } else {
      updatedFilters = checked
        ? [...selectedFilters.filter((f) => f !== "All"), value] // Remove "All" if selecting other options
        : selectedFilters.filter((f) => f !== value);

      if (updatedFilters.length === 0) {
        updatedFilters = ["All"]; // Default to "All" if nothing is selected
      }
    }

    setSelectedFilters(updatedFilters);
    setCurrentMultiFilter({
      ...currentMultiFilter,
      infraEntrep: updatedFilters, // Store as array
    });

    // Keep the dropdown open
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Infra/Entrep:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={adPlanTable8Loading}
            className="gap-0 w-fit"
          >
            {selectedFilters.includes("All")
              ? "All"
              : selectedFilters.length > 1
              ? `${selectedFilters.length} selected`
              : options.find((o) => selectedFilters.includes(o.value))?.label ||
                "Select"}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 max-h-96 overflow-y-auto" // Add max height & overflow-y
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <div className="sticky -top-1 bg-white z-10 py-2 border-b">
            <DropdownMenuLabel>Select Category</DropdownMenuLabel>
          </div>
          <DropdownMenuSeparator />
          {options.map((option, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              checked={selectedFilters.includes(option.value)}
              onCheckedChange={(checked) =>
                handleInfraEntrepChange(option.value, checked)
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

export default MultiSelectFilterInfraEntrep;
