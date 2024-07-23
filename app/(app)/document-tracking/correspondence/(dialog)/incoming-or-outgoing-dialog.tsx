import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { HiUser, HiUserGroup } from "react-icons/hi2";
import { HiMiniDocumentArrowDown } from "react-icons/hi2";
import { HiMiniDocumentArrowUp } from "react-icons/hi2";


interface IncOrOutDialogProps {
    open: boolean;
    setClose: () => void;
    setIncomingRoutingSlipDialog:()=> void;
    setOutgoingRoutingSlipDialog:()=> void;
}

export default function IncOrOutDialog({ open, setClose, setIncomingRoutingSlipDialog,setOutgoingRoutingSlipDialog}: IncOrOutDialogProps) {

    return (
        <Dialog open={open} onOpenChange={setClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Choose your routing slip</DialogTitle>
                    <DialogDescription>
                        Click to open the form
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex flex-row flex-wrap justify-around gap-1">
                <Button
                       className="flex w-32 h-44 sm:w-44 flex-col shadow-2xl hover:border-2"
                       variant={'secondary'}
                        onClick={() => {
                            setIncomingRoutingSlipDialog();
                            setClose()
                        }}>
                        <HiMiniDocumentArrowDown size={70}/>Incoming (Routing Slip)
                    </Button>
                    <Button
                        className="flex w-32 h-44 sm:w-44 flex-col shadow-2xl hover:border-2"
                        onClick={() => {
                            setOutgoingRoutingSlipDialog();
                            setClose()
                        }}>
                        <HiMiniDocumentArrowUp size={70}/> Outgoing Form
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}