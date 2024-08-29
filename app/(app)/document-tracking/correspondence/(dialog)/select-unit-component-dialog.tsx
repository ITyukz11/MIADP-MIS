import SelectFilterRegUniCom from "@/app/(app)/activities/components/SelectFilterRegUniCom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { useState } from "react";
  
  interface AlertDialogProps{
    open:boolean;
    closeAlertDialog:()=> void;
    loading:boolean
  }

  export const SelectUnitComponetDialog=({open, closeAlertDialog, loading}:AlertDialogProps)=> {
    return (
      <AlertDialog open={open} onOpenChange={closeAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm receiving the incoming route</AlertDialogTitle>
            <AlertDialogDescription>
              Once received the route document will be in your responsibility
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <SelectFilterRegUniCom/>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <Button 
              type="button">
              {loading? <LoadingSpinner/>:"Received"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  