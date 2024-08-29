'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
import FormFieldWrapper from "@/components/FormFieldWrapper";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { newIncomingRoute } from "@/actions/document-tracking/incomingroute";
import { FormError } from "@/components/form-error";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

interface IncomingRoutingSlipProps {
    open: boolean;
    setClose: () => void;
    selectedRow: any
}

export function IncomingRoutingSlipDialog({ open, setClose, selectedRow }: IncomingRoutingSlipProps) {
    const [fileSelected, setFileSelected] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('');

    const { currentUser } = useCurrentUser();
    const form = useForm<z.infer<typeof CorrespondenceIncomingSchema>>({
        resolver: zodResolver(CorrespondenceIncomingSchema),
        defaultValues: {
            date: '',
            no: '',
            purpose: '',
            remarks: '',
            subject: '',
            to: '',
        },
    });
    console.log("selectedRow incoming route: ", selectedRow)
    const onSubmit = async (values: z.infer<typeof CorrespondenceIncomingSchema>) => {
        const submissionData = {
            no: values.no || '',
            date: getTodayDate(),
            documentId: selectedRow.id,
            senderId: currentUser?.id,
            from: selectedRow.from,
            to: values.to, // The receiver's value
            purpose: values.purpose,
            subject: values.subject,
            remarks: values.remarks,
        };

        setLoading(true)

        try {
            newIncomingRoute(submissionData).then((data) => {
                console.log(data)
                toast({
                    title: "Successfully routed incoming document",
                    description: "Successfully routed to "+values.to,
                    duration: 3000,
                    action: (
                        <ToastAction altText="Ok">Ok</ToastAction>
                    ),
                });
                setLoading(false)
                setClose()
            })
        } catch (error) {
            console.log(error)
        }
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
                date: '',
                no: '',
                purpose: '',
                remarks: '',
                subject: '',
                to: '',
            });
            setFileSelected(undefined);
        }
    }, [open, form]);

    const RenderDocumentInfo = (label: string, value: string) => {
        return <>
            <Separator />

            <div className="flex flex-wrap sm:grid grid-cols-8 gap-1">

                <Label className="flex flex-row gap-1">{label}</Label>
                <Badge className="col-span-7" variant={'secondary'}>{value}</Badge>
            </div>
        </>
    }

    console.log(form.formState.errors)
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
                        <div className="grid grid-col gap-2 dark:bg-slate-600 bg-slate-300 rounded-md p-3">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="p-0 font-semi-bold text-base mb-2">
                                        <div>Subject: <Badge variant={'secondary'}>{selectedRow.subject}</Badge> </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="grid grid-col gap-2 pt-2">
                                        {RenderDocumentInfo("Description:", selectedRow.description)}
                                        {RenderDocumentInfo("From:", selectedRow.from)}
                                        {RenderDocumentInfo("Encoder:", selectedRow.encoder)}
                                        {RenderDocumentInfo("Link:", selectedRow.link)}
                                        {RenderDocumentInfo("Date:", selectedRow.date)}
                                        {RenderDocumentInfo("Remarks:", selectedRow.remarks)}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <div className="flex flex-wrap sm:grid grid-cols-3 gap-2 ">
                                <Label>No: <Badge variant={'secondary'}>DTS-01</Badge></Label>
                                <Label>Date: <Badge variant={'secondary'}>{getTodayDate()}</Badge></Label>
                                <Label>Sender: <Badge variant={'secondary'}>{currentUser?.name}</Badge></Label>
                            </div>
                            <Separator />
                        </div>


                        <div className="grid grid-cols-2 gap-2">
                            <FormFieldWrapper
                                control={form.control}
                                className=""
                                name="to"
                                label="To"
                                isDisabled={loading}
                                placeholder="Select"
                                type="select"
                                tabIndex={0}
                                selectOptions={[
                                    { value: 'All', label: 'All', selectItemDisable: true },
                                    { value: 'Individual', label: 'Individual', selectItemDisable: true },
                                    ...componentOptions.map((component) => ({
                                        value: component,
                                        label: component,
                                        selectItemDisable: component == "Component 4"
                                    })),
                                    ...unitOptions.map((unit) => ({
                                        value: unit.value,
                                        label: unit.label
                                    })),

                                ]}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="purpose"
                                label="Purpose"
                                placeholder="Select"
                                type="select"
                                tabIndex={0}
                                isDisabled={loading}
                                selectOptions={correspondencePurposeOptions.map((purpose) => ({
                                    value: purpose,
                                    label: purpose
                                }))}
                            />
                        </div>
                        <div className="flex flex-row gap-2">

                            {/* <FormField
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
                            /> */}
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            name="subject"
                            label="Subject"
                            placeholder="Type your subject here."
                            isTextarea
                            tabIndex={0}
                            isDisabled={loading}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="remarks"
                            label="Remarks"
                            tabIndex={0}
                            placeholder="Type your remarks here if any..."
                            isDisabled={loading}
                            isOptional
                        />
                        <FormError message={error}/>
                        <DialogFooter className="flex justify-between">
                            <Button type="submit" disabled={loading}>{loading ?<LoadingSpinner/>:<>Send <Send size={17} /></>}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
