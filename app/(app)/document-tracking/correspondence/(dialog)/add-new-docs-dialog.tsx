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
import { Send, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/components/context/CurrentUserContext";
import { useEffect, useRef, useState } from "react";
import { DoctrackDocumentSchema } from "@/schemas/document-tracking/correspondence";
import { Badge } from "@/components/ui/badge";

interface AddNewDocsFormProps {
    open: boolean;
    setClose: () => void;
}

export function AddNewDocsDialog({ open, setClose }: AddNewDocsFormProps) {
    const [fileSelected, setFileSelected] = useState<string>();

    const { currentUser } = useCurrentUser();
    const form = useForm<z.infer<typeof DoctrackDocumentSchema>>({
        resolver: zodResolver(DoctrackDocumentSchema),
        defaultValues: {
            no:'',
            date:'',
            encoder:'',
            subject:'',
            description:'',
            attachment:'',
            link:'',
            remarks:''
        },
    });

    const onSubmit = async (values: z.infer<typeof DoctrackDocumentSchema>) => {
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
       
            });
            setFileSelected(undefined);
        }
    }, [open, form]);
    

    console.log("error: ", form.formState.errors)
    return (
        <Dialog open={open} onOpenChange={setClose}>
            <DialogContent className="max-w-[750px] w-full overflow-y-auto scrollbar-thin max-h-[95vh] rounded-lg">
                <DialogHeader>
                    <DialogTitle>New Document Form</DialogTitle>
                    <DialogDescription>
                        Please encode the document here and ensure to submit it once completed.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full" autoComplete="off">
                        <div className="grid grid-cols-3 gap-2">
                            <Label>No: <Badge variant={'secondary'}>01</Badge></Label>
                            <Label>Date: <Badge variant={'secondary'}>{getTodayDate()}</Badge></Label>
                            <Label>Encoder: <Badge variant={'secondary'}>{currentUser?.name}</Badge></Label>
                        </div>
                        <Separator />
                        <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem className='w-full col-span-2'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Subject<FormMessage /></FormLabel>
                                        <FormControl>
                                            <Input {...field} className='text-xs sm:text-sm' autoFocus placeholder="Type the subject here." />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className='w-full col-span-2'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Description<FormMessage /></FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className='text-xs sm:text-sm' placeholder="Type the description here." />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        <div className="flex flex-row gap-2">
                        <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem className='w-full col-span-2'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm items-center'>Link
                                        <Label className=" font-light">(optional)</Label><FormMessage /></FormLabel>
                                        <FormControl>
                                            <Input {...field} className='text-xs sm:text-sm' placeholder="Paste the link here." />
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
                                                <Button variant="outline" disabled onClick={handleButtonClick} className="w-full" type="button">
                                                    <Upload size={15} /> Upload
                                                </Button>
                                                {fileSelected && <Label className=" text-green-700">{fileSelected}</Label>}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                          
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
                        <DialogFooter className="flex justify-between">
                            <Button type="submit">Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
