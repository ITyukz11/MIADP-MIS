'use client'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState, useTransition } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { DatePicker } from 'antd';
import { TimePicker } from 'antd';
import dayjs from 'dayjs'
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS for styling
import { CalendarOfActivitySchema } from '@/schemas/calendar-of-activity'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { Separator } from '@/components/ui/separator'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'

import { ActivityStatus, PreparatoryActivityStatus, TypeData } from '@/components/calendar-of-activity/data'
import { ToastAction } from '@/components/ui/toast'
import { calendarOfActivity } from '@/actions/calendar-of-activity/calendarofactivity'
import { toast } from '@/components/ui/use-toast'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ColorPicker } from '@/components/ui/color-picker'
import { useCurrentUser } from '@/components/context/CurrentUserContext'
import axios from 'axios'
import { formatDate } from '@/components/table/data/activities/coa-columns'
import { useCalendarOfActivityContext } from '@/components/context/CalendarOfActivityContext'
import { User, useUsers } from '@/components/context/UsersContext'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { regionOptions } from '@/lib/data/filter'
import { MdPeopleAlt } from 'react-icons/md'

type Props = {
    setDialogClose: () => void
}

const CalendarForm = ({ setDialogClose }: Props) => {
    const { usersData, loadingUser, errorUser, fetchUsers } = useUsers();
    const { currentUser } = useCurrentUser();

    const [filteredUsersData, setFilteredUsersData] = useState<User[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState(['']);

    const [isPending, startTransition] = useTransition();
    const [loadingForm, setLoadingForm] = useState(false); // Initialize loadingForm state

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [numOfPreparatoryList, setNumOfPreparatoryList] = useState(1)

    const [allDayChecked, setAllDayChecked] = useState(false)

    const { RangePicker } = DatePicker;

    const [includeAllRegions, setIncludeAllRegions] = useState(false)

    const { loading, fetchActivitiesData } = useCalendarOfActivityContext();

    const [filterRegion, setFilterRegion] = useState(currentUser?.region);

    console.log("usersData: ", usersData)
    console.log("usersData, currentUser: ", currentUser)

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
            participant: [{ userId: '' }],
            color: '#F5222D',
            status: '', // default value specified in the schema
            preparatoryList: [{ description: '', status: '', remarks: '' }],
            remarks: '',
            name: currentUser?.name
        },
    })

    const { control, watch } = form;

    const {
        fields: participantFields,
        append: appendParticipant,
        remove: removeParticipant
    } = useFieldArray({
        control,
        name: 'participant'
    });

    const {
        fields: preparatoryListFields,
        append: appendPreparatoryList,
        remove: removePreparatoryList
    } = useFieldArray({
        control,
        name: 'preparatoryList'
    });

    const onSubmit = async (values: z.infer<typeof CalendarOfActivitySchema>) => {
        console.log("submit values: ", values)
        const today = new Date();
        const todayFormatted = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let status = 'Upcoming';
        if (values.dateFrom) {
            // Convert dateFrom to local timezone
            const localDateFrom = new Date(values.dateFrom);
            // Adjust localDateFrom to match only the date (without time)
            const localDateFromFormatted = new Date(localDateFrom.getFullYear(), localDateFrom.getMonth(), localDateFrom.getDate());

            // Compare localDateFromFormatted with todayFormatted
            if (localDateFromFormatted.getTime() <= todayFormatted.getTime()) {
                status = 'Ongoing';
            }
        }

        if (!navigator.onLine) {
            // Alert the user that there is no internet connection
            alert("No internet connection. Please check your network connection and try again.");
            return;
        }

        values.status = status

        setError("")
        setSuccess("")
        startTransition(() => {
            setLoadingForm(true)
            calendarOfActivity(values)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                    setTimeout(() => {
                        if (!data.error) {
                            try {
                                currentUser?.expoPushToken && (
                                    sendPushNotificationToMobileUser(
                                        currentUser?.expoPushToken,
                                        `New activity by ${currentUser?.name}`,
                                        `${currentUser?.component} | ${currentUser?.unit} - ${values.activityTitle}\n${values.activityDescription}\n${formatDate(values.dateFrom as any)} - ${formatDate(values.dateTo as any)}`
                                    )
                                )

                                toast({
                                    title: "Success",
                                    description: "Your calendar of activity has been encoded to the server",
                                    duration: 10000,
                                    action: (
                                        <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
                                    ),
                                })

                                fetchActivitiesData()
                            } catch (error) {
                                console.error("Error submitting calendar activity:", error);

                                // Display an error toast notification
                                toast({
                                    title: "Error",
                                    description: "An unexpected error occurred while sending notification.",
                                    variant: "destructive",
                                    duration: 10000,
                                    action: (
                                        <ToastAction altText="Error toast">Ok</ToastAction>
                                    ),
                                });
                            } finally {

                                if (!loading) {
                                    setDialogClose();
                                    setLoadingForm(false);
                                }
                            }
                        }
                        setLoadingForm(false)
                    }, 2000); // Delay for 2 seconds                      
                });
        })

    }

    // Function to send a push notification
    const sendPushNotificationToMobileUser = async (expoPushToken: any, title: string, body: string, data?: string) => {
        try {
            const response = await axios.post('https://exp.host/--/api/v2/push/send', {
                to: expoPushToken,
                title,
                body,
                data
            });

            // Check the response status and handle accordingly
            if (response.data.data) {
                console.log('Push notification sent successfully:', response.data.data);
            } else {
                console.error('Error sending push notification:', response.data);
            }
        } catch (error) {
            console.error('Error making request:', error);
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

    useEffect(() => {
        const filteredUsersData = filterRegion === 'All'
            ? usersData
            : usersData.filter(user => user.region === filterRegion);

        setFilteredUsersData(filteredUsersData);
    }, [currentUser?.region, usersData, filterRegion]);


    const participants = watch('participant');

    //    useEffect(() => {
    //         const selectedIds = participants.map(participant => participant.userId);
    //         setSelectedParticipants(selectedIds);
    //     }, [participants]);

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
                                        <Input {...field} disabled={loadingForm} placeholder="Type your activity title here." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
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
                                                disabled={loadingForm}
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
                        /> */}
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
                                        <Input {...field} disabled={loadingForm}  placeholder="ex. IPS, IPO, LPMIU, RPCO, PSO, etc."/>
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
                                        <Input {...field} disabled={loadingForm} placeholder="ex. World Palace, Ecoland, Davao City"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className='flex flex-row gap-2 item-start'>
                        <div className='flex flex-row items-center justify-start gap-1 mt-5'>
                            <Checkbox checked={allDayChecked} onClick={() => setAllDayChecked(!allDayChecked)} disabled={loadingForm} />
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
                                            disabled={loadingForm}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> :
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
                                                disabled={loadingForm} />
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
                                                disabled={loadingForm}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        }

                    </div>
                    <Separator />
                    <FormLabel className='flex flex-row gap-2 justify-between items-centers'>
                        <div className='flex flex-row gap-2 items-center'>
                            <label className='font-bold md:text-xl '>Participants</label>
                            <FormDescription className='flex items-center'>
                                Please press the plus (+) button when adding new participant, (-) to remove
                            </FormDescription>
                        </div>
                        <div className='flex flex-row gap-2 justify-end items-center'>
                            <Badge className='flex flex-row gap-1 justify-center items-center'><MdPeopleAlt/>{filteredUsersData.length}</Badge>
                            <Select onValueChange={setFilterRegion} defaultValue={filterRegion} disabled={loadingForm}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='All'>All</SelectItem>
                                    {regionOptions.map((option, index) => (
                                        <SelectItem key={index} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* <Button variant='outline' type='button' onClick={()=> setIncludeAllRegions(!includeAllRegions)}>
                               <div className='h-5 w-5 rounded-full'>{filteredUsersData.length}</div> {includeAllRegions?'Filter own region':'Load all regions'} 
                            </Button> */}
                            <Badge variant='secondary'>{participantFields.length}</Badge>
                            <Button type='button' size={'sm'} disabled={loadingForm} onClick={() => appendParticipant({ userId: '' })}>
                                <FaPlus />
                            </Button>
                        </div>
                    </FormLabel>
                    {participantFields.map((field, index) => (
                        <div key={field.id} className="flex flex-row gap-2 items-end w-full">
                            <FormField
                                control={control}
                                name={`participant.${index}.userId`}
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormControl>
                                            <Select {...field} onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedParticipants((prev) => {
                                                    const newSelected = [...prev];
                                                    if (participantFields.length === 1) {
                                                        return [value];
                                                    } else {
                                                        newSelected[index] = value; // Ensure the value is set at the specific index
                                                        return newSelected;
                                                    }
                                                });
                                            }}
                                                defaultValue={field.value} disabled={loadingForm}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select participant" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {!loadingUser ? filteredUsersData.map((option, idx) => (
                                                        <SelectItem key={idx} value={option.id} disabled={selectedParticipants.includes(option.id)} className='cursor-pointer'>
                                                            <Badge>{option.name}</Badge>-
                                                            <Badge variant={'secondary'}>{option.position}</Badge>-
                                                            <Badge variant={'secondary'}> {option.region}</Badge>-
                                                            <Badge variant={'secondary'}>{option.component}</Badge>-
                                                            <Badge variant={'secondary'}> {option.unit}</Badge>
                                                        </SelectItem>
                                                    )) : <SelectItem value={' '} disabled={true}>
                                                        <div className='flex flex-row gap-2'> Fetching users... <LoadingSpinner /></div>
                                                    </SelectItem>}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                className='w-fit'
                                type='button'
                                variant={'destructive'}
                                size={'sm'}
                                onClick={() => {
                                    // Remove the participant from the form
                                    removeParticipant(index);
                                    // Remove the participant from selectedParticipants
                                    setSelectedParticipants((prev) =>
                                        prev.filter(participant => participant !== participants[index].userId) // Access the participant ID correctly
                                    );
                                }}
                                disabled={loadingForm || participantFields.length === 1}
                            >
                                <FaMinus />
                            </Button>
                        </div>
                    ))}
                    {/* Preparatory list items */}
                    <Separator />
                    <FormLabel className='flex flex-row gap-2 justify-between items-centers'>
                        <div className='flex flex-row gap-2 items-center'>
                            <label className='font-bold md:text-xl '>Preparatory List</label>
                            <FormDescription className='flex items-center'>
                                Please press the plus (+) button when adding new preparatory list, (-) to remove
                            </FormDescription>
                        </div>
                        <div className='flex flex-row gap-2 justify-end'>
                            <Badge variant='secondary'>{preparatoryListFields.length}</Badge>
                            <Button type='button' size={'sm'} disabled={loadingForm} onClick={() => appendPreparatoryList({ description: '', status: '', remarks: '' })}>
                                <FaPlus />
                            </Button>
                        </div>

                    </FormLabel>
                    {preparatoryListFields.map((field, index) => (
                        <div key={index} className="flex flex-row gap-2 items-end w-full">
                            <FormField
                                control={form.control}
                                name={`preparatoryList.${index}.description`}
                                render={({ field }) => (
                                    <FormItem className='w-full'>
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
                                        <FormControl>
                                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value} disabled={loadingForm}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PreparatoryActivityStatus.map((option, index) => (
                                                        <SelectItem key={index} value={option.value || 'default_value'} disabled={loadingForm} className='cursor-pointer'>
                                                            <Badge variant={'outline'}>{option.label}</Badge>
                                                        </SelectItem>
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
                                                <FormControl>
                                                    <Input {...field} className='w-full' disabled={loadingForm} placeholder="Enter remarks" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                            <Button
                                className='w-fit'
                                type='button'
                                variant={'destructive'}
                                size={'sm'}
                                onClick={() => removePreparatoryList(index)}
                                disabled={loadingForm || preparatoryListFields.length === 1}
                            >
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
                <FormSuccess message={success} />
                <FormError message={error} />
                <Button typeof="submit" className="w-full" disabled={loadingForm}>
                    {loadingForm && <LoadingSpinner />} Submit
                </Button>
            </form>
        </Form>
    )
}

export default CalendarForm
