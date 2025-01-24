import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../LoadingSpinner";

interface ConfirmDeleteDialogProps {
  items: string[];
  onConfirm: () => void;
  onCancel: () => void;
  openDeleteDialog: boolean;
  setDeleteDialogClose: () => void;
  loading: boolean;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  items,
  onConfirm,
  onCancel,
  openDeleteDialog,
  setDeleteDialogClose,
  loading,
}) => {
  const avoidDefaultDomBehavior = (e: Event) => {
    e.preventDefault();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      event.stopPropagation();
    }
  };

  return (
    <Dialog open={openDeleteDialog} onOpenChange={setDeleteDialogClose}>
      <DialogContent
        onPointerDownOutside={avoidDefaultDomBehavior}
        onInteractOutside={avoidDefaultDomBehavior}
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DialogDescription>
          {items.length ? (
            <>
              Are you sure you want to delete{" "}
              {items.length === 1
                ? "this 1 activity"
                : `these ${items.length} activities`}
              ?
            </>
          ) : (
            "Please select an activity first"
          )}
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          {items.length > 0 && (
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : "Delete"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
