"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";

import { FaFilter } from "react-icons/fa";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface IPOValidatonLayoutProps {
  children: React.ReactNode;
}

export default function IPOValidationLayout({
  children,
}: IPOValidatonLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-row flex-wrap gap-2 justify-between">
        <div className="flex flex-row gap-2 items-center justify-between w-full">
          <div className="flex flex-row gap-2 flex-wrap items-center">
            <Label className="text-xl md:text-3xl font-bold tracking-tight">
              Component 3 - IPO Validation
            </Label>
            <Label className="text-xs sm:text-sm text-muted-foreground">
              BETA VERSION
            </Label>
          </div>

          <div className="flex flex-row flex-wrap gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="relative flex items-center gap-2"
                >
                  <FaFilter size={18} />
                  <span>Filters</span>

                  {/* Badge for applied filters count */}
                </Button>
              </PopoverTrigger>

              {/* Popover Content Styled for Right Alignment & Mobile Layout */}
              <PopoverContent
                className="border-gray-300 p-4 w-[350px] md:w-fit shadow-lg"
                align="end" // Moves it to the right
              >
                <div className="flex flex-row flex-wrap gap-4">
                  Filtering Here
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="h-full flex-1 flex-col space-y-8 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
