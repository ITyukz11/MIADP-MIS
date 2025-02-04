import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import CalendarFormDialog from "./calendar-form-dialog";
import React, { useState } from "react";
import { HiUser, HiUserGroup } from "react-icons/hi2";
import { Label } from "@/components/ui/label";

interface MajorOrIndividualDialogProps {
  open: boolean;
  setClose: () => void;
  setCalendarFormOpen: () => void;
  setIndividualActivity: (isIndividual: boolean) => void; // Updated prop type
}

function MajorOrIndividualDialog({
  open,
  setClose,
  setCalendarFormOpen,
  setIndividualActivity,
}: MajorOrIndividualDialogProps) {
  console.log("ACTIVITY MajorOrIndividualDialog");
  return (
    <Dialog open={open} onOpenChange={setClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose an activity</DialogTitle>
          <DialogDescription>Click to open the form</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-row flex-wrap justify-around gap-1">
          <div className="relative cursor-pointer">
            <Button
              className="flex w-32 h-44 sm:w-44 flex-col shadow-2xl hover:border-2"
              variant={"secondary"}
              onClick={() => {
                setCalendarFormOpen();
                setIndividualActivity(true);
                setClose();
              }}
            >
              <HiUser className="!w-20 !h-20 dark:text-white text-black" />
              <Label className="cursor-pointer">Individual Activity</Label>
            </Button>
          </div>
          <div className="relative cursor-pointer">
            <Button
              className="flex w-32 h-44 sm:w-44 flex-col shadow-2xl hover:border-2 z-10"
              onClick={() => {
                setCalendarFormOpen();
                setIndividualActivity(false);
                setClose();
              }}
            >
              <HiUserGroup className="!w-20 !h-20 dark:text-black text-white" />
              <Label className="cursor-pointer"> Major Activity</Label>
              <Label className="cursor-pointer">(WFP)</Label>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(MajorOrIndividualDialog);
