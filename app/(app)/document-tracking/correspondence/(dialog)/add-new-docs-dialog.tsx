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
import { Upload } from "lucide-react";
import { useCurrentUser } from "@/components/context/CurrentUserContext";
import { useEffect, useRef, useState } from "react";
import { DoctrackDocumentSchema } from "@/schemas/document-tracking/correspondence";
import { Badge } from "@/components/ui/badge";
import { newdocument } from "@/actions/document-tracking/newdocument";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { FormError } from "@/components/form-error";
import FormFieldWrapper from "@/components/FormFieldWrapper";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useDispatch } from "@/app/store/store";
import { fetchDoctrackDocumentsData } from "@/app/store/document-tracking/correspondence/documentAction";

interface AddNewDocsFormProps {
    open: boolean;
    setClose: () => void;
}

export function AddNewDocsDialog({ open, setClose }: AddNewDocsFormProps) {
    const [fileSelected, setFileSelected] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useCurrentUser();

    const dispatch = useDispatch();


    const form = useForm<z.infer<typeof DoctrackDocumentSchema>>({
        resolver: zodResolver(DoctrackDocumentSchema),
        defaultValues: {
            no: '',
            date: '',
            encoder: '',
            from: '',
            documentType: '',
            routeType: '',
            subject: '',
            description: '',
            attachment: '',
            link: '',
            remarks: ''
        },
    });

    const onSubmit = async (values: z.infer<typeof DoctrackDocumentSchema>) => {
        values.id = currentUser?.id
        values.encoder = currentUser?.name
        values.date = new Date().toLocaleDateString()
        values.status = 'Encoded'
        console.log("submit new doc :", values);
        try {
            setLoading(true)
            newdocument(values)
                .then((data) => {
                    setError(data.error || null)
                    if (!data.error) {
                        console.log("success! data: ", data)
                        toast({
                            title: "New Document",
                            description: "Successfully added new document",
                            duration: 3000,
                            action: (
                                <ToastAction altText="Ok">Ok</ToastAction>
                            ),
                        });
                        dispatch(fetchDoctrackDocumentsData());
                        setLoading(false)
                        setClose()
                    }
                })
        } catch (err: any) {
            console.error("Error verifying password:", err);
            setError(err.message || "An error occurred while verifying the password. Please try again.");
        }
    };

    useEffect(() => {
        if (error) {
            setLoading(false)
        }
    }, [error])

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

    
    const routeTypes = [
        "Incoming", 
        "Outgoing",
    ]

    const documentTypes = [
        "Memorandum", 
        "Office Order",
        "Travel Order",
        "Letter",
        "Notice of Meeting",
        "Special Order",
    ]
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
                        <FormFieldWrapper
                            control={form.control}
                            name="subject"
                            label="Subject"
                            isFocus
                            isDisabled={loading}
                            placeholder="Type the subject here."
                            tabIndex={1}
                        />
                        <div className="flex flex-row gap-2 w-full">
                            <FormFieldWrapper
                                control={form.control}
                                name="from"
                                label="From"
                                isDisabled={loading}
                                placeholder="From where it come from?"
                                tabIndex={2}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="documentType"
                                label="Document Type"
                                isDisabled={loading}
                                placeholder="Select"
                                type="select"
                                selectOptions={documentTypes.map((documentType) => ({
                                    value: documentType,
                                    label: documentType
                                }))}
                                tabIndex={3}
                            />
                             <FormFieldWrapper
                                control={form.control}
                                name="routeType"
                                label="Route Type"
                                isDisabled={loading}
                                placeholder="Select"
                                type="select"
                                selectOptions={routeTypes.map((routeType) => ({
                                    value: routeType,
                                    label: routeType
                                }))}
                                tabIndex={4}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            isTextarea
                            isDisabled={loading}
                            placeholder="Type the description here."
                            tabIndex={5}
                        />

                        <div className="flex flex-row gap-2 w-full">
                            <FormFieldWrapper
                                control={form.control}
                                name="link"
                                label="Link"
                                isOptional
                                isDisabled={loading}
                                placeholder="Paste the link for attachment here."
                                tabIndex={6}
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
                                                    tabIndex={7}
                                                    type="file"
                                                    disabled={loading}
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
                        <FormFieldWrapper
                            control={form.control}
                            name="remarks"
                            label="Remarks"
                            isOptional
                            tabIndex={8}
                            isTextarea
                            isDisabled={loading}
                            placeholder="Type your remarks here"
                        />
                        <FormError message={error || ''} />
                        <DialogFooter className="flex justify-between">
                            <Button typeof="submit" tabIndex={9} disabled={loading}>{loading ? <LoadingSpinner /> : 'Submit'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
