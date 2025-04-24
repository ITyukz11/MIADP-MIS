"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { Activity } from "@/types/calendar-of-activity/calendar-of-activity"
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaUser, FaBuilding, FaBriefcase, FaGlobe, FaClipboardList, FaGoogle, FaCommentAlt, FaPaperclip, FaPrint } from "react-icons/fa"
import { useUsersData } from "@/lib/users/useUserDataHook"
import { Separator } from "@/components/ui/separator"
import { Key } from "react"
import { formatDate, getStatusColor } from "@/components/table/data/activities/coa-columns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDateLong } from "@/utils/dateFormat"

export default function Page({ params }: { params: { id: string } }) {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { usersData, usersLoading, usersError } = useUsersData()

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`/api/activities/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch activity')
        }
        const data = await response.json()
        setActivity(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [params.id])

  if (loading || usersLoading) {
    return (
      <div className="p-6 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || usersError) {
    return <div className="p-6 text-center text-red-500">Error: {error || usersError?.message || 'An error occurred'}</div>
  }

  if (!activity) {
    return <div className="p-6 text-center">No activity found</div>
  }

  const participants = activity.participants.map((participant: any) => 
    usersData?.find((user: any) => user.id === participant.userId)
  ).filter(Boolean)

  const generateGoogleCalendarLink = (activity: Activity) => {
    const startDate = parseISO(activity.dateFrom);
    const endDate = parseISO(activity.dateTo);
    let startDateTime, endDateTime;
    
    if (activity.allDay) {
      startDateTime = format(startDate, "yyyyMMdd");
      endDateTime = format(endDate, "yyyyMMdd");
    } else {
      // Parse time strings into hours and minutes
      const [startHours, startMinutes] = activity.timeStart.split(':');
      const [endHours, endMinutes] = activity.timeEnd.split(':');
      
      // Set the time components on the dates
      startDate.setHours(parseInt(startHours), parseInt(startMinutes));
      endDate.setHours(parseInt(endHours), parseInt(endMinutes));
      
      startDateTime = format(startDate, "yyyyMMdd'T'HHmmss");
      endDateTime = format(endDate, "yyyyMMdd'T'HHmmss");
    }
    
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const text = encodeURIComponent(activity.activityTitle);
    const dates = `${startDateTime}/${endDateTime}`;
    const details = encodeURIComponent(activity.activityDescription);
    const location = encodeURIComponent(activity.location);

    return `${baseUrl}&text=${text}&dates=${dates}&details=${details}&location=${location}&allday=${activity.allDay}`;
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Add print-specific styles
    const printStyles = `
      <style>
        @media print {
          @page { 
            size: auto;
            margin: 20mm;
          }
          body {
            background: none !important;
            color: black !important;
            font-size: 12pt;
          }
          .container {
            width: 100% !important;
            max-width: none !important;
          }
          .card {
            box-shadow: none !important;
            background: white !important;
          }
          /* Ensure content fits on one page */
          .content {
            page-break-inside: avoid;
          }
        }
      </style>
    `;

    // Format date and time
    const formatDate = (dateString: string | number | Date) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // Create print content without background
    printWindow.document.write(`
      <html>
        <head>
          <title>${activity.activityTitle}</title>
          ${printStyles}
        </head>
        <body>
          <div class="content">
            <h1 style="text-align: center; font-size: 18pt; margin-bottom: 1em;">${activity.activityTitle}</h1>
            <p style="text-align: center; margin-bottom: 1em;">${activity.activityDescription}</p>
            <div style="margin-bottom: 1em;">
              <p><strong>Type:</strong> ${activity.type}</p>
              <p><strong>Status:</strong> ${activity.status}</p>
              <p><strong>Date:</strong> ${formatDate(activity.dateFrom)}${activity.dateFrom !== activity.dateTo ? ` - ${formatDate(activity.dateTo)}` : ''}</p>
              ${activity.allDay ? '<p><strong>Duration:</strong> All Day</p>' : `<p><strong>Time:</strong> ${formatTime(activity.timeStart)} - ${formatTime(activity.timeEnd)}</p>`}
              <p><strong>Location:</strong> ${activity.location}</p>
              <p><strong>WFP Year:</strong> ${activity.WFPYear}</p>
              <p><strong>Target Participants:</strong> ${activity.targetParticipant}</p>
              ${activity.otherType ? `<p><strong>Other Type:</strong> ${activity.otherType}</p>` : ''}
              ${activity.remarks ? `<p><strong>Remarks:</strong> ${activity.remarks}</p>` : ''}
            </div>
            ${activity.preparatoryContent ? `
              <div style="margin-top: 1em;">
                <h2 style="font-size: 14pt; margin-bottom: 0.5em;">Preparatory Content</h2>
                <p>${activity.preparatoryContent}</p>
              </div>
            ` : activity.preparatoryList?.length ? `
              <div style="margin-top: 1em;">
                <h2 style="font-size: 14pt; margin-bottom: 0.5em;">Preparatory List</h2>
                <ul>
                  ${activity.preparatoryList.map((item: any) => `
                    <li>${item.description} - ${item.status} ${item.remarks ? `(${item.remarks})` : ''}</li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
            ${participants.length ? `
              <div style="margin-top: 1em;">
                <h2 style="font-size: 14pt; margin-bottom: 0.5em;">Participants</h2>
                <ul>
                  ${participants.map((participant: any) => `
                    <li>${participant.name} - ${participant.region}</li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 relative bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url('/program-bg.webp')`, backgroundAttachment: 'fixed' }}>
      <div className="container mx-auto max-w-4xl relative z-10">
        <Card className="hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex justify-end">
              <Button 
                onClick={handlePrint}
                variant={'ghost'}
                className="inline-flex items-center text-sm"
              >
                <FaPrint />
              </Button>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-semibold text-center">{activity.activityTitle}</h2>
              <p className="text-gray-600 text-sm sm:text-base text-center">{activity.activityDescription}</p>
              <div className="flex justify-center flex-wrap gap-2">
                <Badge className="text-xs sm:text-sm">{activity.type}</Badge>
                <Badge
                  className={`text-xs sm:text-sm cursor-default shadow-md  dark:text-white hover:${getStatusColor(
                    activity.status
                  )} ${getStatusColor(activity.status)}`}
                >
                  {activity.status}
                  {activity.status === "Ongoing" && (
                    <div className="h-3 w-3 rounded-full bg-white animate-pulse ml-1"></div>
                  )}
                </Badge>
              </div>
              <div className="flex justify-center mt-2">
                <Link 
                  href={generateGoogleCalendarLink(activity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FaGoogle className="mr-2" />
                  Add to Google Calendar
                </Link>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold">Activity Details</h3>
                  <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex items-center"><FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /><strong>WFP Year:</strong> {activity.WFPYear}</div>
                  <div className="flex items-center"><FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /><strong>Date:</strong> 
                  {activity.dateFrom === activity.dateTo
                    ? formatDate(activity.dateFrom)
                    : `${formatDate(activity.dateFrom)} - ${formatDateLong(activity.dateTo)}`}
                  {/* {format(parseISO(activity.dateFrom), "PPP")} {activity.dateFrom !== activity.dateTo ? ` - ${format(parseISO(activity.dateTo), "PPP")}` : ""} */}
                  </div>
                  <div className="flex items-center"><FaClock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /><strong>Time:</strong> {activity.allDay ? "All day" : `${activity.timeStart} - ${activity.timeEnd}`}</div>
                  <div className="flex items-center"><FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /><strong>Location:</strong> {activity.location}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold">Encoded By</h3>
                  <FaUser className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex items-center"><FaUser className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /><strong>Name:</strong> {activity.userName}</div>
                  <div className="flex items-center"><FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /><strong>Component:</strong> {activity.user?.component}</div>
                  {activity.user?.unit && (
                    <div className="flex items-center"><FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /><strong>Unit:</strong> {activity.user.unit}</div>
                  )}
                  <div className="flex items-center"><FaBriefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /><strong>Position:</strong> {activity.user?.position}</div>
                  <div className="flex items-center"><FaGlobe className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /><strong>Region:</strong> {activity.user?.region}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-semibold">Target Participants</h3>
                <FaUsers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex items-center flex-wrap gap-2">
                {activity.targetParticipant.split(',').map((participant: string, index: Key | null | undefined) => (
                  <Badge key={index} className="text-xs sm:text-sm">
                    {participant.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            {(activity.preparatoryContent && (!activity.preparatoryList || activity.preparatoryList.length === 0 || (activity.preparatoryList.length === 1 && activity.preparatoryList[0].description.length === 0))) && (
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold">Preparatory Content</h3>
                  <FaClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: activity.preparatoryContent }} />
              </div>
            )}

            {(!activity.preparatoryContent && activity.preparatoryList && activity.preparatoryList.length > 0 && !(activity.preparatoryList.length === 1 && activity.preparatoryList[0].description.length === 0)) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold">Preparatory List</h3>
                  <FaClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <ul className="list-disc pl-5 text-sm sm:text-base">
                  {activity.preparatoryList.map((item: any, index: any) => (
                    <li key={index} className="mb-2">
                      <div><strong>Description:</strong> {item.description}</div>
                      <div><strong>Status:</strong> {item.status}</div>
                      {item.remarks && <div><strong>Remarks:</strong> {item.remarks}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activity.remarks && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold">Remarks</h3>
                  <FaCommentAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-sm sm:text-base">{activity.remarks}</p>
              </div>
            )}

            {participants && participants.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold">Participants</h3>
                  <FaUsers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {participants.map((participant: any, index: any) => (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                        <FaUser className="text-gray-600 w-6 h-6" />
                      </div>
                      <span className="text-sm">{participant?.name || 'Unknown'}</span>
                      <span className="text-xs text-gray-500">{participant?.region || 'Unknown Region'}</span>
                      <span className="text-xs text-gray-500">{participant?.component || 'Unknown Component'}</span>
                      {participant?.unit && (
                        <span className="text-xs text-gray-500">{participant.unit}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activity.calendarOfActivityAttachment && activity.calendarOfActivityAttachment.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold">Attachments</h3>
                  <FaPaperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                  {activity.calendarOfActivityAttachment.map((attachment: any, index: any) => (
                    <li key={index} className="flex items-center">
                      <FaClipboardList className="mr-2 text-gray-600" />
                      {attachment.link ? (
                        <a href={attachment.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {attachment.details || `Attachment ${index + 1}`}
                        </a>
                      ) : (
                        <span>{attachment.details || `Attachment ${index + 1}`}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
