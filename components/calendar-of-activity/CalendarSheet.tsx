import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { CalendarFold, Clock, Component, FlagTriangleRight, Info, InfoIcon, Map, NotebookPen, TargetIcon, UserCircle, Users } from "lucide-react"
import { formatDate, formatTime, getStatusColor } from "../table/data/activities/coa-columns"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { TbNotes, TbStatusChange } from "react-icons/tb"
import { useUsers } from "../context/UsersContext"
import { FaQrcode } from "react-icons/fa"
import { useEffect, useState } from "react"
import { GenerateQRCodeWithLogo } from "../GenerateQrCodeWithLogo"
import { MdAttachment } from "react-icons/md"
import Profile from "../profile/Profile"

interface CalendarSheetProps {
  activityData: any[]
  openSheet: boolean
  closeCalendarSheet: () => void
}
export function CalendarSheet({ activityData, openSheet, closeCalendarSheet }: CalendarSheetProps) {
  const { usersData } = useUsers();
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
      preparatoryList,
      participants
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
    targetParticipant,
    location,
    status,
    attachments,
    remarks,
    participants,
    preparatoryList
  } = activityData[0];

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
              <UserCircle className="h-5 w-5 shrink-0" />
              <div className="flex space-x-2 justify-start items-center">
                <div className="flex space-x-2">
                  <Label className="flex items-center space-x-1 p-1 rounded-full border-2 shadow-md cursor-pointer" onClick={()=>  setOpenProfile(true)}>
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
              <Component className="h-5 w-5 shrink-0" />
              <Label>{user.component}</Label>
              {user.unit && <Label>- {user.unit}</Label>}
            </div>
            <div className="flex items-center space-x-2">
              <TbStatusChange className="h-5 w-5 shrink-0" />
              <Badge
                // variant={variant}
                className={`font-medium cursor-default shadow-md hover:${getStatusColor(status)
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
              <CalendarFold className="h-5 w-5 shrink-0" />
              <Label>
                {dateFrom === dateTo
                  ? formatDate(dateFrom)
                  : `${formatDate(dateFrom)} - ${formatDate(dateTo)}`}
              </Label>
            </div>
            {timeEnd && (
              <div className="flex items-center space-x-2 mt-2">
                <Clock className="h-5 w-5 shrink-0" />
                <Label>{formatTime(timeStart)} - {formatTime(timeEnd)}</Label>
              </div>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <Map className="h-5 w-5 shrink-0" /> <Label>{location}</Label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <FlagTriangleRight className="h-5 w-5 shrink-0" /> <Badge variant="secondary">{type}</Badge>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <TargetIcon className="shrink-0" />
              <div className="flex space-x-2 justify-start items-center">
                <Badge variant="outline" className="shadow-md">{targetParticipant}</Badge>
              </div>
            </div>
            <div className="flex items-start space-x-2 mt-4">
              <Info className="h-5 w-5 shrink-0" />
              <p className="text-sm">{activityDescription}</p>
            </div>

          </div>
          <div className="flex flex-col space-y-2">
            {attachments && (
              <div className="flex items-center space-x-2 mt-2">
                <MdAttachment className="h-5 w-5 shrink-0" />
                <Label>{attachments}</Label>
              </div>
            )}
            {remarks && (
              <div className="flex items-center space-x-2 mt-2">
                <TbNotes className="h-5 w-5 shrink-0" />
                <Label>{remarks}</Label>
              </div>
            )}

            <Accordion type="single" collapsible>
              <AccordionItem value="participants">
                <AccordionTrigger className="flex items-center justify-start space-x-2">
                  <div className="flex flex-row flex-start gap-2 items-center">
                    <Users className="shrink-0" />
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
                              <div className="flex justify-start p-1 items-center space-x-1 bg-[#F2F3F4] dark:bg-gray-800 rounded-full cursor-pointer border-2 border-[#E5E5E6]">
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
            <Accordion type="single" collapsible>
              {preparatoryList.map((prep: any, index: number) => (
                <AccordionItem key={prep.id} value={prep.id}>
                  <AccordionTrigger className="flex items-center justify-start space-x-2">
                    <div className="flex flex-row flex-start gap-2 items-center">
                      <NotebookPen className="h-5 w-5 shrink-0" />
                      <Label className="cursor-pointer">Preparatory List {index + 1}</Label>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 p-2 border rounded-lg">
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
            {qrCode && (
              <div className="flex flex-col">
                <div className="flex flex-row gap-2 mb-2">
                  <FaQrcode />
                  <Label className="font-semibold">QR Code:</Label>
                </div>
                <Image src={qrCode} width={250} height={250} alt="QR Code" />
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
      setProfileDialogClose={()=> setOpenProfile(!openProfile)}
      profileUserName={userName}/>
    </>
  )
}
