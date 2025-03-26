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
const conceptNoteOptions = [
  { label: "All", value: "All" },
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

function MultiSelectFilterConceptNote({}: Props) {
  const { adPlanTable8Loading } = useADPlanTable8Data();
  const { currentMultiFilter, setCurrentMultiFilter } =
    useADPlanTable8MultiFilter();

  const [selectedConceptNote, setSelectedConceptNote] = useState<string[]>(
    currentMultiFilter?.conceptNote || []
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedConceptNote(currentMultiFilter?.conceptNote || []);
  }, [currentMultiFilter?.conceptNote]);

  const handleConceptNoteChange = (value: string, checked: boolean) => {
    let updatedConceptNote: string[];

    if (value === "All") {
      updatedConceptNote = checked ? ["All"] : [];
    } else {
      updatedConceptNote = checked
        ? [...selectedConceptNote.filter((v) => v !== "All"), value]
        : selectedConceptNote.filter((v) => v !== value);

      if (updatedConceptNote.length === 0) {
        updatedConceptNote = ["All"];
      }
    }

    setSelectedConceptNote(updatedConceptNote);
    setCurrentMultiFilter({
      ...currentMultiFilter,
      conceptNote: updatedConceptNote,
    });

    setIsOpen(true);
  };

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs md:text-sm">Concept Note:</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={adPlanTable8Loading}
            className="gap-0 w-fit"
          >
            {selectedConceptNote.includes("All")
              ? "All"
              : selectedConceptNote.length > 1
              ? `${selectedConceptNote.length} selected`
              : conceptNoteOptions.find((o) =>
                  selectedConceptNote.includes(o.value)
                )?.label || "Select"}
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 max-h-96 overflow-y-auto"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="sticky -top-1 bg-white z-10 py-2 border-b">
            <DropdownMenuLabel>Select Concept Note Status</DropdownMenuLabel>
          </div>
          <DropdownMenuSeparator />
          {conceptNoteOptions.map((option, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              checked={selectedConceptNote.includes(option.value)}
              onCheckedChange={(checked) =>
                handleConceptNoteChange(option.value, checked)
              }
              onSelect={(e) => e.preventDefault()}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default MultiSelectFilterConceptNote;
