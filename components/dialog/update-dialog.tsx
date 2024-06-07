'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarOfActivitySchema } from '@/schemas/calendar-of-activity';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { DatePicker, TimePicker } from 'antd';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { updateCalendarOfActivity } from '@/actions/calendar-of-activity/update';
import { useCalendarOfActivityContext } from '../CalendarOfActivityContext';
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS for styling
import { FaMinus, FaPlus } from 'react-icons/fa'
import { Separator } from '@/components/ui/separator'
import { ActivityStatus, PreparatoryActivityStatus, TypeData } from '@/components/calendar-of-activity/data'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { statusOptions } from '@/lib/data/filter';
import { getStatusColor } from '../table/data/activities/coa-columns';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { ChevronLeftCircleIcon, ChevronLeftSquare, ChevronRightCircleIcon } from 'lucide-react';
import { ToastAction } from '../ui/toast';
import { toast } from '../ui/use-toast';
import moment from 'moment';


interface UpdateActivityDialogProps {
    activityId: string[];
    onCancel: () => void;
    openUpdateDialog: boolean;
    setUpdateDialogClose: (open: boolean) => void;
    loadingUpdate: boolean;
}

const UpdateActivityDialog: React.FC<UpdateActivityDialogProps> = ({
    activityId,
    onCancel,
    openUpdateDialog,
    setUpdateDialogClose,
    loadingUpdate,
}) => {
    const [loadingForm, setLoadingForm] = useState(false);
    const [numOfPreparatoryList, setNumOfPreparatoryList] = useState(1);
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const { activities, loading, fetchActivitiesData } = useCalendarOfActivityContext();
    const [allDayChecked, setAllDayChecked] = useState(false);
    const { RangePicker } = DatePicker;

    const form = useForm<z.infer<typeof CalendarOfActivitySchema>>({
        resolver: zodResolver(CalendarOfActivitySchema),
        defaultValues: {
            activityTitle: '',
            activityDescription: '',
            targetParticipant: '',
            location: '',
            type: '',
            dateFrom: '',
            dateTo: '',
            timeStart: '',
            timeEnd: '',
            allDay: false,
            color: '',
            status: '',
            preparatoryList: [{ description: '', status: '', remarks: '' }],
            remarks: '',
            name: '',
        },
    });



    useEffect(() => {
        if (activityId.length > 0 && currentIndex < activityId.length) {
            setLoadingForm(true);
            const activityData = activities.find(activity => activity.id === activityId[currentIndex]);
            if (activityData) {
                form.reset({
                    activityTitle: activityData.activityTitle,
                    activityDescription: activityData.activityDescription,
                    targetParticipant: activityData.targetParticipant,
                    location: activityData.location,
                    type: activityData.type,
                    dateFrom: activityData.dateFrom,
                    dateTo: activityData.dateTo,
                    timeStart: activityData.timeStart,
                    timeEnd: activityData.timeEnd,
                    allDay: activityData.allDay,
                    color: activityData.color || '',
                    status: activityData.status,
                    preparatoryList: activityData.preparatoryList.length > 0 ? activityData.preparatoryList : [{ description: '', status: '', remarks: '' }],
                    remarks: activityData.remarks,
                });
                setAllDayChecked(activityData.allDay);
                setNumOfPreparatoryList(activityData.preparatoryList.length || 1);
            }
            setLoadingForm(false);
        }
    }, [activityId, currentIndex, activities, form]);

    const onSubmit = async (values: any) => {
        setError('');
        setSuccess('');
        setLoadingForm(true);

        // Transform preparatoryList to match Prisma's expected structure
        const formattedPreparatoryList = values.preparatoryList.map((item: { id: any; description: any; status: any; remarks: any; }) => ({
            id: item.id,
            description: item.description,
            status: item.status,
            remarks: item.remarks,
        }));

        const formattedValues = {
            ...values,
            preparatoryList: {
                update: formattedPreparatoryList.map((item: { id: any; description: any; status: any; remarks: any; }) => ({
                    where: { id: item.id },
                    data: {
                        description: item.description,
                        status: item.status,
                        remarks: item.remarks,
                    },
                })),
                // Add handling for new items here if needed
            },
        };

        console.log("submitting values: ", formattedValues);

        try {
            const result = await updateCalendarOfActivity(activityId[currentIndex], formattedValues);
            toast({
                title: "Success",
                description: "Your calendar of activity has been updated successfully.",
                duration: 5000,
                action: (
                    <ToastAction altText="Ok">Ok</ToastAction>
                ),
            });

            console.log("submitting result: ", result);

            if (currentIndex < activityId.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setUpdateDialogClose(false);
            }

            fetchActivitiesData();
        } catch (err) {
            setError('Failed to update activity. Please try again.');
        } finally {
            setLoadingForm(false);
        }
    };



    const handleRangePickerChange = (value: any) => {
        if (value && Array.isArray(value) && value.length === 2) {
            const [startDate, endDate] = value.map((date: any) => dayjs(date).toISOString());

            form.setValue('dateFrom', startDate);
            form.setValue('dateTo', endDate);

            console.log("startDate: ", startDate);
            console.log("endDate: ", endDate);
        } else {
            // Clear the value if no range is selected
            form.setValue('dateFrom', '');
            form.setValue('dateTo', '');
        }
    };

    const handleDatePickerChange = (value: any) => {

        if (value) {
            const date = dayjs(value); // Convert the input value to a Day.js object
            const formattedDate = date.toISOString(); // Format the date as per ISO 8601

            form.setValue('dateFrom', formattedDate);
            form.setValue('dateTo', formattedDate);
            console.log(formattedDate);
        } else {
            // Clear the value if no range is selected
            form.setValue('dateFrom', '');
            form.setValue('dateTo', '');
        }
    };

    const handleTimeRangeChange = (value: any) => {
        console.log("value: ", value)

        if (value && Array.isArray(value) && value.length === 2) {
            const [timeStart, timeEnd] = value;
            const formattedStartTime = timeStart.format('HH:mm'); // Extract only the time part
            const formattedEndTime = timeEnd.format('HH:mm'); // Extract only the time part

            form.setValue('timeStart', formattedStartTime);
            form.setValue('timeEnd', formattedEndTime);

            console.log('timeStart', formattedStartTime);
            console.log('timeEnd', formattedEndTime);
        } else {
            // Clear the value if no range is selected
            form.setValue('timeStart', '');
            form.setValue('timeEnd', '');
        }
    };

    const avoidDefaultDomBehavior = (e: Event) => {
        e.preventDefault();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            event.stopPropagation();
        }
    };


    return (
        <Dialog open={openUpdateDialog} onOpenChange={setUpdateDialogClose}>
            <DialogContent className='w-full md:min-w-[60%] overflow-y-auto scrollbar-thin max-h-[95vh]'
                onPointerDownOutside={avoidDefaultDomBehavior}
                onInteractOutside={avoidDefaultDomBehavior}
                onKeyDown={handleKeyDown}>

                <DialogTitle className='flex justify-between -mb-2'>
                    Update Activity
                    {activityId.length > 1 && (
                        <div className='flex flex-row gap-2 items-center mr-10'>
                            <ChevronLeftCircleIcon
                                onClick={currentIndex === 0 ? undefined : () => setCurrentIndex(currentIndex - 1)}
                                className={`w-10 h-10 ${currentIndex === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            />
                            <Label>{currentIndex + 1} of {activityId.length}</Label>
                            <ChevronRightCircleIcon
                                onClick={currentIndex === activityId.length - 1 ? undefined : () => setCurrentIndex(currentIndex + 1)}
                                className={`w-10 h-10 ${currentIndex === activityId.length - 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            />
                            {/* <Button
                                onClick={() => setCurrentIndex(currentIndex + 1)}
                                disabled={currentIndex === activityId.length - 1}
                            >     Next</Button> */}
                        </div>
                    )}

                </DialogTitle>
                {activityId.length ? (
                    <>
                        <DialogDescription>
                            Don&apos;t forget to press update when finished.
                        </DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                                <div className="space-y-4">
                                    <div className='flex flex-row gap-2 w-full'>
                                        <FormField
                                            control={form.control}
                                            name="activityTitle"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>Activity Title</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} disabled={loadingForm} placeholder="Type your activity title here." />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="activityDescription"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormLabel>Activity Description</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} disabled={loadingForm} placeholder="Type your description here." />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='grid grid-cols-3 gap-2'>
                                        <FormField
                                            control={form.control}
                                            name='type'
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>Type</FormLabel>
                                                    <FormControl>
                                                        <Select {...field} onValueChange={field.onChange} defaultValue={field.value} disabled={loadingForm}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {TypeData.map((option, index) => (
                                                                    <SelectItem key={index} value={option.value || 'default_value'} disabled={loadingForm}>{option.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="targetParticipant"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Target Participants</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={loadingForm} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={loadingForm} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                    <div className='grid grid-cols-3 gap-2'>
                                        <div className='flex flex-row items-center justify-start gap-2 mt-5'>
                                            <div className='flex flex-row gap-1 items-center justify-center'>
                                                <Checkbox checked={allDayChecked} onClick={() => setAllDayChecked(!allDayChecked)} disabled={loadingForm} />
                                                <Label
                                                    htmlFor="allday"
                                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap">
                                                    All day
                                                </Label>
                                            </div>

                                            {!allDayChecked && (
                                                <FormField
                                                    control={form.control}
                                                    name="dateFrom"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Planned Date</FormLabel>
                                                            <DatePicker
                                                                className='w-full'
                                                                defaultValue={[dayjs(form.getValues('dateFrom'))]}
                                                                onChange={(value) => handleDatePickerChange(value)}
                                                                disabled={loadingForm} />
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}

                                        </div>

                                        {allDayChecked ?
                                            <FormField
                                                control={form.control}
                                                name="dateTo"
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col mt-auto w-full'>
                                                        <FormLabel>Planned Date Range</FormLabel>
                                                        <RangePicker
                                                            defaultValue={[dayjs(form.getValues('dateFrom')), dayjs(form.getValues('dateTo'))]}
                                                            onChange={(value) => handleRangePickerChange(value)}
                                                            disabled={loadingForm}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            /> :
                                            <div className='flex flex-row gap-2 mt-auto '>
                                                <FormField
                                                    control={form.control}
                                                    name="timeStart"
                                                    render={({ field }) => {
                                                        const defaultTimeStart = form.getValues('timeStart') ? dayjs(form.getValues('timeStart'), 'HH:mm') : undefined;
                                                        const defaultTimeEnd = form.getValues('timeEnd') ? dayjs(form.getValues('timeEnd'), 'HH:mm') : undefined;
                                                        return (
                                                            <FormItem>
                                                                <FormLabel>Time Range</FormLabel>
                                                                <TimePicker.RangePicker
                                                                    className='w-full'
                                                                    defaultValue={[defaultTimeStart, defaultTimeEnd]}
                                                                    onChange={(value) => handleTimeRangeChange(value)}
                                                                    disabled={loadingForm}
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            </div>
                                        }
                                        <FormField
                                            control={form.control}
                                            name='status'
                                            render={({ field }) => (
                                                <FormItem className='w-full mt-auto'>
                                                    <FormLabel>Status</FormLabel>
                                                    <FormControl>
                                                        <Select {...field} onValueChange={field.onChange} defaultValue={field.value} disabled={loadingForm}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {statusOptions.map((option, index) => (
                                                                    <SelectItem key={index} value={option} disabled={loadingForm}
                                                                    ><Badge className={`font-medium cursor-pointer hover:${getStatusColor(option)
                                                                        } ${getStatusColor(option)
                                                                        }`}
                                                                    >{option}</Badge></SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {/* Preparatory list items */}
                                    <Separator />
                                    <FormLabel className='flex flex-row gap-2 items-centers'>
                                        <label className='font-bold md:text-xl '>Preparatory List</label>
                                        <Button type='button' size={'sm'} disabled={loadingForm} onClick={() => setNumOfPreparatoryList(prev => prev + 1)}>
                                            <FaPlus />
                                        </Button>
                                        <FormDescription className='flex items-center'>
                                            Please press the plus (+) button when adding new preparatory list
                                        </FormDescription>
                                    </FormLabel>
                                    {Array.from({ length: numOfPreparatoryList }).map((_, index) => (
                                        <div key={index} className="flex flex-row gap-2 items-end w-full">
                                            <FormField
                                                control={form.control}
                                                name={`preparatoryList.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled={loadingForm} placeholder="Enter description" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`preparatoryList.${index}.status`}
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormLabel>Status</FormLabel>
                                                        <FormControl>
                                                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value} disabled={loadingForm}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {PreparatoryActivityStatus.map((option, index) => (
                                                                        <SelectItem key={index} value={option.value || 'default_value'} disabled={loadingForm}>{option.label}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {form.watch(`preparatoryList.${index}.status`) == "Other" &&
                                                (
                                                    <FormField
                                                        control={form.control}
                                                        name={`preparatoryList.${index}.remarks`}
                                                        render={({ field }) => (
                                                            <FormItem className='w-full'>
                                                                <FormLabel>Remarks</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className='w-full' disabled={loadingForm} placeholder="Enter remarks" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}

                                            <Button className='w-fit' type='button' variant={'destructive'} size={'sm'}
                                                onClick={() => setNumOfPreparatoryList(prev => prev - 1)}
                                                disabled={loadingForm || numOfPreparatoryList == 1}>
                                                <FaMinus />
                                            </Button>

                                        </div>
                                    ))}
                                    <Separator />
                                    <FormField
                                        control={form.control}
                                        name="remarks"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormLabel>Remarks</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} disabled={loadingForm} placeholder="Type your remarks here." />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />



                                </div>


                                {/* <FormSuccess message={success} /> */}
                                <FormError message={error} />


                            </form>
                        </Form>
                        <DialogFooter>
                            <div className='flex flex-row justify-end gap-2'>
                                <Button variant="secondary" onClick={onCancel} disabled={loadingForm}>
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => onSubmit(form.getValues())}
                                    disabled={loadingForm}
                                >
                                    {loadingForm ? <LoadingSpinner /> : 'Update'}
                                </Button>

                            </div>
                        </DialogFooter>
                    </>
                ) : <>
                    <DialogDescription>Please select an activity first</DialogDescription>
                    <div className='flex justify-end'>
                        <Button variant="secondary" onClick={onCancel} disabled={loadingForm}>
                            Okay
                        </Button>
                    </div>
                </>}


            </DialogContent>
        </Dialog>
    );
};

export default UpdateActivityDialog;
