import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '../ui/button';
import { LoadingSpinner } from '../LoadingSpinner';
import { Separator } from '../ui/separator';

interface DisplayContentDialogProps {
    html?: string
    title:string
    content?:string
    openDeleteDialog: boolean
    setDeleteDialogClose: () => void;
}

const DisplayContentDialog: React.FC<DisplayContentDialogProps> = ({ html, title, content, openDeleteDialog, setDeleteDialogClose }) => {
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
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    This section provides an overview of the content in an expandable format.
                </DialogDescription>
                <Separator />
                {html &&  <div dangerouslySetInnerHTML={{ __html: html }} />}
                {content && <div>{content}</div>}
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

export default DisplayContentDialog;
