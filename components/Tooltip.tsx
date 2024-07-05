import React, { ReactNode, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipComponentProps {
  trigger: ReactNode;
  description: string;
}

export function TooltipComponent({ trigger, description }: TooltipComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleTooltip = () => {
    setIsOpen(!isOpen);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <div onClick={handleToggleTooltip}>
            {trigger}
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-2 rounded shadow-lg max-w-xs break-words">
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
