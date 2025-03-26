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

// Options with labels and values
const validatedOptions = [
  { label: "All", value: "All" },
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

function MultiSelectFilterValidated({}: Props) {
  const { adPlanTable8Loading } = useADPlanTable8Data();
  const { currentMultiFilter, setCurrentMultiFilter } =
    useADPlanTable8MultiFilter();

  // Ensure selectedValidated is always an array
  const [selectedValidated, setSelectedValidated] = useState<string[]>(
    currentMultiFilter?.validated || []
  );
  const [isOpen, setIsOpen] = useState(false); // Manually control the dropdown state

  useEffect(() => {
    setSelectedValidated(currentMultiFilter?.validated || []);
  }, [currentMultiFilter?.validated]);

  const handleValidatedChange = (value: string, checked: boolean) => {
    let updatedValidated: string[];

    if (value === "All") {
      updatedValidated = checked ? ["All"] : [];
    } else {
      updatedValidated = checked
        ? [...selectedValidated.filter((v) => v !== "All"), value] // Remove "All" if selecting other options
        : selectedValidated.filter((v) => v !== value);

      if (updatedValidated.length === 0) {
        updatedValidated = ["All"]; // Default to "All" if nothing is selected
      }
    }

    setSelectedValidated(updatedValidated);
    setCurrentMultiFilter({
      ...currentMultiFilter,
      validated: updatedValidated, // Store as array
    });

    // Keep the dropdown open
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Validated:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={adPlanTable8Loading}
            className="gap-0 w-fit"
          >
            {selectedValidated.includes("All")
              ? "All"
              : selectedValidated.length > 1
              ? `${selectedValidated.length} selected`
              : validatedOptions.find((o) =>
                  selectedValidated.includes(o.value)
                )?.label || "Select"}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 max-h-96 overflow-y-auto" // Add max height & overflow-y
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents closing on click
        >
          <div className="sticky -top-1 bg-white z-10 py-2 border-b">
            <DropdownMenuLabel>Select Validated Status</DropdownMenuLabel>
          </div>
          <DropdownMenuSeparator />
          {validatedOptions.map((option, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              checked={selectedValidated.includes(option.value)}
              onCheckedChange={(checked) =>
                handleValidatedChange(option.value, checked)
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

export default MultiSelectFilterValidated;
