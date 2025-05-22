"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { FaFilter } from "react-icons/fa";

interface FilterSheetProps {
  triggerLabel?: string;
  title?: string;
  filterCount: number;
  children: ReactNode;
  onReset?: () => void;
}

export const FilterSheet = ({
  triggerLabel = "Advance Filter",
  title = "Filter Options",
  filterCount,
  children,
  onReset,
}: FilterSheetProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex flex-row gap-2 relative">
          <FaFilter className="shrink-0" />
          {triggerLabel}
          {filterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="grid md:grid-cols-2 gap-4">{children}</div>
        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onReset();
            }}
            className="text-sm underline mt-2"
          >
            Reset Filters
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};
