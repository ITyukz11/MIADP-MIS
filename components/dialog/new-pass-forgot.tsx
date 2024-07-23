'use client'
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { updatepass } from "@/actions/profile/updatepassword";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { verifyoldpass } from "@/actions/profile/verifyoldpass";
import { updateforgotpass } from "@/actions/profile/updateforgotpassword";

interface NewForgotPasswordDialogProps {
    open: boolean;
    setClose: () => void;
    forgotPassEmail:string
    setCloseForgotPassDialog:()=> void
}

export function NewForgotPasswordDialog({ open, setClose,forgotPassEmail,setCloseForgotPassDialog }: NewForgotPasswordDialogProps) {
    const [password, setPassword] = useState<string>("");
    const [repeatPass, setRepeatPass] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false)
    const [loadingForm, setLoadingForm] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if(password != repeatPass){
            setError("Password and repeat password do not match.")
        }else if(password.length <6){
            setError("Password is required atleast 6 characters")
        }
        else{
            setError("")
            try {
                const values = {
                    email: forgotPassEmail,
                    newPassword:password
                }
    
                updateforgotpass(values)
                    .then((data) => {
                        setError(data.error || null)
                        if(!data.error){
                            toast({
                                title: "Success",
                                description: "You have successfully changed your password. You can now login.",
                                duration: 10000,
                                action: (
                                    <ToastAction altText="OK">Ok</ToastAction>
                                ),
                            })
                            setCloseForgotPassDialog()
                            setClose()
                        }
                    });
            } catch (err: any) {
                console.error("Error verifying password:", err);
                setError(err.message || "An error occurred while verifying the password. Please try again.");
            } 
        }
    };
    useEffect(() => {
        if(error){
            setLoading(false)
        }
    }, [error])

    const avoidDefaultDomBehavior = (e: Event) => {
        e.preventDefault();
    };
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            event.stopPropagation();
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setClose}>
            <DialogContent className="sm:max-w-[425px]"
              onPointerDownOutside={avoidDefaultDomBehavior}
              onInteractOutside={avoidDefaultDomBehavior}
              onKeyDown={handleKeyDown}>
                <DialogHeader>
                    <DialogTitle>New Password</DialogTitle>
                    <DialogDescription>
                        To enhance your account security, please enter your new password. 
                    <Label className=" text-xs text-destructive">(Please create a password that is easy to remember)</Label>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="col-span-3"
                                disabled={loading}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                               Repeat
                            </Label>
                            <Input
                                id="password"
                                value={repeatPass}
                                onChange={(e) => setRepeatPass(e.target.value)}
                                type="password"
                                className="col-span-3"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between flex-row items-center">
                           <Label className="text-destructive">{error}</Label> <Button type="submit" disabled={loading}>{loading ? <LoadingSpinner /> : 'Confirm'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
