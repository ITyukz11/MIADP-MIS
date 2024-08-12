import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '../ui/button';
import { LoadingSpinner } from '../LoadingSpinner';
import { Separator } from '../ui/separator';

interface DisplayHTMLDialogProps {
    html: string
    openDeleteDialog: boolean
    setDeleteDialogClose: () => void;
}

const DisplayHTMLDialog: React.FC<DisplayHTMLDialogProps> = ({ html, openDeleteDialog, setDeleteDialogClose }) => {
    const avoidDefaultDomBehavior = (e: Event) => {
        e.preventDefault();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            event.stopPropagation();
        }
    };

    return (
        <Dialog open={openDeleteDialog} onOpenChange={setDeleteDialogClose}>
            <DialogContent className="min-w-[99%] md:min-w-[80%] lg:min-w-[70%] overflow-y-auto scrollbar-thin max-h-[95vh] rounded-lg"
                onPointerDownOutside={avoidDefaultDomBehavior}
                onInteractOutside={avoidDefaultDomBehavior}
                onKeyDown={handleKeyDown}
            >
                <DialogTitle>Preparatory Content</DialogTitle>
                <DialogDescription>
                    This section provides an overview of the content in an expandable format.
                </DialogDescription>
                <Separator />
                <div dangerouslySetInnerHTML={{ __html: html }} />
                <Separator />
                <DialogFooter>
                    <Button onClick={setDeleteDialogClose}>
                        Close
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DisplayHTMLDialog;
