import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import CalendarFormDialog from './calendar-form-dialog'
import { useState } from "react";
import { HiUser, HiUserGroup } from "react-icons/hi2";
import { Label } from "@/components/ui/label";

interface MajorOrIndividualDialogProps {
    open: boolean;
    setClose: () => void;
    setCalendarFormOpen:()=> void;
    setIndividualActivity: (isIndividual: boolean) => void; // Updated prop type
}

export default function MajorOrIndividualDialog({ open, setClose, setCalendarFormOpen,setIndividualActivity}: MajorOrIndividualDialogProps) {

    return (
        <Dialog open={open} onOpenChange={setClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Choose an activity</DialogTitle>
                    <DialogDescription>
                        Click to open the form
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex flex-row flex-wrap justify-around gap-1">
                <Button
                       className="flex w-32 h-44 sm:w-44 flex-col shadow-2xl hover:border-2"
                       variant={'secondary'}
                        onClick={() => {
                            setCalendarFormOpen();
                            setIndividualActivity(true);
                            setClose()
                        }}>
                        <HiUser size={70}/> Individual Activity
                    </Button>
                    <Button
                        className="flex w-32 h-44 sm:w-44 flex-col shadow-2xl hover:border-2"
                        onClick={() => {
                            setCalendarFormOpen();
                            setIndividualActivity(false)
                            setClose()
                        }}>
                        <HiUserGroup size={70}/> 
                        <Label> Major Activity</Label>
                        <Label>(WFP)</Label>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}