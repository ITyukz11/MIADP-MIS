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

import { IoMdAdd } from "react-icons/io"
import { WFPForm } from "./forms/wfp-add-form"

export default function DialogWFPActivityForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><IoMdAdd /> Add</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[70%] overflow-y-auto scrollbar-thin max-h-[90vh] ">
        <DialogHeader>
          <DialogTitle>WFP Activity Upload Form</DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
       <WFPForm/>
      </DialogContent>
  
    </Dialog>
  )
}