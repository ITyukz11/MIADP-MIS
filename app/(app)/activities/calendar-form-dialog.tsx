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


export default function CalendarFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"  className='flex flex-row items-center gap-1 justify-center'><FaPlusCircle /> Create new activity</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[40%] overflow-y-auto max-h-[90vh] ">
        <DialogHeader>
          <DialogTitle>Create new activity form</DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Separator/>
        <CalendarForm/>
      </DialogContent>
  
    </Dialog>
  )
}