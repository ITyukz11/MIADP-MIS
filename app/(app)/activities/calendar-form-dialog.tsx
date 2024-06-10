import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaPlusCircle } from "react-icons/fa"
import CalendarForm from "./calendar-form"
import { Separator } from "@/components/ui/separator"

interface CalendarFormDialogProps{
  open: boolean;
  setClose: ()=> void;
}

export default function CalendarFormDialog({open, setClose}:CalendarFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setClose}>
      <DialogContent className="min-w-[98%] lg:min-w-[60%] overflow-y-auto scrollbar-thin max-h-[95vh] ">
        <DialogHeader>
          <DialogTitle>Create new activity form</DialogTitle>
          <DialogDescription>
            Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Separator/>
        <CalendarForm setDialogClose={setClose}/>
      </DialogContent>
    </Dialog>
  )
}