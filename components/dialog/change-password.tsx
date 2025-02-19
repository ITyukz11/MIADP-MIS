"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserSchema } from "@/schemas/user";
import { z } from "zod";

interface ChangePasswordDialogProps {
  open: boolean;
  setClose: () => void;
}

export function ChangePasswordDialog({
  open,
  setClose,
}: ChangePasswordDialogProps) {
  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    console.log("submit profile dialog:", values);
  };

  return (
    <Dialog open={open} onOpenChange={setClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between">
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
