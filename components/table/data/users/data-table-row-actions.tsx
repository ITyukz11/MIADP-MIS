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
import { useState } from "react";
import { FaBriefcase, FaStore, FaToggleOn, FaTrash, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { FaCalendar, FaToggleOff, FaUserTie } from "react-icons/fa6";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Add Select component
import AreYouSure from "@/components/AreYouSure";
import { UserType } from "@/types/users/userType";
import { useUsersData } from "@/lib/users/useUserDataHook";
import { positionOptions } from "@/lib/data/filter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { FormControl } from "@/components/ui/form";

interface DataTableRowActionsProps {
  rowData: UserType;
}

export function DataTableRowActions({
  rowData,
}: DataTableRowActionsProps) {
  const [userId, setUserId] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [separationDate, setSeparationDate] = useState<string>(""); // 👈
  const [actionType, setActionType] = useState<string>(""); // Track action type (Activate/Deactivate or Change Status)

  const [newDateHired, setNewDateHired] = useState<string>("");
  const { usersData, usersLoading, usersError, refetchUsers } = useUsersData();

  const user = usersData?.find((user) => user.id === rowData.id);
  const [selectedPosition, setSelectedPosition] = useState(
    user?.position || ""
  );
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleProfile = () => {
    router.push(`/profile/${rowData.id}`);
  };

  const handleToggleActive = async () => {
    setIsLoading(true);
    try {
      const newActive = !rowData.active;

      const res = await fetch(`/api/auth/user/${rowData.id}/active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: newActive,
          dateSeparated: !newActive ? separationDate : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update user status");
      toast({
        title: `User ${newActive ? "Activated" : "Deactivated"}`,
        description: `The employee has been successfully ${newActive ? "activated" : "deactivated"
          }.`,
      });
      refetchUsers();
    } catch (err) {
      console.error(err);
      toast({
        title: `Action Failed`,
        description: `An error occurred while trying to ${rowData.active ? "deactivate" : "activate"
          } the user. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePosition = async () => {
    if (!selectedPosition) return; // Ensure a position is selected
    setIsLoading(true);
    try {

      const res = await fetch(`/api/auth/user/${rowData.id}/position`, {
        method: "PATCH", // change from PUT to PATCH
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position: selectedPosition }),
      });

      if (!res.ok) throw new Error("Failed to update user status");

      toast({
        title: "Success",
        description: `Position updated successfully from ${user?.position} to ${selectedPosition}!`,
      });
      refetchUsers();
      // Optionally, you can refetch user data or perform other updates
      setOpenDialog(false); // Close the dialog after confirming
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change position. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeDateHired = async () => {
    if (!newDateHired) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/user/${rowData.id}/date-hired`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateHired: newDateHired }),
      });
      if (!res.ok) throw new Error("Failed to update date hired");
      toast({ title: "Success", description: "Date hired updated successfully!" });
      refetchUsers();
      setOpenDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change date hired. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log("rowData: ", rowData);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="flex flex-row gap-2 cursor-pointer"
            onClick={handleProfile}
          >
            <FaUser />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex flex-row gap-2 cursor-pointer"
            disabled
          >
            <FaTrash className="text-red-500" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Add Position Change Action */}
          <DropdownMenuItem
            className="flex flex-row gap-2 cursor-pointer"
            onSelect={() => {
              setActionType("changePosition"); // Set action type for Change Position
              setOpenDialog(true); // Open the unified AreYouSure dialog
              document.body.style.pointerEvents = ""; // Unlock pointer events (optional)
            }}
            disabled={!rowData.active} // Disable if not active
          >
            <FaBriefcase /> {/* Different icon for Position Change */}
            Position
          </DropdownMenuItem>

          {/* Add Date Hired Change Action */}
          <DropdownMenuItem
            className="flex flex-row gap-2 cursor-pointer"
            onSelect={() => {
              setActionType("changeDateHired"); // Set action type for Change Position
              setOpenDialog(true); // Open the unified AreYouSure dialog
              document.body.style.pointerEvents = ""; // Unlock pointer events (optional)
            }}
           // disabled={!rowData.active} // Disable if not active
           disabled={true}
          >
            <FaCalendar /> {/* Different icon for Position Change */}
            Date Hired
          </DropdownMenuItem>



          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex flex-row gap-2 cursor-pointer"
            onSelect={() => {
              setActionType("toggleActive"); // Set action type for Activate/Deactivate
              setOpenDialog(true);
              document.body.style.pointerEvents = "";
            }}
          >
            {rowData.active ? (
              <>
                <FaToggleOff className="text-red-500" />
                Deactivate
              </>
            ) : (
              <>
                <FaToggleOn className="text-green-600" />
                Activate
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dynamic AreYouSure Dialog */}
      <AreYouSure
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={
          actionType === "toggleActive"
            ? handleToggleActive
            : actionType === "changePosition"
              ? handleChangePosition
              : handleChangeDateHired
        }
        loading={isLoading}
        title={
          actionType === "toggleActive"
            ? rowData.active
              ? "Deactivate Employee?"
              : "Activate Employee?"
            : actionType === "changePosition"
              ? "Change Position?"
              : "Change Date Hired?"
        }
        description={
          <>
            {actionType === "toggleActive" ? (
              <>
                {rowData.active
                  ? "Are you sure you want to deactivate this employee? They will no longer be able to login to the system."
                  : "Are you sure you want to activate this employee again? They will be able to login to the system."}
                {/* Display Separation Date when deactivating */}
                {rowData.active && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="date-separated">Separation Date</Label>
                    <Input
                      id="date-separated"
                      type="date"
                      value={separationDate}
                      onChange={(e) => setSeparationDate(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                      max={new Date().toISOString().split("T")[0]} // Prevent future date
                    />
                  </div>
                )}
              </>
            ) : actionType === "changePosition" ? (
              <>
                {/* Position Change Description */}
                <div>
                  Are you sure you want to change the employee&apos;s position?
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="position">Select Position</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          tabIndex={2}
                          className="w-full justify-between h-auto min-h-10 whitespace-normal break-words text-left"
                          aria-expanded={isOpen}
                          disabled={isLoading}
                        >
                          {selectedPosition
                            ? selectedPosition
                            : "Select Position"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="z-[100] p-0 max-h-40" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                        <Command>
                          <CommandInput placeholder="Search position..." />
                          <CommandList>
                            <CommandEmpty>No position found.</CommandEmpty>
                            <CommandGroup>
                              {positionOptions.map((pos, index) => (
                                <CommandItem
                                  key={index}
                                  value={pos}
                                  onSelect={() => setSelectedPosition(pos)}
                                  className={`items-start gap-2 ${selectedPosition === pos ? 'bg-blue-50' : ''}`}
                                >
                                  <span className="whitespace-normal break-words leading-snug">
                                    {pos}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Date Hired Change Description */}
                <div>
                  Are you sure you want to change the employee&apos;s date hired?
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="date-hired">Date Hired</Label>
                    <Input
                      id="date-hired"
                      type="date"
                      value={newDateHired}
                      onChange={(e) => setNewDateHired(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                      max={new Date().toISOString().split("T")[0]} // Prevent future date
                    />
                  </div>
                </div>
              </>
            )}
          </>
        }
        buttonTitle={
          actionType === "toggleActive"
            ? rowData.active
              ? "Deactivate"
              : "Activate"
            : actionType === "changePosition"
              ? "Update Position"
              : actionType === "changeBranch"
                ? "Update Branch"
                : actionType === "changeDateHired"
                  ? "Update Date Hired"
                  : "Update Status"
        }
      />
    </div>
  );
}
