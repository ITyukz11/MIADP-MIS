'use client'
import { Button, buttonVariants } from '@/components/ui/button'
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
import { IncomingRoutingSlipDialog } from './(dialog)/incoming-routing-slip-dialog'
import { MdPreview } from 'react-icons/md'
import { PiThreadsLogo } from 'react-icons/pi'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import IncOrOutDialog from './(dialog)/incoming-or-outgoing-dialog'
import { OutgoingFormDialog } from './(dialog)/outgoing-form-dialog'

type Props = {}

interface CorrespondenceLayoutProps {
    children: React.ReactNode
}

export default function CorrespondenceLayout({ children }: CorrespondenceLayoutProps) {
    const [addIncomingRoutingSlipDialog, setAddIncomingRoutingSlipDialog] = useState<boolean>(false)
    const [addOutgoingFormDialog, setAddOutgoingFormDialog] = useState<boolean>(false)
    const [incOrOutDialog, setIncOrOutDialog] = useState<boolean>(false)

    return (    
        <>
            <Card className='flex flex-row gap-2 w-full shadow-none'>
                <CardContent className='flex items-center justify-center md:justify-between gap-2 w-full p-4 flex-wrap'>
                    <div className='flex items-center sm:justify-start justify-center flex-row gap-2 w-fulls flex-wrap'>
                        <Button
                            variant="default"
                            className='flex flex-row items-center gap-1 justify-center text-xs lg:text-sm'
                            onClick={() => setIncOrOutDialog(true)}>
                            <FaPlusCircle size={20} />New</Button>
                        <Link href="/document-tracking/correspondence" className={cn(buttonVariants({ variant: 'secondary' }), "rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm")}>
                            <Table2Icon size={15} />  Table
                        </Link>
                        <Link href="/document-tracking/correspondence/downloads" className={cn(buttonVariants({ variant: 'secondary' }), "rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm")}>
                            <Download size={15} />  Downloadables
                        </Link>
                    </div>
                    <Separator />
                    {children}
                </CardContent>
            </Card>
            <IncomingRoutingSlipDialog open={addIncomingRoutingSlipDialog} setClose={() => setAddIncomingRoutingSlipDialog(!addIncomingRoutingSlipDialog)} />
            <OutgoingFormDialog open={addOutgoingFormDialog} setClose={() => setAddOutgoingFormDialog(!addOutgoingFormDialog)} />
            <IncOrOutDialog
                open={incOrOutDialog}
                setClose={() => setIncOrOutDialog(!incOrOutDialog)}
                setIncomingRoutingSlipDialog={() => setAddIncomingRoutingSlipDialog(!addIncomingRoutingSlipDialog)}
                setOutgoingRoutingSlipDialog={() => setAddOutgoingFormDialog(!addOutgoingFormDialog)} />
        </>
    )
}
