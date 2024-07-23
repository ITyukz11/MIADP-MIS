'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Download, DownloadIcon, Eye, Table2Icon } from 'lucide-react'
import React, { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MdPreview } from 'react-icons/md'
import { PiThreadsLogo } from 'react-icons/pi'
import { ThreadDialog } from './(dialog)/thread'

type Props = {}

function Page({ }: Props) {
    const [openThread, setOpenThread] = useState<boolean>(false)
    const [documentId, setDocumentId] = useState<string>('')
    const documents = [
        { id: '1', subject: 'TEST SUBJECT TEST SUBJECT TEST SUBJECT ', from: 'PMEU', date: 'Jun 16', action: 'For compliance', remarks: 'remarks example' },
        { id: '2', subject: 'TEST SUBJECT TEST SUBJECT ', from: 'SES', date: 'Jul 1', action: 'For review', remarks: 'remarks example' },
        { id: '3', subject: 'TEST SUBJECT TEST SUBJECT TEST SUBJECT ', from: 'Component 2', date: 'Jun 30', action: 'For your information & reference', remarks: 'remarks example' },
    ];
    const handleOpenThread = (documentId:string)=>{
        setOpenThread(true)
        setDocumentId(documentId)
    }
    return (
        <>
            <Table>
                <TableCaption>List of Correspondence</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents.map(doc => (
                        <TableRow key={doc.id}>
                            <TableCell>{doc.id}</TableCell>
                            <TableCell>{doc.subject}</TableCell>
                            <TableCell>{doc.from}</TableCell>
                            <TableCell>{doc.date}</TableCell>
                            <TableCell>{doc.action}</TableCell>
                            <TableCell>{doc.remarks}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">...</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <MdPreview className="mr-2 h-4 w-4" />
                                                <span>Preview</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={()=> handleOpenThread(doc.id)}>
                                                <PiThreadsLogo className="mr-2 h-4 w-4" />
                                                <span>Thread</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <DownloadIcon className="mr-2 h-4 w-4" />
                                                <span>Download</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7}>
                            Total Correspondence: {documents.length}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <ThreadDialog open={openThread} setClose={()=> setOpenThread(!openThread)} data={documents} documentId={documentId}/>
        </>
    )
}

export default Page