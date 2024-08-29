'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RouteIcon, Download, NotebookText } from 'lucide-react'
import React, { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AddNewDocsDialog } from './(dialog)/add-new-docs-dialog'
import { usePathname } from 'next/navigation'

interface CorrespondenceLayoutProps {
    children: React.ReactNode
}

export default function CorrespondenceLayout({ children }: CorrespondenceLayoutProps) {
    const [newDocsDialog, setNewDocsDialog] = useState<boolean>(false)
    const pathname = usePathname()

    return (
        <>
            <Card className='flex flex-row gap-2 w-full shadow-none'>
                <CardContent className='flex items-center justify-center md:justify-between gap-2 w-full p-4 flex-wrap'>
                    <div className='flex items-center sm:justify-start justify-center flex-row gap-2 w-full flex-wrap'>
                        <Button
                            variant="default"
                            className={cn('flex flex-row items-center gap-1 justify-center text-xs lg:text-sm')}
                            onClick={() => setNewDocsDialog(true)}>
                            <FaPlusCircle size={20} />Add new docs
                        </Button>

                        <Link href="/document-tracking/correspondence"
                            className={cn(buttonVariants({ variant: 'secondary' }),
                                "hover:bg-blue-100 dark:hover:bg-blue-700 rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm", {
                                    'font-bold hover:bg-blue-100 dark:hover:bg-blue-700 bg-blue-100 dark:bg-blue-700': pathname === '/document-tracking/correspondence'
                                })}>
                            <RouteIcon size={15} />  Routes
                            <div className='bg-red-600 rounded-full w-3 h-3'></div>
                        </Link>

                        <Link href="/document-tracking/correspondence/document"
                            className={cn(buttonVariants({ variant: 'secondary' }),
                                "hover:bg-blue-100 dark:hover:bg-blue-700 rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm", {
                                    'font-bold hover:bg-blue-100 dark:hover:bg-blue-700 bg-blue-100 dark:bg-blue-700': pathname === '/document-tracking/correspondence/document'
                                })}>
                            <NotebookText size={15} />  Documents
                        </Link>

                        <Link href="/document-tracking/correspondence/downloads"
                            className={cn(buttonVariants({ variant: 'secondary' }),
                                "hover:bg-blue-100 dark:hover:bg-blue-700 rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm", {
                                    'font-bold hover:bg-blue-100 dark:hover:bg-blue-700 bg-blue-100 dark:bg-blue-700': pathname === '/document-tracking/correspondence/downloads'
                                })}>
                            <Download size={15} />  Downloadables
                        </Link>
                    </div>
                    <Separator />
                    {children}
                </CardContent>
            </Card>

            <AddNewDocsDialog
                open={newDocsDialog}
                setClose={() => setNewDocsDialog(!newDocsDialog)} />
        </>
    )
}
