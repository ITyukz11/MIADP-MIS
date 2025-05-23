import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  CalendarDays,
  CalendarFold,
  Clock,
  Component,
  FlagTriangleRight,
  Info,
  Map,
  NotebookPen,
  TargetIcon,
  UserCircle,
  Users,
} from "lucide-react";
import {
  formatDate,
  formatTime,
  getStatusColor,
} from "../table/data/activities/coa-columns";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { TbNotes, TbStatusChange } from "react-icons/tb";
import { FaExternalLinkAlt, FaLink, FaQrcode } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { GenerateQRCodeWithLogo } from "../GenerateQrCodeWithLogo";
import { MdAttachment, MdOutlineDateRange } from "react-icons/md";
import Profile from "../profile/Profile";
import Link from "next/link";
import { useDispatch, useSelector } from "@/app/store/store";
import { fetchUsersData } from "@/app/store/userAction";
import { TooltipComponent } from "../Tooltip";
import { RiAttachmentLine } from "react-icons/ri";
import { capitalizeEachWord } from "@/utils/capitalizeEachWord";
import { IoTrashOutline } from "react-icons/io5";
import { PiNotePencilBold } from "react-icons/pi";
import UpdateActivityDialog from "../dialog/update-dialog";
import ConfirmDeleteDialog from "../dialog/delete-dialog";
import { ToastAction } from "../ui/toast";
import { toast } from "../ui/use-toast";
import { deleteCalendarOfActivity } from "@/actions/calendar-of-activity/delete";
import { fetchActivitiesData } from "@/app/store/activityAction";
import DisplayContentDialog from "../dialog/display-content-dialog";
import { LoadingSpinner } from "../LoadingSpinner";
import { formatDateLong } from "@/utils/dateFormat";
import { truncateText } from "@/utils/truncateText";
import { useSession } from "next-auth/react";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { useUsersData } from "@/lib/users/useUserDataHook";

interface CalendarSheetProps {
  activityData: any[];
  openSheet: boolean;
  closeCalendarSheet: () => void;
}
export function CalendarSheet({
  activityData,
  openSheet,
  closeCalendarSheet,
}: CalendarSheetProps) {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);

  const [contentHTMLData, setContentHTMLData] = useState<string>("");
  const [contentDialogTitle, setContentDialogTitle] = useState<string>("");
  const [contentData, setContentData] = useState<string>("");

  const { refetchActivities } = useActivitiesData();

  const { data: currentUser } = useSession();
  const [forUpdateSelectedId, setForUpdateSelectedId] = useState<any>([])
  const [forDeleteSelectedId, setForDeleteSelectedId] = useState<any>([])

  const { usersData, usersLoading, usersError } = useUsersData()

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openContentDialog, setOpenContentDialog] = useState(false);

  const { activityLoading } = useSelector((state) => state.activity);



  useEffect(() => {
    // Ensure activityData is defined and has at least one element
    if (!activityData || activityData.length === 0) {
      return;
    }

    const {
      id,
      activityTitle,
      activityDescription,
      type,
      otherType,
      targetParticipant,
      location,
      dateFrom,
      dateTo,
      timeStart,
      timeEnd,
      attachments,
      status,
      remarks,
      userName,
      calendarOfActivityAttachment,
      preparatoryList,
      participants,
      preparatoryContent,
      createdAt,
      updatedAt,
      WFPYear,
      user
    } = activityData[0];

    // Format preparatoryList and participants
    const formattedPreparatoryList = preparatoryList
      .map(
        (
          item: { description: any; status: any; remarks: any },
          index: number
        ) => `
Preparatory Item ${index + 1}:
- Description: ${item.description}
- Status: ${item.status}
- Remarks: ${item.remarks}`
      )
      .join("\n");

    const formattedParticipants =
      participants.length > 0
        ? `Participants:\n${participants
          .map((participant: any, index: any) => {
            const user = usersData.find(
              (user: { id: any; }) => user.id === participant.userId
            );
            return `${index + 1}. ${user?.name}`;
          })
          .join("\n")}`
        : `Participants: -`;

    // Generate QR code data with redirect URL
    const redirectUrl = `https://miadp-mis.vercel.app/calendar-of-activities/${id}`;
    const qrData = redirectUrl;

    // Generate the QR code
    GenerateQRCodeWithLogo(qrData).then(setQrCode).catch(console.error);
  }, [activityData, usersData]);

  // Ensure activityData is defined and has at least one element
  if (!activityData || activityData.length === 0) {
    return null; // or render a fallback UI
  }

  const {
    user,
    id,
    activityTitle,
    userName,
    WFPYear,
    dateFrom,
    dateTo,
    timeStart,
    timeEnd,
    activityDescription,
    type,
    otherType,
    targetParticipant,
    location,
    status,
    attachments,
    remarks,
    participants,
    calendarOfActivityAttachment,
    preparatoryList,
    preparatoryContent,
    createdAt,
    updatedAt,
  } = activityData[0];

  const handleOpenUpdateDialog = () => {
    setOpenUpdateDialog(true);
    setForUpdateSelectedId([id]);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    setForDeleteSelectedId([id]);
  };

  const handleCancelUpdate = () => {
    setOpenUpdateDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    const response = await deleteCalendarOfActivity([id]);
    setLoadingDelete(false);

    if (response.success) {
      toast({
        title: "Success",
        description:
          "The calendar of activity you selected has been deleted successfully.",
        duration: 5000,
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });

      // dispatch(fetchActivitiesData());
      refetchActivities();
    } else {
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
      closeCalendarSheet();
    }
  };



  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  const formatProperDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      month: "short", // 'Aug'
      day: "numeric", // '6'
      year: "numeric", // '2024'
      hour: "2-digit", // 'hh'
      minute: "2-digit", // 'mm'
      hour12: true, // am/pm
    };

    // Format date and time
    const formattedDate = date.toLocaleString("en-US", options);

    // Format output as 'Aug 6, 2024 - hh:mm am/pm'
    return `${formattedDate.replace(/,/, " -")}`;
  };



  const handleOpenContentDialog = (
    title: string,
    content: string,
    html: string
  ) => {
    setContentHTMLData(html);
    setContentData(content);
    setContentDialogTitle(title);
    setOpenContentDialog(!openContentDialog);
  };

  const handleOpenLink = () => {
    window.open(`https://miadp-mis.vercel.app/calendar-of-activities/${id}`, '_blank');
  };
  return (
    <>
      <Sheet open={openSheet} onOpenChange={closeCalendarSheet}>
        <SheetContent className="overflow-y-auto scrollbar-thin sm:min-w-[600px] h-full">
          <SheetHeader>
            <SheetTitle className="flex flex-col md:flex-row gap-2 items-center pr-4 font-bold text-xs sm:text-sm md:text-base lg:text-lg">
              <div
                style={{ backgroundColor: user.color }}
                className="border rounded-full w-5 h-5 flex-shrink-0 md:flex hidden"
              ></div>
              {activityTitle}
              <div
                style={{ backgroundColor: user.color }}
                className="border w-full h-1 md:hidden"
              ></div>
            </SheetTitle>
            <div className="flex flex-col gap-2 absolute top-8 right-4">
              <FaExternalLinkAlt
                size={20}
                className="cursor-pointer"
                onClick={handleOpenLink}
              />
            </div>
            {user?.id === currentUser?.user?.id && (
              <div className="flex flex-col gap-2 absolute top-16 right-4">
                <PiNotePencilBold
                  size={20}
                  className="cursor-pointer"
                  onClick={handleOpenUpdateDialog}
                />
                <IoTrashOutline
                  size={20}
                  className="cursor-pointer"
                  onClick={handleOpenDeleteDialog}
                />
              </div>
            )}

          </SheetHeader>
          <div className="mt-4 gap-5 grid grid-cols-1 md:grid-cols-2 auto-rows-min">
            <div className="flex flex-col space-y-2 gap-5">
              <div className="flex items-center">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <UserCircle className="h-5 w-5 shrink-0" />
                    </div>
                  }
                  description="Encoder"
                />

                <div className="flex space-x-2 justify-start items-center ml-1">
                  <div className="flex space-x-2">
                    <Label
                      className="flex items-center space-x-1 p-1 rounded-full border-2 shadow-md cursor-pointer"
                      onClick={() => setOpenProfile(true)}
                    >
                      <Image
                        className="rounded-full border-2"
                        src={
                          user.region === "PSO"
                            ? "/miadp-pso.jpg"
                            : user.region === "RPCO 13"
                              ? "/miadp-region-xiii.jpg"
                              : user.region === "RPCO 12"
                                ? "/miadp-region-xii.jpg"
                                : user.region === "RPCO 11"
                                  ? "/miadp-region-xi.jpg"
                                  : user.region === "RPCO 10"
                                    ? "/miadp-region-x.jpg"
                                    : user.region === "RPCO 9"
                                      ? "/miadp-region-ix.jpg"
                                      : "/miadp-barmm.jpg"
                        }
                        alt={"MIADP pso Logo"}
                        width={30}
                        height={30}
                      />
                      <div className="flex flex-col w-full items-center pr-1 cursor-pointer">
                        <Label className="text-xs md:text-sm font-medium md:font-bold text-center cursor-pointer">
                          {capitalizeEachWord(userName)}
                        </Label>
                        <Label className="text-xs font-light  cursor-pointer">
                          {user.position}
                        </Label>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <Component className="h-5 w-5 shrink-0" />
                    </div>
                  }
                  description="Region - Component - Unit (if any)"
                />
                <Badge variant={"outline"} className="shadow-sm">
                  {user.region}-{user.component}
                  {user.unit && <>-{user.unit}</>}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <TbStatusChange className="h-5 w-5 shrink-0" />
                    </div>
                  }
                  description="Activity Status"
                />

                <Badge
                  // variant={variant}
                  className={`cursor-default shadow-md  dark:text-white hover:${getStatusColor(
                    status
                  )} ${getStatusColor(status)}`}
                >
                  {status}
                  {status === "Ongoing" && (
                    <div className="h-3 w-3 rounded-full bg-white animate-pulse ml-1"></div>
                  )}
                </Badge>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <FlagTriangleRight size={24} />
                    </div>
                  }
                  description="Activity Type"
                />
                <Badge variant={"secondary"} className="font-medium shadow-md">
                  {type} {otherType ? " - " + otherType : ""}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <CalendarFold className="h-5 w-5 shrink-0" />
                    </div>
                  }
                  description="Activity Date"
                />
                <Badge variant="outline" className="shadow-sm">
                  {dateFrom === dateTo
                    ? formatDate(dateFrom)
                    : `${formatDate(dateFrom)} - ${formatDateLong(dateTo)}`}
                </Badge>
              </div>
              {timeEnd && (
                <div className="flex items-center space-x-2 mt-2">
                  <TooltipComponent
                    trigger={
                      <div className="flex items-center cursor-help">
                        <Clock className="h-5 w-5 shrink-0" />
                      </div>
                    }
                    description="Activity Time"
                  />
                  <Badge variant="outline" className="shadow-sm">
                    {formatTime(timeStart)} - {formatTime(timeEnd)}
                  </Badge>
                </div>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <CalendarDays className="h-5 w-5 shrink-0" />
                    </div>
                  }
                  description="WFP Year"
                />
                <Badge variant="outline" className="shadow-sm">
                  {WFPYear}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <Map className="h-5 w-5 shrink-0" />
                    </div>
                  }
                  description="Activity Location"
                />
                <Badge variant="outline" className="shadow-sm">
                  {location}
                </Badge>
              </div>
              <div className="flex items-start space-x-2 mt-4">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <TargetIcon className="h-5 w-5 shrink-0" />
                    </div>
                  }
                  description="Activity Target Participants"
                />
                <Badge variant={"outline"} className=" shadow-sm">
                  {targetParticipant}
                </Badge>
              </div>
              <div className="flex items-start space-x-2 mt-4">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <Info className="h-5 w-5 shrink-0" />
                    </div>
                  }
                  description="Activity Description"
                />
                <Badge
                  variant={"outline"}
                  className="cursor-pointer shadow-sm"
                  onClick={() =>
                    handleOpenContentDialog(
                      "Activity Description",
                      activityDescription,
                      ""
                    )
                  }
                >
                  {truncateText(activityDescription, 200)}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              {attachments && (
                <div className="flex items-center space-x-2 mt-2">
                  <TooltipComponent
                    trigger={
                      <div className="flex items-center cursor-help">
                        <MdAttachment className="h-5 w-5 shrink-0" />
                      </div>
                    }
                    description="Activity Attachment"
                  />
                  {isValidUrl(attachments) ? (
                    <Link href={attachments} passHref>
                      <a target="_blank" rel="noopener noreferrer">
                        <Label>{attachments}</Label>
                      </a>
                    </Link>
                  ) : (
                    <Label>(Not a link) {attachments}</Label>
                  )}
                </div>
              )}
              {remarks && (
                <div className="flex items-center space-x-2 mt-2 pr-2">
                  <TooltipComponent
                    trigger={
                      <div className="flex items-center cursor-help">
                        <TbNotes className="h-5 w-5 shrink-0" />
                      </div>
                    }
                    description="Activity Remarks"
                  />
                  <Badge
                    variant={"outline"}
                    className="cursor-pointer shadow-sm"
                    onClick={() =>
                      handleOpenContentDialog("Remarks", remarks, "")
                    }
                  >
                    {remarks}
                  </Badge>
                </div>
              )}

              {participants[0] && (
                <>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="participants">
                      <AccordionTrigger className="flex items-center justify-start space-x-2">
                        <div className="flex flex-row flex-start gap-2 items-center">
                          <TooltipComponent
                            trigger={
                              <div className="flex items-center cursor-help">
                                <Users className="shrink-0" />
                              </div>
                            }
                            description="Activity Participants"
                          />
                          <Label className="cursor-pointer">Participants</Label>
                          <Badge variant="outline">{participants.length}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap justify-start gap-1 p-2 border rounded-lg">
                          {participants.map(
                            (participant: { userId: string }, index: number) => {
                              const user = usersData.find(
                                (user: { id: string }) => user.id === participant.userId
                              );
                              return (
                                <div
                                  key={participant.userId}
                                  className="flex flex-wrap cursor-pointer"
                                >
                                  {user ? (
                                    <>
                                      <div className="flex justify-start p-1 shadow-md items-center space-x-1 rounded-full cursor-pointer border-2 border-[#E5E5E6]">
                                        <div
                                          className={`flex items-center justify-center px-1 rounded-full text-white`}
                                          style={{
                                            backgroundColor: user.color,
                                          }}
                                        >
                                          <Label className="text-xs font-normal">
                                            {user.name
                                              .split(" ")
                                              .map((n: string) => n[0])
                                              .join("")}
                                          </Label>
                                        </div>
                                        <Label className="text-xs font-normal text-black dark:text-white">
                                          {capitalizeEachWord(user.name)}
                                        </Label>
                                      </div>
                                    </>
                                  ) : (
                                    <Badge variant="outline">
                                      <Label>User details not found.</Label>
                                    </Badge>
                                  )}
                                  {usersLoading && <LoadingSpinner />}
                                  {usersError && (
                                    <Label className="text-destructive">
                                      {usersError}
                                    </Label>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              )}

              {preparatoryContent ? (
                <Accordion type="single" collapsible>
                  <AccordionItem value={"2"}>
                    <AccordionTrigger className="flex items-center justify-start space-x-2">
                      <div className="flex flex-row flex-start gap-2 items-center">
                        <TooltipComponent
                          trigger={
                            <div className="flex items-center cursor-help">
                              <NotebookPen className="h-5 w-5 shrink-0" />
                            </div>
                          }
                          description="Activity Preparatories"
                        />
                        <Label className="cursor-pointer">
                          Preparatory Content
                        </Label>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="flex text-sm flex-col space-y-2 p-2 border rounded-lg shadow-md cursor-pointer"
                        onClick={() =>
                          handleOpenContentDialog(
                            "Preparatory Content",
                            "",
                            preparatoryContent
                          )
                        }
                        dangerouslySetInnerHTML={{
                          __html: truncateText(preparatoryContent, 200),
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Accordion type="single" collapsible>
                  {preparatoryList.map((prep: any, index: number) => (
                    <AccordionItem key={prep.id} value={prep.id}>
                      <AccordionTrigger className="flex items-center justify-start space-x-2">
                        <div className="flex flex-row flex-start gap-2 items-center">
                          <TooltipComponent
                            trigger={
                              <div className="flex items-center cursor-help">
                                <NotebookPen className="h-5 w-5 shrink-0" />
                              </div>
                            }
                            description="Activity Preparatories"
                          />
                          <Label className="cursor-pointer">
                            Preparatory List {index + 1}
                          </Label>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2 p-2 border rounded-lg shadow-md">
                          <div>
                            <strong>Description:</strong> {prep.description}
                          </div>
                          <div>
                            <strong>Status:</strong> {prep.status || "None"}
                          </div>
                          <div>
                            <strong>Remarks:</strong> {prep.remarks || "None"}
                          </div>
                          <div>
                            <strong>Created At:</strong>{" "}
                            {new Date(prep.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              {calendarOfActivityAttachment &&
                calendarOfActivityAttachment.length > 0 &&
                calendarOfActivityAttachment[0].details && (
                  <Accordion type="single" collapsible>
                    {calendarOfActivityAttachment.map(
                      (attachment: any, index: number) => (
                        <AccordionItem
                          key={attachment.id}
                          value={attachment.id}
                        >
                          <AccordionTrigger className="flex items-center justify-start space-x-2">
                            <div className="flex flex-row flex-start gap-2 items-center">
                              <TooltipComponent
                                trigger={
                                  <div className="flex items-center cursor-help">
                                    <RiAttachmentLine className="h-5 w-5 shrink-0" />
                                  </div>
                                }
                                description="Activity Attachments"
                              />
                              <Label className="cursor-pointer">
                                Attachment {index + 1}
                              </Label>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col space-y-2 p-2 border rounded-lg shadow-md pr-2">
                              <div>
                                <strong>Details:</strong>{" "}
                                <Label className="break-words">
                                  {" "}
                                  {attachment.details}
                                </Label>
                              </div>
                              <div>
                                <strong>Link: </strong>
                                {isValidUrl(attachment.link) ? (
                                  <Link
                                    href={attachment.link}
                                    passHref
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className=" text-blue-500 hover:text-blue-400 cursor-pointer break-words"
                                  >
                                    <Label className="cursor-pointer">
                                      {attachment.link}
                                    </Label>
                                  </Link>
                                ) : (
                                  <Label>(Not a link) {attachment.link}</Label>
                                )}
                              </div>
                              <div>
                                <strong>Created At:</strong>{" "}
                                {new Date(
                                  attachment.createdAt
                                ).toLocaleString()}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                )}

              {qrCode && (
                <div className="flex flex-col">
                  <div className="flex flex-row gap-2 mb-2">
                    <TooltipComponent
                      trigger={
                        <div className="flex items-center cursor-help">
                          <FaQrcode />
                        </div>
                      }
                      description="Scanned me!"
                    />
                    <Label className="font-semibold">QR Code:</Label>
                  </div>
                  <Image
                    src={qrCode}
                    className="shadow-md"
                    width={250}
                    height={250}
                    alt="QR Code"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <MdOutlineDateRange size={24} />
                    </div>
                  }
                  description="Date Created"
                />
                <Badge variant={"outline"} className="font-medium shadow-md bg-green-800 text-white">
                  {formatProperDateTime(createdAt)}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={
                    <div className="flex items-center cursor-help">
                      <MdOutlineDateRange size={24} />
                    </div>
                  }
                  description="Date Updated"
                />
                <Badge variant={"outline"} className="font-medium shadow-md bg-yellow-800 text-white">
                  {formatProperDateTime(updatedAt)}
                </Badge>
              </div>
            </div>
          </div>

          {/* 
        <SheetFooter>
          <SheetClose asChild>
            <Label>Activity</Label>
          </SheetClose>
        </SheetFooter> */}
        </SheetContent>
      </Sheet>
      <Profile
        openProfileDialog={openProfile}
        setProfileDialogClose={() => setOpenProfile(!openProfile)}
        profileUserName={userName}
      />
      <DisplayContentDialog
        html={contentHTMLData}
        title={contentDialogTitle}
        content={contentData}
        openDeleteDialog={openContentDialog}
        setDeleteDialogClose={() => setOpenContentDialog(!openContentDialog)}
      />
      <UpdateActivityDialog
        activityId={forUpdateSelectedId}
        onCancel={handleCancelUpdate}
        openUpdateDialog={openUpdateDialog}
        setUpdateDialogClose={setOpenUpdateDialog}
        loadingUpdate={activityLoading}
      />
      <ConfirmDeleteDialog
        items={forDeleteSelectedId}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        openDeleteDialog={openDeleteDialog}
        setDeleteDialogClose={() => setOpenDeleteDialog(!openDeleteDialog)}
        loading={loadingDelete}
      />
    </>
  );
}
