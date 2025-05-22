"use client";

import React, { useState, useEffect } from "react";
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
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area"

export interface Option {
    value: string;
    label: string;
}

interface MultiSelectFilterProps {
    label: string;
    options: Option[];
    selectedValues: string[];
    onChange: (selected: string[]) => void;
    loading?: boolean;
    allValue?: string; // default: "All"
    dateConducted?: string[]; // Array of dates in mm/dd/yyyy format
    onCloseSheet?: () => void;
}

export function MultiSelectFilter({
    label,
    options,
    selectedValues,
    onChange,
    onCloseSheet,
    loading = false,
    allValue = "All",
    dateConducted = [], // Default to an empty array
}: MultiSelectFilterProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>(selectedValues);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSelectedItems(selectedValues);
    }, [selectedValues]);



    const handleItemChange = (value: string, checked: boolean) => {
        let updated: string[];

        if (value === allValue && checked) {
            // If "All" selected, only "All" remains selected
            updated = [allValue];
        } else if (value === allValue && !checked) {
            // Unchecked "All" clears all selections
            updated = [];
        } else {
            updated = checked
                ? [...selectedItems.filter((v) => v !== allValue), value]
                : selectedItems.filter((v) => v !== value);

            if (updated.length === 0) {
                updated = [allValue];
            }
        }

        setSelectedItems(updated);
        onChange(updated);

        // Keep dropdown open for multiple selections
        setIsOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false); // close dropdown first
          if (onCloseSheet) {
            onCloseSheet(); // tell sheet to close as well
          }
        }
      };
    
    const displayText =
        selectedItems.length > 1
            ? 
            <div className="flex flex-row gap-1">
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{selectedItems.length}</span>
                Selected
                </div>
            : selectedItems.includes(allValue)
                ? allValue
                : selectedItems.join(", ");

    return (
        <div className="flex flex-col">
            <Label className="font-semibold text-xs md:text-sm">{label}</Label>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen} >
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={loading} className={`gap-0 w-full overflow-hidden flex justify-between`}>
                       {displayText}
                        <CaretSortIcon className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="bg-white p-0 w-fit" 
                    onKeyDown={handleKeyDown}
                >
                    <div className="sticky -top-1 bg-white z-10 py-2 border-b">
                        <DropdownMenuLabel>Select {label}</DropdownMenuLabel>
                    </div>
                    <DropdownMenuSeparator />

                    {/* ScrollArea or div with overflow-y-auto and fixed height */}
                    <ScrollArea className="max-h-[280px] overflow-y-auto px-2">
                        <DropdownMenuCheckboxItem
                            checked={selectedItems.includes(allValue)}
                            onCheckedChange={(checked) => handleItemChange(allValue, checked)}
                            onSelect={(e) => e.preventDefault()}
                        >
                            {allValue}
                        </DropdownMenuCheckboxItem>
                        {options.map(({ value, label: optionLabel }) => (
                            <DropdownMenuCheckboxItem
                                key={value}
                                checked={selectedItems.includes(value)}
                                onCheckedChange={(checked) => handleItemChange(value, checked)}
                                onSelect={(e) => e.preventDefault()}
                            >
                                {optionLabel}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
