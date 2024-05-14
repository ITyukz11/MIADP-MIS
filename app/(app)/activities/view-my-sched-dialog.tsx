import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FaCalendarAlt } from 'react-icons/fa'

type Props = {}

export const ViewMySchedDialog = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"  className='flex flex-row items-center gap-1 justify-center'><FaCalendarAlt /> View my Activity</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[40%] overflow-y-auto max-h-[90vh] ">
        <DialogHeader>
          <DialogTitle>Create new activity form</DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Separator/>
      </DialogContent>
  
    </Dialog>
  )
}