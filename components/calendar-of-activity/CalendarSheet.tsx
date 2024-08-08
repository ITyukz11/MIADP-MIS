import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { CalendarFold, Clock, Component, FlagTriangleRight, Info, Map, NotebookPen, TargetIcon, UserCircle, Users } from "lucide-react"
import { formatDate, formatTime, getStatusColor } from "../table/data/activities/coa-columns"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { TbNotes, TbStatusChange } from "react-icons/tb"
import { FaQrcode } from "react-icons/fa"
import { useEffect, useState } from "react"
import { GenerateQRCodeWithLogo } from "../GenerateQrCodeWithLogo"
import { MdAttachment, MdDateRange, MdOutlineDateRange } from "react-icons/md"
import Profile from "../profile/Profile"
import Link from "next/link"
import { useDispatch, useSelector } from "@/app/store/store"
import { fetchUsersData } from "@/app/store/userAction"
import { TooltipComponent } from "../Tooltip"
import { RiAttachmentLine } from "react-icons/ri"

interface CalendarSheetProps {
  activityData: any[]
  openSheet: boolean
  closeCalendarSheet: () => void
}
export function CalendarSheet({ activityData, openSheet, closeCalendarSheet }: CalendarSheetProps) {

  const dispatch = useDispatch();
  const { usersData, loadingUser, errorUser } = useSelector((state) => state.users)

  useEffect(() => {
    if (usersData.length === 0) {
      dispatch(fetchUsersData());
    }
  }, [dispatch, usersData.length]);

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [openProfile, setOpenProfile] = useState(false)

  useEffect(() => {
    // Ensure activityData is defined and has at least one element
    if (!activityData || activityData.length === 0) {
      return;
    }

    const {
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
      createdAt
    } = activityData[0];

    // Format preparatoryList and participants
    const formattedPreparatoryList = preparatoryList.map((item: { description: any; status: any; remarks: any }, index: number) => `
Preparatory Item ${index + 1}:
- Description: ${item.description}
- Status: ${item.status}
- Remarks: ${item.remarks}`).join('\n');

    const formattedParticipants = participants.length > 0
      ? `Participants:\n${participants.map((participant: any, index: any) => {
        const user = usersData.find(user => user.id === participant.userId);
        return `${index + 1}. ${user?.name}`;
      }).join('\n')}`
      : `Participants: -`;

    // Generate formatted QR code data
    const qrData = `Activity Title: ${activityTitle}\n
Activity Description: ${activityDescription}\n
Type: ${type}\n
${otherType ? `Other Type: ${otherType}` : ''}
Target Participant: ${targetParticipant}\n
Location: ${location}\n
Date From: ${formatDate(dateFrom) || '-'}\n
Date To: ${formatDate(dateTo) || '-'}\n
Time Start: ${formatTime(timeStart) || '-'}\n
Time End: ${formatTime(timeEnd) || '-'}\n
Attachments: ${attachments || '-'}\n
Status: ${status || '-'}\n
Remarks: ${remarks || '-'}\n
Author: ${userName || '-'}\n
${formattedParticipants}
${formattedPreparatoryList}`;

    // Generate the QR code
    GenerateQRCodeWithLogo(qrData).then(setQrCode).catch(console.error);
  }, [activityData, usersData]);

  // Ensure activityData is defined and has at least one element
  if (!activityData || activityData.length === 0) {
    return null; // or render a fallback UI
  }

  const {
    user,
    activityTitle,
    userName,
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
    createdAt
  } = activityData[0];

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
        month: 'short', // 'Aug'
        day: 'numeric', // '6'
        year: 'numeric', // '2024'
        hour: '2-digit', // 'hh'
        minute: '2-digit', // 'mm'
        hour12: true // am/pm
    };

    // Format date and time
    const formattedDate = date.toLocaleString('en-US', options);

    // Format output as 'Aug 6, 2024 - hh:mm am/pm'
    return `${formattedDate.replace(/,/, ' -')}`;
};

  return (
    <>
      <Sheet open={openSheet} onOpenChange={closeCalendarSheet}>
        <SheetContent className="overflow-y-auto scrollbar-thin sm:min-w-[600px] h-full">
          <SheetHeader>
            <SheetTitle className="flex flex-row gap-2 items-center">
              <div
                style={{ backgroundColor: user.color }}
                className="border rounded-full w-5 h-5 flex-shrink-0"
              ></div>
              {activityTitle}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 gap-5 grid grid-cols-1 md:grid-cols-2 auto-rows-min">
            <div className="flex flex-col space-y-2 gap-5">
              <div className="flex items-center">
                <TooltipComponent
                  trigger={<div className='flex items-center cursor-help'><UserCircle className="h-5 w-5 shrink-0" /></div>}
                  description="Encoder"
                />

                <div className="flex space-x-2 justify-start items-center ml-1">
                  <div className="flex space-x-2">
                    <Label className="flex items-center space-x-1 p-1 rounded-full border-2 shadow-md cursor-pointer" onClick={() => setOpenProfile(true)}>
                      <Image
                        className="rounded-full border-2"
                        src={user.region === 'PSO' ? '/miadp-pso.jpg' :
                          user.region === 'RPCO 13' ? '/miadp-region-xiii.jpg' :
                            user.region === 'RPCO 12' ? '/miadp-region-xii.jpg' :
                              user.region === 'RPCO 11' ? '/miadp-region-xi.jpg' :
                                user.region === 'RPCO 10' ? '/miadp-region-x.jpg' :
                                  user.region === 'RPCO 9' ? '/miadp-region-ix.jpg' :
                                    '/miadp-barmm.jpg'
                        }
                        alt={'MIADP pso Logo'}
                        width={30}
                        height={30}
                      />
                      <div className="flex flex-col w-full items-center pr-1 cursor-pointer">
                        <Label className="text-sm font-medium  cursor-pointer">{userName}</Label>
                        <Label className="text-xs font-light  cursor-pointer">{user.position}</Label>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TooltipComponent
                  trigger={<div className='flex items-center cursor-help'><Component className="h-5 w-5 shrink-0" /></div>}
                  description="Region - Component - Unit (if any)"
                />
                <Badge variant={'outline'} className="shadow-sm">
                  {user.region}-
                  {user.component}
                  {user.unit && <>-{user.unit}</>}
                </Badge>

              </div>
              <div className="flex items-center space-x-2">
                <TooltipComponent
                  trigger={<div className='flex items-center cursor-help'><TbStatusChange className="h-5 w-5 shrink-0" /></div>}
                  description="Activity Status"
                />

                <Badge
                  // variant={variant}
                  className={`font-medium cursor-default shadow-md  dark:text-white hover:${getStatusColor(status)
                    } ${getStatusColor(status)
                    }`}
                >
                  {status}
                  {status === "Ongoing" && (
                    <div className="h-3 w-3 rounded-full bg-white animate-pulse ml-1"></div>
                  )}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={<div className='flex items-center cursor-help'><MdOutlineDateRange size={24} /></div>}
                  description="Date Created"
                />
                <Badge variant={'outline'} className="font-medium shadow-md">{formatProperDateTime(createdAt)}</Badge>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={<div className='flex items-center cursor-help'><FlagTriangleRight size={24} /></div>}
                  description="Activity Type"
                />
                <Badge variant={'secondary'} className="font-medium shadow-md">{type} {otherType ? ' - ' + otherType : ''}</Badge>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={<div className='flex items-center cursor-help'><CalendarFold className="h-5 w-5 shrink-0" /></div>}
                  description="Activity Date"
                />
                <Badge variant='outline' className="shadow-sm">
                  {dateFrom === dateTo
                    ? formatDate(dateFrom)
                    : `${formatDate(dateFrom)} - ${formatDate(dateTo)}`}
                </Badge>
              </div>
              {timeEnd && (
                <div className="flex items-center space-x-2 mt-2">
                  <TooltipComponent
                    trigger={<div className='flex items-center cursor-help'><Clock className="h-5 w-5 shrink-0" /></div>}
                    description="Activity Time"
                  />
                  <Badge variant='outline' className="shadow-sm">
                    {formatTime(timeStart)} - {formatTime(timeEnd)}
                  </Badge>
                </div>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <TooltipComponent
                  trigger={<div className='flex items-center cursor-help'><Map className="h-5 w-5 shrink-0" /></div>}
                  description="Activity Location"
                />
                <Badge variant='outline' className="shadow-sm">{location}</Badge>
              </div>
              <div className="flex items-start space-x-2 mt-4">
                <TooltipComponent
                  trigger={<div className='flex items-center cursor-help'><TargetIcon className="h-5 w-5 shrink-0" /></div>}
                  description="Activity Target Participants"
                />
                <Badge variant={'outline'} className=" shadow-sm">
                  <p className="text-xs">{targetParticipant}</p>
                </Badge>
              </div>
              <div className="flex items-start space-x-2 mt-4">
                <TooltipComponent
                  trigger={<div className='flex items-center cursor-help'><Info className="h-5 w-5 shrink-0" /></div>}
                  description="Activity Description"
                />
                <Badge variant={'outline'} className=" shadow-sm">
                  <p className="text-xs">{activityDescription}</p>
                </Badge>
              </div>

            </div>
            <div className="flex flex-col space-y-2">
              {attachments && (
                <div className="flex items-center space-x-2 mt-2">
                  <TooltipComponent
                    trigger={<div className='flex items-center cursor-help'><MdAttachment className="h-5 w-5 shrink-0" /></div>}
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
                <div className="flex items-center space-x-2 mt-2">
                  <TooltipComponent
                    trigger={<div className='flex items-center cursor-help'><TbNotes className="h-5 w-5 shrink-0" /></div>}
                    description="Activity Remarks"
                  />
                  <Label>{remarks}</Label>
                </div>
              )}

              <Accordion type="single" collapsible>
                <AccordionItem value="participants">
                  <AccordionTrigger className="flex items-center justify-start space-x-2">
                    <div className="flex flex-row flex-start gap-2 items-center">
                      <TooltipComponent
                        trigger={<div className='flex items-center cursor-help'><Users className="shrink-0" /></div>}
                        description="Activity Participants"
                      />
                      <Label className="cursor-pointer">Participants</Label><Badge variant="outline">{participants.length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap justify-start gap-1 p-2 border rounded-lg">
                      {participants.map((participant: any, index: number) => {
                        const user = usersData.find(user => user.id === participant.userId);
                        return (
                          <div key={index} className="flex flex-wrap cursor-pointer">
                            {user ? (
                              <>
                                <div className="flex justify-start p-1 shadow-md items-center space-x-1 rounded-full cursor-pointer border-2 border-[#E5E5E6]">
                                  <div className={`flex items-center justify-center px-1 rounded-full text-white`}
                                    style={{ backgroundColor: user.color }}>
                                    <Label className="text-xs font-normal">{user.name.split(' ').map((n: string) => n[0]).join('')}</Label>
                                  </div>
                                  <Label className="text-xs font-normal text-black dark:text-white">{user.name}</Label>
                                </div>
                              </>
                            ) : (
                              <Badge variant="outline">
                                <Label>User details not found.</Label>
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {preparatoryContent ?
                <Accordion type="single" collapsible>
                  <AccordionItem value={"2"}>
                    <AccordionTrigger className="flex items-center justify-start space-x-2">
                      <div className="flex flex-row flex-start gap-2 items-center">
                        <TooltipComponent
                          trigger={<div className='flex items-center cursor-help'><NotebookPen className="h-5 w-5 shrink-0" /></div>}
                          description="Activity Preparatories"
                        />
                        <Label className="cursor-pointer">Preparatory Content</Label>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-2 p-2 border rounded-lg shadow-md" dangerouslySetInnerHTML={{ __html: preparatoryContent }} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> :
                <Accordion type="single" collapsible>
                  {preparatoryList.map((prep: any, index: number) => (
                    <AccordionItem key={prep.id} value={prep.id}>
                      <AccordionTrigger className="flex items-center justify-start space-x-2">
                        <div className="flex flex-row flex-start gap-2 items-center">
                          <TooltipComponent
                            trigger={<div className='flex items-center cursor-help'><NotebookPen className="h-5 w-5 shrink-0" /></div>}
                            description="Activity Preparatories"
                          />
                          <Label className="cursor-pointer">Preparatory List {index + 1}</Label>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2 p-2 border rounded-lg shadow-md">
                          <div>
                            <strong>Description:</strong> {prep.description}
                          </div>
                          <div>
                            <strong>Status:</strong> {prep.status || 'None'}
                          </div>
                          <div>
                            <strong>Remarks:</strong> {prep.remarks || 'None'}
                          </div>
                          <div>
                            <strong>Created At:</strong> {new Date(prep.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              }
              {calendarOfActivityAttachment && (
                <Accordion type="single" collapsible>
                  {calendarOfActivityAttachment.map((attachment: any, index: number) => (
                    <AccordionItem key={attachment.id} value={attachment.id}>
                      <AccordionTrigger className="flex items-center justify-start space-x-2">
                        <div className="flex flex-row flex-start gap-2 items-center">
                          <TooltipComponent
                            trigger={<div className='flex items-center cursor-help'><RiAttachmentLine className="h-5 w-5 shrink-0" /></div>}
                            description="Activity Attachments"
                          />
                          <Label className="cursor-pointer">Attachment {index + 1}</Label>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2 p-2 border rounded-lg shadow-md pr-2">
                          <div>
                            <strong>Details:</strong> <Label className="break-words"> {attachment.details}</Label>
                          </div>
                          <div>
                            <strong>Link: </strong>
                            {isValidUrl(attachment.link) ? (
                              <Link href={attachment.link} passHref target="_blank" rel="noopener noreferrer"
                                className=" text-blue-500 hover:text-blue-400 cursor-pointer break-words">
                                <Label>{attachment.link}</Label>
                              </Link>
                            ) : (
                              <Label>(Not a link) {attachment.link}</Label>
                            )}
                          </div>
                          <div>
                            <strong>Created At:</strong> {new Date(attachment.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              {qrCode && (
                <div className="flex flex-col">
                  <div className="flex flex-row gap-2 mb-2">
                    <TooltipComponent
                      trigger={<div className='flex items-center cursor-help'><FaQrcode /></div>}
                      description="Scanned me!"
                    />
                    <Label className="font-semibold">QR Code:</Label>
                  </div>
                  <Image src={qrCode} className="shadow-md" width={250} height={250} alt="QR Code" />
                </div>
              )}


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
        profileUserName={userName} />
    </>
  )
}
