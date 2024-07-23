'use client'
import { useCurrentUser } from "@/components/context/CurrentUserContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ChangePasswordDialogProps {
    open: boolean;
    setClose: () => void;
}

export function ChangePasswordDialog({ open, setClose }: ChangePasswordDialogProps) {
    const { currentUser } = useCurrentUser();


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
