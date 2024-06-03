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

import { CalendarFold, Clock, Component, FlagTriangleRight, Info, InfoIcon, Map, NotebookPen, UserCircle, Users } from "lucide-react"
import { formatDate, formatTime } from "../table/data/activities/coa-columns"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { MdSignalWifiStatusbar1Bar } from "react-icons/md"
import { TbStatusChange } from "react-icons/tb"

interface CalendarSheetProps {
  activityData: any[]
  openSheet: boolean
  closeCalendarSheet: () => void
}
export function CalendarSheet({ activityData, openSheet, closeCalendarSheet }: CalendarSheetProps) {
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
    preparatoryList } = activityData[0];

  return (
    <Sheet open={openSheet} onOpenChange={closeCalendarSheet}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex flex-row gap-2 items-center">
            <div
              style={{ backgroundColor: user.color }}
              className="border rounded-full w-5 h-5 flex-shrink-0"
            ></div>
            {activityTitle}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 gap-5 flex flex-col items-start">
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
            <Badge variant={'outline'}>{status}
            {status === "Ongoing" && (
                <div className="h-3 w-3 rounded-full bg-green-600 animate-pulse ml-1"></div>
            )}</Badge>
          
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
            <FlagTriangleRight className="h-5 w-5 shrink-0" /> <Badge variant={'secondary'}>{type}</Badge>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Users className="shrink-0" />
            <div className="flex space-x-2 justify-start items-center">
              <Badge variant={'outline'}>{targetParticipant}</Badge>
            </div>
          </div>

          <div className="flex items-start space-x-2 mt-4">
            <Info className="h-5 w-5 shrink-0" />
            <p className="text-sm">{activityDescription}</p>
          </div>
        <Accordion type="single" collapsible>
          {preparatoryList.map((prep:any, index:number) => (
            <AccordionItem key={prep.id} value={prep.id}>
              <AccordionTrigger className="flex items-center justify-start space-x-2">
                <NotebookPen className="h-5 w-5 shrink-0" />
                <Label>Preparatory List {index+1}</Label>
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

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
