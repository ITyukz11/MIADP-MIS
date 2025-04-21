"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PendingUserType } from "./schema";
import { useState } from "react";
import { register } from "@/actions/register";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DialogView from "@/components/dialog/dialog-view";
import { updatePendingUserStatus } from "@/actions/pendinguser/update-prending-user";
import AreYouSure from "@/components/AreYouSure";
import { usePendingUsersData } from "@/lib/admin/usePendingUsersData";
import { Eye, Check, X, Trash } from "lucide-react";
import { deletePendingUser } from "@/actions/pendinguser/delete-pending-user";

interface DataTableRowActionsProps {
  rowData: PendingUserType;
}

export function DataTableRowActions({ rowData }: DataTableRowActionsProps) {
  const [loading, setLoading] = useState(false);
  const [dialogViewOpen, setDialogViewOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | "delete" | null
  >(null);

  const { refetchPendingUserData } = usePendingUsersData();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      region: rowData.region || "",
      fullname: rowData.name || "",
      email: rowData.email || "",
      component: rowData.component || "",
      unit: rowData.unit || "",
      position: rowData.position || "",
      password: rowData.password || "",
      color: rowData.color || "",
    },
  });

  const handleApprovePendingUser = async () => {
    const values = form.getValues();
    setLoading(true);
    try {
      const data = await register(values);
      if (data.error) {
        throw new Error(data.error);
      }

      refetchPendingUserData(); // no toast here, handled in handleConfirm
    } catch (err) {
      throw err; // pass to handleConfirm for toast
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPendingUser = async () => {
    setLoading(true);
    try {
      await updatePendingUserStatus(rowData.id, "Rejected");
      refetchPendingUserData();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePendingUser = async () => {
    setLoading(true);
    try {
      await deletePendingUser(rowData.id);
      refetchPendingUserData();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      switch (pendingAction) {
        case "approve":
          await handleApprovePendingUser();
          break;
        case "reject":
          await handleRejectPendingUser();
          break;
        case "delete":
          await handleDeletePendingUser();
          break;
        default:
          throw new Error("No valid action selected.");
      }

      toast({
        title: `Successfully ${pendingAction}d user.`,
        description: `User ${rowData.name} has been ${pendingAction}d.`,
      });
    } catch (error) {
      console.error(`${pendingAction} failed:`, error);
      toast({
        title: `Failed to ${pendingAction} user.`,
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setConfirmDialogOpen(false); // optional cleanup
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem
            onSelect={() => {
              setDialogViewOpen(true);
              document.body.style.pointerEvents = "";
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          {rowData.status != "Approved" && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={rowData.status === "Approved"}
                onSelect={() => {
                  if (rowData.status !== "Approved") {
                    setPendingAction("approve");
                    setConfirmDialogOpen(true);
                    document.body.style.pointerEvents = "";
                  }
                }}
              >
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Approve
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={rowData.status === "Approved"}
                onSelect={() => {
                  if (rowData.status !== "Approved") {
                    setPendingAction("reject");
                    setConfirmDialogOpen(true);
                    document.body.style.pointerEvents = "";
                  }
                }}
              >
                <X className="mr-2 h-4 w-4 text-red-600" />
                Reject
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={rowData.status === "Approved"}
                onSelect={() => {
                  if (rowData.status !== "Approved") {
                    setPendingAction("delete");
                    setConfirmDialogOpen(true);
                    document.body.style.pointerEvents = "";
                  }
                }}
              >
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogView
        viewDatas={rowData}
        open={dialogViewOpen}
        close={() => setDialogViewOpen(false)}
      />

      <AreYouSure
        title={
          pendingAction === "approve"
            ? "Approve this user?"
            : pendingAction === "reject"
            ? "Reject this user?"
            : "Delete this user?"
        }
        description={
          pendingAction === "approve" ? (
            <>
              This user will be approved and allowed to log in. <br />
              Are you sure you want to continue?
            </>
          ) : pendingAction === "reject" ? (
            <>
              This user will be rejected and will not be able to access the
              system. <br />
              Are you sure?
            </>
          ) : (
            <>
              This user will be permanently deleted from the system. <br />
              This action cannot be undone. Are you sure?
            </>
          )
        }
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        buttonTitle={
          pendingAction === "approve"
            ? "Approve"
            : pendingAction === "reject"
            ? "Reject"
            : "Delete"
        }
      />
    </div>
  );
}
