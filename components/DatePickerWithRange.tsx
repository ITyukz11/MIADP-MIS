"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRange {
  date: DateRange | undefined;
  setDate: (value: DateRange | undefined) => void;
}

export function DatePickerWithRange({ date, setDate }: DatePickerWithRange) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Close the popover when Escape key is pressed
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsPopoverOpen(false); // Close the popover
    }
  };

  return (
    <div className={cn("grid gap-2 z-50")}>
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={true}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)} // Toggle popover open/close
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onKeyDown={handleKeyDown} // Add key down listener
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
