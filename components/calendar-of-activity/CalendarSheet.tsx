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
import { formatDate, formatTime } from "../table/data/activities/coa-columns"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { MdOutlineNaturePeople, MdPeopleOutline, MdSignalWifiStatusbar1Bar } from "react-icons/md"
import { TbStatusChange } from "react-icons/tb"
import { useUsers } from "../context/UsersContext"
import { FaPeopleArrows, FaPeopleCarry } from "react-icons/fa"

interface CalendarSheetProps {
  activityData: any[]
  openSheet: boolean
  closeCalendarSheet: () => void
}
export function CalendarSheet({ activityData, openSheet, closeCalendarSheet }: CalendarSheetProps) {
  const { usersData } = useUsers();
  console.log("activityData: ", activityData)

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
    participants,
    preparatoryList } = activityData[0];
  console.log("participants: ", participants)
  return (
    <Sheet open={openSheet} onOpenChange={closeCalendarSheet}>
      <SheetContent className="overflow-y-auto scrollbar-thin sm:min-w-[40vw] h-full">
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
            <div className="flex items-center space-x-2 mt-2 cursor-pointer">
              <UserCircle className="h-5 w-5 shrink-0" />
              <div className="flex space-x-2 justify-start items-center">
                <div className="flex space-x-2">
                  <Label className="flex items-center space-x-1 px-3 py-1 rounded-full border-2">
                    <Image
                      className="rounded-full border-2"
                      src={'/miadp-pso.jpg'}
                      alt={'MIADP pso Logo'}
                      width={30}
                      height={30}
                    />
                    <div className="flex flex-col w-full items-center">
                      <Label className="text-sm font-medium">{userName}</Label>
                      <Label className="text-xs font-light">{user.position}</Label>
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
              <Badge variant="outline">{status}
                {status === "Ongoing" && (
                  <div className="h-3 w-3 rounded-full bg-green-600 animate-pulse ml-1"></div>
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
            <div className="flex items-center space-x-2 mt-2">
              <Clock className="h-5 w-5 shrink-0" />
              <Label>{formatTime(timeStart)} - {formatTime(timeEnd)}</Label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Map className="h-5 w-5 shrink-0" /> <Label>{location}</Label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <FlagTriangleRight className="h-5 w-5 shrink-0" /> <Badge variant="secondary">{type}</Badge>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <TargetIcon className="shrink-0" />
              <div className="flex space-x-2 justify-start items-center">
                <Badge variant="outline">{targetParticipant}</Badge>
              </div>
            </div>
            <div className="flex items-start space-x-2 mt-4">
              <Info className="h-5 w-5 shrink-0" />
              <p className="text-sm">{activityDescription}</p>
            </div>

          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 w-full">
              <Users className="shrink-0 mb-auto mt-3" />
              <Accordion type="single" collapsible>
                <AccordionItem value="participants">
                  <AccordionTrigger className="flex flex-row gap-1 justify-start cursor-pointer">
                    <Label className="cursor-pointer">Participants</Label><Badge variant="outline">{participants.length}</Badge>
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
                                  <div className={`flex items-center justify-center p-1 rounded-full text-white`}
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
            </div>
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
  )
}
