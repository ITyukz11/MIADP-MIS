import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CalendarForm from "./calendar-form";
import { Separator } from "@/components/ui/separator";
import { HiUser, HiUserGroup } from "react-icons/hi2";
import React from "react";

interface CalendarFormDialogProps {
  open: boolean;
  setClose: () => void;
  individualActivity_: boolean;
}

function CalendarFormDialog({
  open,
  setClose,
  individualActivity_,
}: CalendarFormDialogProps) {
  console.log("ACTIVITY CalendarFormDialog");
  const avoidDefaultDomBehavior = (e: Event) => {
    e.preventDefault();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      event.stopPropagation();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setClose}>
      <DialogContent
        className="min-w-[99%] md:min-w-[90%] lg:min-w-[60%] overflow-y-auto scrollbar-thin max-h-[95vh] rounded-lg"
        onPointerDownOutside={avoidDefaultDomBehavior}
        onInteractOutside={avoidDefaultDomBehavior}
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-1">
            Create new {individualActivity_ ? "individual" : "major"} activity
            form {individualActivity_ ? <HiUser /> : <HiUserGroup />}
          </DialogTitle>
          <DialogDescription>
            Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <CalendarForm
          setDialogClose={setClose}
          individualActivity_={individualActivity_}
        />
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(CalendarFormDialog);
