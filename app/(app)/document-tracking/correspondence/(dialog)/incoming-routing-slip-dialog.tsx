'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { componentOptions, correspondencePurposeOptions, unitOptions } from "@/lib/data/filter";
import { Badge } from "@/components/ui/badge";
import { Send, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/components/context/CurrentUserContext";
import { useEffect, useRef, useState } from "react";
import { CorrespondenceIncomingSchema } from "@/schemas/document-tracking/correspondence";

interface IncomingRoutingSlipProps {
    open: boolean;
    setClose: () => void;
}

export function IncomingRoutingSlipDialog({ open, setClose }: IncomingRoutingSlipProps) {
    const [fileSelected, setFileSelected] = useState<string>();

    const { currentUser } = useCurrentUser();
    const form = useForm<z.infer<typeof CorrespondenceIncomingSchema>>({
        resolver: zodResolver(CorrespondenceIncomingSchema),
        defaultValues: {
            attachment: '',
            date: '',
            encoder: '',
            from: '',
            no: '',
            purpose: '',
            remarks: '',
            subject: '',
            to: ''
        },
    });

    const onSubmit = async (values: z.infer<typeof CorrespondenceIncomingSchema>) => {
        console.log("submit profile dialog:", values);
    };

    function getTodayDate() {
        return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Handle the file upload logic here
            console.log('File selected:', file);
            setFileSelected(file.name)
        }
    };

    useEffect(() => {
        if (open) {
            form.reset({
                attachment: '',
                date: '',
                encoder: '',
                from: '',
                no: '',
                purpose: '',
                remarks: '',
                subject: '',
                to: ''
            });
            setFileSelected(undefined);
        }
    }, [open, form]);
    

    return (
        <Dialog open={open} onOpenChange={setClose}>
            <DialogContent className="max-w-[750px] w-full overflow-y-auto scrollbar-thin max-h-[95vh] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Routing Slip</DialogTitle>
                    <DialogDescription>
                        Please encode your routing slip here and ensure to send it once completed.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full" autoComplete="off">
                        <div className="grid grid-cols-3 gap-2">
                            <Label>No: <Badge variant={'secondary'}>DTS-01</Badge></Label>
                            <Label>Date: <Badge variant={'secondary'}>{getTodayDate()}</Badge></Label>
                            <Label>Encoder: <Badge variant={'secondary'}>{currentUser?.name}</Badge></Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="to"
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>To<FormMessage /></FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value='All'>All</SelectItem>
                                                        <SelectItem value='Individual'>Individual</SelectItem>
                                                        <SelectLabel>Unit</SelectLabel>
                                                        {unitOptions.map((unit, index) => (
                                                            <SelectItem key={index} value={unit.label}>{unit.value}</SelectItem>
                                                        ))}
                                                        <SelectLabel>Component</SelectLabel>
                                                        {componentOptions.map((component, index) => (
                                                            <SelectItem key={index} value={component}>{component}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                           <FormField
                                control={form.control}
                                name="from"
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>From<FormMessage /></FormLabel>
                                        <FormControl>
                                            <Input {...field} className="text-xs sm:text-sm" placeholder="Type where it's from" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-row gap-2">
                            <FormField
                                control={form.control}
                                name="purpose"
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Purpose<FormMessage /></FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Purpose</SelectLabel>
                                                        {correspondencePurposeOptions.map((purpose, index) => (
                                                            <SelectItem key={index} value={purpose}>{purpose}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="attachment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm items-center'>Attachment
                                        <Label className=" font-light">(optional)</Label><FormMessage /></FormLabel>
                                        <FormControl>
                                            <div className="flex flex-row gap-1">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    accept="application/pdf"
                                                    onChange={handleFileChange}
                                                />
                                                <Button variant="outline" onClick={handleButtonClick} className="w-full">
                                                    <Upload size={15} /> Upload
                                                </Button>
                                                {fileSelected && <Label className=" text-green-700">{fileSelected}</Label>}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem className='w-full col-span-2'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Subject<FormMessage /></FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className='text-xs sm:text-sm' placeholder="Type your subject here." />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="remarks"
                                render={({ field }) => (
                                    <FormItem className='w-full col-span-1'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm items-center'>
                                            Remarks
                                            <Label className=" font-light">(optional)</Label>
                                            <FormMessage />
                                            </FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className='text-xs sm:text-sm' placeholder="Type your remarks here if any..." />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="flex justify-between">
                            <Button type="submit">Send <Send size={17} /></Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
