import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface AreYouSureDialogProps {
  title: string;
  description: React.ReactNode; // 🔁 from string to JSX support
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
  buttonTitle?: string;
}

const AreYouSureDialog = ({
  title,
  description,
  open,
  onClose,
  onConfirm,
  loading,
  buttonTitle = "Continue",
}: AreYouSureDialogProps) => {
  const handleConfirm = async () => {
    if (loading) return; // Prevent clicking multiple times while loading
    await onConfirm(); // Call the function
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? <LoadingSpinner /> : buttonTitle}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default React.memo(AreYouSureDialog);
