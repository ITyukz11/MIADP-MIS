import React from 'react'
import { ProcessDocReportType } from '@/app/(app)/component-1/components/forms/ProcessDocumentReportForm'
import Link from 'next/link'
import { FaList, FaPaperclip, FaSignature, FaUsers } from 'react-icons/fa'
import { Label } from '@/components/ui/label'
import { FaMapLocation } from 'react-icons/fa6'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { GrDocument } from 'react-icons/gr'
import { ViewField } from './ViewField'

type Props = {
  report: ProcessDocReportType
}

const ViewProcessDocumentationReport = (props: Props) => {
  const { report } = props

  return (
    <div className="flex flex-col justify-center gap-4 p-4 dark:bg-gray-800 dark:text-white">

      <div about='Activity Brief' className='flex flex-col'>
        <div className="flex items-center flex-row gap-2 w-full px-2">
          <Label className="font-bold text-2xl md:text-base">Activity Brief</Label>
          <FaList />
        </div>
        <section className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full dark:bg-gray-700 dark:text-white">
          <ViewField label="Activity Title" value={report.activityTitle} />
          <ViewField label="WFP Activity" value={report.WFPActivity} />
          <ViewField label="Activity Objectives" value={report.activityObjectives} isTextarea />
          <ViewField
            label="Date Conducted"
            value={report.dateConducted ? format(new Date(report.dateConducted), "PPP") : ""}
          />
        </section>
      </div>
      <div about='Venue' className='flex flex-col'>
        <div className="flex items-center flex-row gap-2 w-full">
          <Label className="font-bold text-2xl md:text-base">Venue</Label>
          <FaMapLocation />
        </div>
        <section className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full dark:bg-gray-700 dark:text-white">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <ViewField label="Region" value={report.region} />
            <ViewField label="Province" value={report.province} />
            <ViewField label="City" value={report.city} />
            <ViewField label="Municipality" value={report.municipality} />
            <ViewField label="Baranggay" value={report.baranggay} />
          </div>
        </section>
      </div>
      <div about='Total Participants'>
        <div className="flex items-center flex-row gap-2 w-full">
          <Label className="font-bold text-2xl md:text-base">Total Number of Participants</Label>
          <FaUsers />
        </div>
        <section about="Total-Participants"
          className="grid md:grid-cols-4 gap-4 bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full dark:bg-gray-700 dark:text-white">
          <ViewField label="Total Male IPs" value={report.totalMaleIP} />
          <ViewField label="Total Female IPs" value={report.totalFemaleIP} />
          <ViewField label="Total Male Non-IPs" value={report.totalMaleNonIP} />
          <ViewField label="Total Female Non-IPs" value={report.totalFemaleNonIP} />
        </section>
      </div>
      <div about='Process Documentation'>
        <div className="flex items-center flex-row gap-2 w-full">
          <Label className="font-bold text-2xl md:text-base">Process Documentations</Label>
          <GrDocument />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex flex-col gap-2'>
            <section about="Pre-Activity" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full dark:bg-gray-700 dark:text-white">
              <div className="space-y-4">
                <ViewField label="Pre Activity" value={report.preActivity} />
                <ViewField label="Pre Activity Description" value={report.preActivityDescription} isTextarea />
                <ViewField label="Pre Activity Output Quantity" value={report.preActivityOutputQty} />
                <ViewField label="Pre Activity Output Description" value={report.preActivityOutputDescription} isTextarea />
                <ViewField label="Pre Activity Outcome" value={report.preActivityOutcome} />
                <ViewField label="Pre Activity Emerging Impact" value={report.preActivityEmergingImpact} />
              </div>
            </section>
          </div>

          <section about="During-Activity" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full dark:bg-gray-700 dark:text-white">
            <div className="space-y-4">
              <ViewField label="During Activity" value={report.during} />
              <ViewField label="During Activity Description" value={report.duringDescription} isTextarea />
              <ViewField label="During Activity Output Quantity" value={report.duringOutputQty} />
              <ViewField label="During Activity Output Description" value={report.duringOutputDescription} isTextarea />
              <ViewField label="During Activity Outcome" value={report.duringOutcome} />
              <ViewField label="During Activity Emerging Impact" value={report.duringEmergingImpact} />
            </div>
          </section>
          <section about="Post-Activity" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full dark:bg-gray-700 dark:text-white">
            <div className="space-y-4">
              <ViewField label="Post Activity" value={report.postActivity} />
              <ViewField label="Post Activity Description" value={report.postActivityDescription} isTextarea />
              <ViewField label="Post Activity Output Quantity" value={report.postActivityOutputQty} />
              <ViewField label="Post Activity Output Description" value={report.postActivityOutputDescription} isTextarea />
              <ViewField label="Post Activity Outcome" value={report.postActivityOutcome} />
              <ViewField label="Post Activity Emerging Impact" value={report.postActivityEmergingImpact} />
            </div>
          </section>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className="flex items-center flex-row gap-2 w-full">
          <Label className="font-bold text-2xl md:text-base">Attachments</Label>
          <FaPaperclip />
        </div>
        <section className="flex flex-col bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full gap-2 dark:bg-gray-700 dark:text-white">
          <div className='grid md:grid-cols-2 gap-2'>
            {report.attendanceSheet && (
              <div className="grid grid-cols-2 items-start">
                <span className="text-sm">📎 Attendance Sheet</span>
                <Link
                  href={report.attendanceSheet.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-500 hover:text-blue-700"
                >
                  View
                </Link>
              </div>
            )}
            {report.program && (
              <div className="grid grid-cols-2 items-start">
                <span className="text-sm">📎 Program</span>
                <Link
                  href={report.program.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-500 hover:text-blue-700"
                >
                  View
                </Link>
              </div>
            )}
            {report.photoDocumentation && (
              <div className="grid grid-cols-2 items-start">
                <span className="text-sm">📎 Photo Documentation</span>
                <Link
                  href={report.photoDocumentation.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-500 hover:text-blue-700"
                >
                  View
                </Link>
              </div>
            )}
            {report.participantsProfile && (
              <div className="grid grid-cols-2 items-start">
                <span className="text-sm">📎 Participants Profile</span>
                <Link
                  href={report.participantsProfile.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-500 hover:text-blue-700"
                >
                  View
                </Link>
              </div>
            )}
            {report.presentationMaterials && (
              <div className="grid grid-cols-2 items-start">
                <span className="text-sm">📎 Presentation Materials</span>
                <Link
                  href={report.presentationMaterials.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-500 hover:text-blue-700"
                >
                  View
                </Link>
              </div>
            )}
          </div>
        </section>

      </div>
      <div className='flex flex-col'>
        <div className="flex items-center flex-row gap-2 w-full">
          <Label className="font-bold text-2xl md:text-base">Signatories</Label>
          <FaSignature />
        </div>
        <section about="Signatories" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 dark:bg-gray-700 dark:text-white">
          <div className="grid md:grid-cols-3 gap-2">
            <ViewField
              label="Prepared By"
              value={report.preparedByName}
              description="PSP Officer"
            />
            <ViewField
              label="Reviewed By"
              value={report.reviewedByName}
              description="SP Specialist"
            />
            <ViewField
              label="Noted By"
              value={report.notedByName}
              description="Component 1 Head"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default ViewProcessDocumentationReport;