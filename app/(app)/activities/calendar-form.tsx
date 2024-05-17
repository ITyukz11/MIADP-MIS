'use client'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DatePicker } from 'antd';
import { TimePicker } from 'antd';
import dayjs from 'dayjs'
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS for styling
import { CalendarOfActivitySchema } from '@/schemas/calendar-of-activity'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { Separator } from '@/components/ui/separator'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'

import { status } from '@/components/calendar-of-activity/data'
import { ToastAction } from '@/components/ui/toast'
import { calendarOfActivity } from '@/actions/calendar-of-activity/calendarofactivity'
import { toast } from '@/components/ui/use-toast'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ColorPicker } from '@/components/ui/color-picker'
import { useCurrentUser } from '@/components/CurrentUserContext'

type Props = {
    setDialogClose: () => void
    refreshCalendar: () => void
}

const CalendarForm = ({ setDialogClose, refreshCalendar }: Props) => {
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false); // Initialize loading state

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [numOfPreparatoryList, setNumOfPreparatoryList] = useState(1)

    const [allDayChecked, setAllDayChecked] = useState(false)


    const { RangePicker } = DatePicker;

    const { currentUser } = useCurrentUser();

    const form = useForm<z.infer<typeof CalendarOfActivitySchema>>({
        resolver: zodResolver(CalendarOfActivitySchema),
        defaultValues: {
            authorizeOther: false,
            activityTitle: '',
            activityDescription: '',
            targetParticipant: '',
            location: '', // optional field, can be omitted if you don't want a default value
            type: '',
            dateFrom: dayjs().toString(),
            dateTo: dayjs().toString(),
            timeStart: '',
            timeEnd: '',
            allDay: false,
            color: '#F5222D',
            status: 'New', // default value specified in the schema
            preparatoryList: [{ description: '', status: '', remarks: '' }],
            remarks: '',
            name: currentUser?.name
        },
    })

    const onSubmit = async (values: z.infer<typeof CalendarOfActivitySchema>) => {
        console.log("submit values: ", values)

        if (!navigator.onLine) {
            // Alert the user that there is no internet connection
            alert("No internet connection. Please check your network connection and try again.");
            return;
        }

        setError("")
        setSuccess("")
        startTransition(() => {
            setLoading(true)
            calendarOfActivity(values)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                    setTimeout(() => {
                        if (!data.error) {
                            toast({
                                title: "Success",
                                description: "Your calendar of activity has been encoded to the server",
                                duration: 10000,
                                action: (
                                    <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
                                ),
                            })
                            refreshCalendar();
                            setDialogClose();
                        }
                        setLoading(false)
                    }, 2000); // Delay for 2 seconds                      
                });
        })

    }

    const handleRangePickerChange = (value: any) => {
        if (value && Array.isArray(value) && value.length === 2) {
            const [startDate, endDate] = value;
            const formattedStartDate = startDate.format('YYYY/MM/DD'); // Convert Dayjs object to string
            const formattedEndDate = endDate.format('YYYY/MM/DD'); // Convert Dayjs object to string

            form.setValue('dateFrom', formattedStartDate);
            form.setValue('dateTo', formattedEndDate);

            console.log("startDate: ", formattedStartDate);
            console.log("dateTo: ", formattedEndDate);
        } else {
            // Clear the value if no range is selected
            form.setValue('dateFrom', '');
            form.setValue('dateTo', '');
        }
    };

    const handleDatePickerChange = (value: any) => {
        if (value) {
            const date = value;
            const formattedStartDate = date.format('YYYY/MM/DD'); // Convert Dayjs object to string

            form.setValue('dateFrom', formattedStartDate);
            form.setValue('dateTo', formattedStartDate);
            console.log(formattedStartDate);
        } else {
            // Clear the value if no range is selected
            form.setValue('dateFrom', '');
            form.setValue('dateTo', '');
        }
    };

    const handleTimeRangeChange = (value: any) => {
        if (value && Array.isArray(value) && value.length === 2) {
            const [startTime, endTime] = value;
            const formattedStartTime = startTime.format('HH:mm'); // Extract only the time part
            const formattedEndTime = endTime.format('HH:mm'); // Extract only the time part
            
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

    const handleColorPickerChange = (value: any) => {
        form.setValue('color', value);
        console.log('color: ', value);
    };

    //const [background, setBackground] = useState('#B4D455')
    return (
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
                                        <Input {...field} disabled={loading} placeholder="Type your activity title here." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="authorizeOther"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>
                                        Authorized?
                                    </FormLabel>
                                    <div className='flex space-x-3 space-y-0'>

                                        <FormControl>
                                            <Checkbox
                                                onCheckedChange={field.onChange}
                                                disabled={loading}
                                            />

                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Yes
                                            </FormLabel>
                                            <FormDescription>
                                                Please check if you&apos;re creating this activity for other user.
                                            </FormDescription>
                                        </div>
                                    </div>

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
                                    <Textarea {...field} disabled={loading} placeholder="Type your description here." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-3 gap-2'>
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} autoComplete="false" />
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
                                        <Input {...field} disabled={loading} />
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
                                        <Input {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className='flex flex-row gap-2 item-start'>
                        <div className='flex flex-row items-center justify-start gap-1 mt-5'>
                            <Checkbox checked={allDayChecked} onClick={() => setAllDayChecked(!allDayChecked)} disabled={loading} />
                            <label
                                htmlFor="allday"
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap">
                                All day
                            </label>
                        </div>
                        {allDayChecked ?
                            <FormField
                                control={form.control}
                                name="dateTo"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col mt-auto w-full'>
                                        <FormLabel>Planned Date Range</FormLabel>
                                        <RangePicker
                                            defaultValue={[dayjs(), null]}
                                            onChange={(value) => handleRangePickerChange(value)}
                                            disabled={loading}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            :
                            <div className='flex flex-row gap-2 mt-auto '>
                                <FormField
                                    control={form.control}
                                    name="dateFrom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Planned Date</FormLabel>
                                            <DatePicker
                                                className='w-full'
                                                defaultValue={[dayjs()]}
                                                onChange={(value) => handleDatePickerChange(value)}
                                                disabled={loading} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="timeStart"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time Range</FormLabel>
                                            <TimePicker.RangePicker
                                                className='w-full'
                                                onChange={(value) => handleTimeRangeChange(value)}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        }
                        <FormField
                            name='color'
                            render={({ field }) => {
                                console.log(field); // Log the field object
                                return (
                                    <FormItem>
                                        <FormLabel>Activity Color</FormLabel>
                                        <FormControl className='flex items-center mt-auto'>
                                            <ColorPicker
                                                background={field.value}
                                                setBackground={(value) => handleColorPickerChange(value)} />
                                        </FormControl>
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                    {/* Preparatory list items */}
                    <Separator />
                    <FormLabel className='flex flex-row gap-2 items-centers'>
                        <label className='font-bold md:text-xl '>Preparatory List</label>
                        <Button type='button' size={'sm'} disabled={loading} onClick={() => setNumOfPreparatoryList(prev => prev + 1)}>
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
                                            <Input {...field} disabled={loading} placeholder="Enter description" />
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
                                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {status.map((option, index) => (
                                                        <SelectItem key={index} value={option} disabled={loading}>{option}</SelectItem>
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
                                name={`preparatoryList.${index}.remarks`}
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Remarks</FormLabel>
                                        <FormControl>
                                            <Input {...field} className='w-full' disabled={loading} placeholder="Enter remarks" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className='w-fit' type='button' variant={'destructive'} size={'sm'}
                                onClick={() => setNumOfPreparatoryList(prev => prev - 1)}
                                disabled={loading}>
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
                                    <Textarea {...field} disabled={loading} placeholder="Type your remarks here." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                </div>
                <FormSuccess message={success} />
                <FormError message={error} />
                <Button typeof="submit" className="w-full" disabled={loading}>
                    {loading && <LoadingSpinner />} Submit
                </Button>
            </form>
        </Form>
    )
}

export default CalendarForm
