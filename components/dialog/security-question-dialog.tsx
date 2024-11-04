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
import { getSession } from "next-auth/react";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { NewPasswordDialog } from "./new-password";
import { verifyoldpass } from "@/actions/profile/verifyoldpass";

interface SecurityQuestionDialogProps {
    open: boolean;
    setClose: () => void;
}

export function SecurityQuestionDialog({ open, setClose }: SecurityQuestionDialogProps) {
    const [answer, setAnswer] = useState<string>("");
    const [question, setQuestion] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingForm, setLoadingForm] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [confirmPass, setConfirmPass] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // try {
        //     const session = await getSession();
        //     if (!session) {
        //         throw new Error("No active session found");
        //     }

        //     const values = {
        //         email: session.user.email,
        //         password: password
        //     }

        //     verifyoldpass(values)
        //         .then((data) => {
        //             setError(data.error || null)
        //                 if(!data.error){
        //                     setConfirmPass(true)
        //                     setLoading(false)
        //                 }
        //         });

        // } catch (err: any) {
        //     console.error("Error verifying password:", err);
        //     setError(err.message || "An error occurred while verifying the password. Please try again.");
        // } 
    };

    useEffect(() => {
        if(error){
            setLoading(false)
        }
    }, [error])
    

    return (
        <>
        <Dialog open={open} onOpenChange={setClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adding Security Question</DialogTitle>
                    <DialogDescription>
                        The system detects that you don&apos;t have any security question 
                    </DialogDescription>
                </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Security Question
                                </Label>
                                <Input
                                    id="security-question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className="col-span-3"
                                    disabled={loading}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Answer
                                </Label>
                                <Input
                                    id="password"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
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
        </>
    );
}
