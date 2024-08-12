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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Send, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/components/context/CurrentUserContext";
import { useEffect, useRef, useState } from "react";
import { CorrespondenceOutgoingSchema } from "@/schemas/document-tracking/correspondence";

interface OutgoingFormProps {
    open: boolean;
    setClose: () => void;
}

export function OutgoingFormDialog({ open, setClose }: OutgoingFormProps) {
    const [fileSelected, setFileSelected] = useState<string>();

    const { currentUser } = useCurrentUser();
    const form = useForm<z.infer<typeof CorrespondenceOutgoingSchema>>({
        resolver: zodResolver(CorrespondenceOutgoingSchema),
        defaultValues: {
        
        },
    });

    const onSubmit = async (values: z.infer<typeof CorrespondenceOutgoingSchema>) => {
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
    

    return (
        <Dialog open={open} onOpenChange={setClose}>
            <DialogContent className="max-w-[750px] w-full overflow-y-auto scrollbar-thin max-h-[95vh] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Outgoing Form</DialogTitle>
                    <DialogDescription>
                        Please encode your outgoing form here and ensure to send it once completed.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full" autoComplete="off">
                        <div className="grid grid-cols-3 gap-2">
                            <Label>No: <Badge variant={'secondary'}>DTS-O-01</Badge></Label>
                            <Label>Date: <Badge variant={'secondary'}>{getTodayDate()}</Badge></Label>
                            <Label>Encoder: <Badge variant={'secondary'}>{currentUser?.name}</Badge></Label>
                        </div>
                        <Separator />
                        <FormField
                                control={form.control}
                                name="particular"
                                render={({ field }) => (
                                    <FormItem className='w-full col-span-2'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Particulars<FormMessage /></FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className='text-xs sm:text-sm' placeholder="Type your particulars here." />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        <div className="flex flex-row gap-2">
                         
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
                                                <Button variant="outline" onClick={handleButtonClick} className="w-full" type="button">
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
                            <Button type="submit">Send <Send size={17} /></Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
