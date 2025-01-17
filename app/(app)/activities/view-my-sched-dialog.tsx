import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaCalendarAlt } from "react-icons/fa";
import { DataTable } from "@/components/table/data-table";
import { useCurrentUser } from "@/components/context/CurrentUserContext";
import { columns } from "@/components/table/data/activities/coa-columns";
import TrashLottieAnimation from "@/components/lottie-icon-animations/Trash";
import AssignmentLottieAnimation from "@/components/lottie-icon-animations/Assignment";
import ConfirmDeleteDialog from "@/components/dialog/delete-dialog";
import { deleteCalendarOfActivity } from "@/actions/calendar-of-activity/delete";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateActivityDialog from "@/components/dialog/update-dialog";
import { updateCalendarOfActivity } from "@/actions/calendar-of-activity/update";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useDispatch, useSelector } from "@/app/store/store";
import { fetchActivitiesData } from "@/app/store/activityAction";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";

type Props = {};

export const ViewMySchedDialog = (props: Props) => {
  // const { activities, loading, error, fetchActivitiesData } = useCalendarOfActivityContext();
  // const {activitiesData, activityLoading, activityError} =useSelector((state)=> state.activity)
  const { activitiesData, activityError, activityLoading } =
    useActivitiesData();
  const { currentUser } = useCurrentUser();

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isHoveredTrash, setIsHoveredTrash] = useState(false);
  const [isHoveredAssignment, setIsHoveredAssignment] = useState(false);

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  console.log("currentUser: ", currentUser);
  console.log("filteredData: ", filteredData);

  const dispatch = useDispatch();

  const handleSelectedRowIdsChange = (selectedIds: string[]) => {
    setSelectedRowIds(selectedIds);
    // console.log('Selected row IDs:', selectedIds);
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    const response = await deleteCalendarOfActivity(selectedRowIds);
    setLoadingDelete(false);

    if (response.success) {
      setAlert({ type: "success", message: response.success });
      toast({
        title: "Success",
        description:
          "The calendar of activity you selected has been deleted successfully.",
        duration: 5000,
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });

      dispatch(fetchActivitiesData());
    } else {
      setAlert({
        type: "error",
        message: response.error ?? "An unexpected error occurred.",
      });
      toast({
        title: "Error",
        variant: "destructive",
        description: response.error ?? "An unexpected error occurred.",
        duration: 5000,
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
    }
    if (!activityLoading && !loadingDelete) {
      setOpenDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    // Handle cancel action here
    setOpenDeleteDialog(false);
  };

  const handleCancelUpdate = () => {
    setOpenUpdateDialog(false);
  };

  useEffect(() => {
    if (currentUser && currentUser.id && activitiesData) {
      const filtered = activitiesData.filter(
        (activity: any) => activity.user?.id === currentUser.id
      );
      setFilteredData(filtered);
    }
  }, [currentUser, activitiesData]);
  const hiddenColumns = [
    "id",
    "authorizeOther",
    "targetParticipant",
    "activityDescription",
    "timeStart",
    "timeEnd",
    "coa_id",
    "remarks",
    "userName",
  ]; // Columns to hide
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row items-center gap-1 justify-center overflow-hidden text-xs lg:text-sm"
        >
          <FaCalendarAlt className="shrink-0" size={20} />
          <span className="md:block hidden"> View encoded activities</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Encoded Activities</DialogTitle>
          <DialogDescription className="flex flex-row">
            Total activities: <b>{filteredData.length}</b>. You can update and
            delete your encoded activities here.
            {activityLoading && (
              <Label className="text-xs flex flex-row gap-2 items-center ml-auto italic">
                Fetching new data <LoadingSpinner />
              </Label>
            )}
          </DialogDescription>
          <div className="flex flex-row gap-2 mt-2">
            <Button
              variant="outline"
              onMouseEnter={() => setIsHoveredAssignment(true)}
              onMouseLeave={() => setIsHoveredAssignment(false)}
              onClick={() => setOpenUpdateDialog(true)}
            >
              <AssignmentLottieAnimation
                width={25}
                height={25}
                isHovered={isHoveredAssignment}
              />
              Update
            </Button>
            <Button
              variant="outline"
              onMouseEnter={() => setIsHoveredTrash(true)}
              onMouseLeave={() => setIsHoveredTrash(false)}
              onClick={() => setOpenDeleteDialog(true)}
              disabled={loadingDelete}
            >
              <TrashLottieAnimation
                width={25}
                height={25}
                isHovered={isHoveredTrash}
              />
              Delete
            </Button>
            <ConfirmDeleteDialog
              items={selectedRowIds}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
              openDeleteDialog={openDeleteDialog}
              setDeleteDialogClose={() =>
                setOpenDeleteDialog(!openDeleteDialog)
              }
              loading={loadingDelete}
            />

            <UpdateActivityDialog
              activityId={selectedRowIds}
              onCancel={handleCancelUpdate}
              openUpdateDialog={openUpdateDialog}
              setUpdateDialogClose={setOpenUpdateDialog}
              loadingUpdate={activityLoading}
            />
          </div>
        </DialogHeader>
        <div className="w-full overflow-x-auto scrollbar-thin">
          <DataTable
            data={filteredData}
            columns={columns}
            hiddenColumns={hiddenColumns}
            onSelectedRowIdsChange={handleSelectedRowIdsChange}
            allowSelectRow={true}
            allowDateRange={true}
            allowExportToExcel
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
