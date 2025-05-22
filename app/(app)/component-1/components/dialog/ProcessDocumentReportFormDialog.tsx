import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TbReportAnalytics } from "react-icons/tb";
import React from "react";
import ProcessDocumentReportForm from "../forms/ProcessDocumentReportForm";

interface ProcessDocReportFormDialog {
    open: boolean;
    setClose: () => void;
}

function ProcessDocReportFormDialog({
    open,
    setClose,
}: ProcessDocReportFormDialog) {

    const avoidDefaultDomBehavior = (e: Event) => {
        e.preventDefault();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Escape" || event.keyCode === 27) {
            event.stopPropagation();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setClose}>
            <DialogContent
                className="min-w-[99%] md:min-w-[90%] lg:min-w-[65%] scrollbar-thin max-h-[95vh] rounded-lg overflow-y-auto"
                onPointerDownOutside={avoidDefaultDomBehavior}
                onInteractOutside={avoidDefaultDomBehavior}
                onKeyDown={handleKeyDown}
            >
                <DialogHeader>
                    <DialogTitle className="flex flex-row gap-1">
                        <TbReportAnalytics /> Process Documentation Report Form
                    </DialogTitle>
                    <DialogDescription>
                        Click submit when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <ProcessDocumentReportForm setClose={setClose} />
            </DialogContent>
        </Dialog>
    );
}

export default React.memo(ProcessDocReportFormDialog);
