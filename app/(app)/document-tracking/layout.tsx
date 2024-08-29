'use client'
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Home, Notebook, Package, RouterIcon, SearchIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FcDocument } from "react-icons/fc";
import { HiDocumentCheck } from "react-icons/hi2";
import { IoDocumentAttach } from "react-icons/io5";
import { FaMoneyBills, FaThreads } from "react-icons/fa6";
import { usePathname } from "next/navigation";

interface DoctrackLayoutProps {
    children: React.ReactNode
}

export default function DocumentTrackingLayout({ children }: DoctrackLayoutProps) {

    const pathname = usePathname()

    return (
        <div className="xs:container space-y-4">
            <div className='flex flex-row flex-wrap justify-center gap-2 md:justify-between'>
                <div className='flex flex-col'>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">Document Tracking</h2>
                    <Label className='text-xs sm:text-sm text-muted-foreground'>
                        This Document Tracking page is still under development. It will be available for use soon. Please be patient as PSO currently has only one programmer.
                    </Label>
                </div>
                <Card className='flex flex-row gap-2 w-full shadow-none'>
                    <CardContent className='flex items-center justify-center md:justify-between gap-2 w-full p-4 flex-wrap'>
                        <div className='flex flex-wrap justify-center md:justify-start sm:flex-row gap-2 '>
                         <Link href="/document-tracking" 
                             className={cn(buttonVariants(),
                             "hover:font-bold rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm", {
                                 'font-bold': pathname == '/document-tracking'
                             })}>
                                <Home size={20} />  Home
                            </Link>
                            <Link href="/document-tracking/correspondence" 
                           className={cn(buttonVariants({ variant: 'secondary' }),
                           "hover:bg-blue-100 dark:hover:bg-blue-700 rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm", {
                               'font-bold hover:bg-blue-100 dark:hover:bg-blue-700 bg-blue-100 dark:bg-blue-700': pathname?.includes('/document-tracking/correspondence'),
                               
                           })}>
                                <Notebook size={20} />  Correspondence
                            </Link>
                            <Link href="/document-tracking/procurement" 
                             className={cn(buttonVariants({ variant: 'secondary' }),
                             "hover:bg-blue-100 dark:hover:bg-blue-700 rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm", {
                                 'font-bold hover:bg-blue-100 dark:hover:bg-blue-700 bg-blue-100 dark:bg-blue-700': pathname?.includes('/document-tracking/procurement') ,
                             })}>
                                <Package size={20} />  Procurement
                            </Link>
                            <Link href="/document-tracking/disbursement" 
                           className={cn(buttonVariants({ variant: 'secondary' }),
                           "hover:bg-blue-100 dark:hover:bg-blue-700 rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm", {
                               'font-bold hover:bg-blue-100 dark:hover:bg-blue-700 bg-blue-100 dark:bg-blue-700': pathname?.includes('/document-tracking/disbursement')
                           })}>
                                <FaMoneyBills size={20} />  Disbursement
                            </Link>
                        </div>
                        {/* <div>
                            <Link href="/document-tracking/correspondence" className={cn(buttonVariants({ variant: 'secondary' }), "rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm")}>
                                <FaThreads size={20} /> Thread
                            </Link>
                        </div> */}
                    </CardContent>
                </Card>
            </div>
            <div className="w-full flex flex-col gap-2">
                {children}

            </div>
        </div>
    );
}


