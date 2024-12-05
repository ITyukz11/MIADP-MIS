'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { avoidDefaultDomBehavior, handleKeyDown } from "@/utils/dialogUtils";

interface ProfileNameUpdateDialogProps {
    open: boolean;
    setClose: () => void;
    name: string
}

export function ProfileNameUpdateDialog({ open, setClose, name }: ProfileNameUpdateDialogProps) {
    return (
        <>
            <Dialog open={open} onOpenChange={setClose}>
                <DialogContent className="sm:max-w-[425px]"
                    onPointerDownOutside={avoidDefaultDomBehavior}
                    onInteractOutside={avoidDefaultDomBehavior}
                    onKeyDown={handleKeyDown}
                >
                    <DialogHeader>
                        <DialogTitle>Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your account here.
                        </DialogDescription>
                    </DialogHeader>
                    {name}

                </DialogContent>
            </Dialog>
        </>
    );
}
