'use client'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { DatePicker } from 'antd';
import { TimePicker } from 'antd';
import dayjs from 'dayjs'
import { CalendarOfActivitySchema } from '@/schemas/calendar-of-activity'
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa'
import { Separator } from '@/components/ui/separator'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'
import { PreparatoryActivityStatus, TypeData } from '@/components/calendar-of-activity/data'
import { ToastAction } from '@/components/ui/toast'
import { calendarOfActivity } from '@/actions/calendar-of-activity/calendarofactivity'
import { toast } from '@/components/ui/use-toast'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useCurrentUser } from '@/components/context/CurrentUserContext'
import axios from 'axios'
import { formatDate } from '@/components/table/data/activities/coa-columns'
import { Badge } from '@/components/ui/badge'
import { regionOptions } from '@/lib/data/filter'
import { MdPeopleAlt } from 'react-icons/md'
import { Upload } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { FancyMultiSelect, Framework } from '@/components/MultiSelect'
import { User } from '@/types/users/userType'
import { fetchActivitiesData } from '@/app/store/activityAction'
import { useDispatch, useSelector } from '@/app/store/store'
import { TypeOfActivity } from '@/components/forms/data'
import { TooltipComponent } from '@/components/Tooltip'
import { IoInformationCircleOutline } from "react-icons/io5";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles


export const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

type Props = {
    setDialogClose: () => void
    individualActivity_: boolean
}

export const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link',
            // 'image'
        ],
        [{ align: [] }],
        [{ color: [] }],
        // ['code-block'],
        ['clean'],
    ],
};


export const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    //   'image',
    'align',
    'color',
    // 'code-block',
];

const CalendarForm = ({ setDialogClose, individualActivity_ }: Props) => {
    // const { usersData, loadingUser, errorUser, fetchUsers } = useUsers();
    const { usersData, loadingUser, errorUser } = useSelector((state) => state.users);
    const { currentUser } = useCurrentUser();

    const [filteredUsersData, setFilteredUsersData] = useState<User[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<String[]>([]);

    const [multiSelectUsersDropdownData, setMultiSelectUsersDropdownData] = useState<Framework[]>([])

    const [isPending, startTransition] = useTransition();
    const [loadingForm, setLoadingForm] = useState(false); // Initialize loadingForm state

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [allDayChecked, setAllDayChecked] = useState(false)
    const [individualActivity, setIndividualActivity] = useState<boolean>(individualActivity_)

    const { RangePicker } = DatePicker;

    // const { loading, fetchActivitiesData } = useCalendarOfActivityContext();
    const { activityLoading } = useSelector((state) => state.activity);
    const dispatch = useDispatch();

    const [filterRegion, setFilterRegion] = useState(currentUser?.region);

    const [participantError, setParticipantError] = useState(false)
    const [preparatoryError, setPreparatoryError] = useState(false)
    const [scheduleError, setScheduleError] = useState(false)
    const [dateToError, setDateToError] = useState(false)
    const [preparatoryContentError, setPreparatoryContentError] = useState(false)

    const [WFPYear, setWFPYear] = useState(new Date().getFullYear().toString());



    const form = useForm<z.infer<typeof CalendarOfActivitySchema>>({
        resolver: zodResolver(CalendarOfActivitySchema),
        defaultValues: {
            authorizeOther: false,
            individualActivity: individualActivity_,
            WFPYear: WFPYear,
            activityTitle: '',
            activityDescription: '',
            targetParticipant: '',
            location: '', // optional field, can be omitted if you don't want a default value
            type: '',
            dateFrom: dayjs().format('YYYY-MM-DD'),
            dateTo: dayjs().format('YYYY-MM-DD'),
            timeStart: '',
            timeEnd: '',
            allDay: false,
            participants: [],
            color: '#F5222D',
            status: '', // default value specified in the schema
            preparatoryList: [{ description: '', status: '', remarks: '' }],
            preparatoryContent: '',
            attachments: '',
            remarks: '',
            name: currentUser?.name
        },
    })


    const handleEditorChange = (newContent: any) => {
        form.setValue('preparatoryContent', newContent)
    };
    const { control, watch } = form;

    const {
        fields: participantFields,
        append: appendParticipant,
        remove: removeParticipant
    } = useFieldArray({
        control,
        name: 'participants'
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
        console.log("values: ", values)
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

        let participantError = false;
        let preparatoryError = false;
        let scheduleError = false;
        let dateToError = false;

        if (!individualActivity_) {
            const participants = selectedParticipants.map((participantId) => ({
                userId: participantId.toString(),
            }));

            values.participants = participants;

            if (values.participants.length > 0) {
                values.participants.forEach((info) => {
                    if (info.userId.trim() === '') {
                        participantError = true;
                    }
                });
            } else {
                participantError = true; // If no participants are selected
                setParticipantError(false)
            }

        }

        if (!allDayChecked) {
            if (!values.timeStart || !values.timeEnd) {
                scheduleError = true
            }
            else{
            setScheduleError(false)
            scheduleError = false
            }
        }

        if (allDayChecked) {
            if (values.dateFrom==values.dateTo) {
                dateToError = true
            }
            else {
                dateToError = false
                setDateToError(false)
            }
        }

        // values.preparatoryList?.forEach((info) => {
        //     if (info.description.trim() === '' || info.status.trim() === '') {
        //         preparatoryError = true;
        //     }else{
        //         preparatoryError = false;
        //     }
        // });


        if (scheduleError) {
            setScheduleError(true);
            return;
        }else{
            setScheduleError(false);
        }

        if (dateToError) {
            setDateToError(true);
            return;
        }

        if (participantError) {
            setParticipantError(true);
            return;
        }else{
            setParticipantError(false);
        }

        if(!watch('preparatoryContent') && !individualActivity_){
            setPreparatoryContentError(true)
            return
        }else{
            setPreparatoryContentError(false)
        }
        // if (preparatoryError) {
        //     setPreparatoryError(true);
        //     alert("Preparatory list contains blank data. Please fill out all fields.");
        //     return;
        // }

        values.status = status
        values.dateFrom = values.dateFrom.split('T')[0],
        values.dateTo = values.dateTo.split('T')[0],
        setError("")
        setSuccess("")
        console.log("submit values: ", values)
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

                                dispatch(fetchActivitiesData())
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

                                if (!activityLoading) {
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

    const addOneDay = (date: string): string => {
        return dayjs(date).add(1, 'day').toISOString().split('T')[0];
    };

    const handleRangePickerChange = (value: any) => {
        if (value && Array.isArray(value) && value.length === 2) {
            const [startDate, endDate] = value.map((date: any) => dayjs(date).toISOString());

            // Add one day to startDate and endDate
            const newStartDate = addOneDay(startDate);
            const newEndDate = addOneDay(endDate);

            form.setValue('dateFrom', newStartDate);
            form.setValue('dateTo', newEndDate);

        } else {
            // Clear the value if no range is selected
            form.setValue('dateFrom', dayjs().format('YYYY-MM-DD'));
            form.setValue('dateTo', dayjs().format('YYYY-MM-DD'),);
        }
    };

    const handleDatePickerChange = (value: any) => {
        if (value) {
            const date = dayjs(value); // Convert the input value to a Day.js object
            const formattedDate = date.toISOString(); // Format the date as per ISO 8601

            // Add one day to the date
            const newDate = addOneDay(formattedDate);

            form.setValue('dateFrom', newDate);
            form.setValue('dateTo', newDate);
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

        } else {
            // Clear the value if no range is selected
            form.setValue('timeStart', '');
            form.setValue('timeEnd', '');
        }
    };

    const convertUsersToDropdownData = (users: User[]) => {
        return users.map(user => ({ value: user.id, label: `${user.region} - ${user.name}` }));
    };

    useEffect(() => {
        const filteredUsersData = filterRegion === 'All'
            ? usersData
            : usersData.filter(user => user.region === filterRegion);

        const multiSelectUsersDropdownData = convertUsersToDropdownData(filteredUsersData)
        setMultiSelectUsersDropdownData(multiSelectUsersDropdownData)
        setFilteredUsersData(filteredUsersData);
    }, [currentUser?.region, usersData, filterRegion]);

    const participants = watch('participants');

    useEffect(() => {
        const selectedIds = participants?.map(participant => participant.userId);
        setSelectedParticipants(selectedIds || []);
    }, [participants]);

    const clearFunctionRef = useRef<() => void | null>(null);
    const selectAllFunctionRef = useRef<() => void | null>(null);

    const handleAllDayChecked = () => {
        setAllDayChecked(!allDayChecked)
        form.setValue('dateFrom', dayjs().format('YYYY-MM-DD'));
        form.setValue('timeStart', '');
        form.setValue('timeEnd', '');
        setScheduleError(false)
    }

    const handleIndividualActivityChecked = () => {
        setIndividualActivity(!individualActivity)
        form.setValue('individualActivity', allDayChecked)
    }
    const WFPYears = ['2023', '2024', '2025', '2026', '2027', '2028']
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full" autoComplete="off">
                <div className="space-y-4 w-full flex flex-col flex-wrap">
                    <div className='flex flex-row gap-2 w-full'>
                        <FormField
                            control={form.control}
                            name="activityTitle"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Activity Title<FormMessage /></FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loadingForm} className='text-xs sm:text-sm' placeholder="Type your activity title here." />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='mt-auto'>
                            <Select onValueChange={(value) => setWFPYear(value)} defaultValue={WFPYear} disabled={loadingForm}>
                                <SelectTrigger className='text-xs sm:text-sm'>
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {WFPYears.map((year, index) => (
                                        <SelectItem
                                            key={index}
                                            value={year}
                                            disabled={loadingForm}
                                            className="text-xs sm:text-sm"
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="activityDescription"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Activity Description<FormMessage /></FormLabel>
                                <FormControl>
                                    <Textarea {...field} disabled={loadingForm} className='text-xs sm:text-sm' placeholder="Type your description here." />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className='flex flex-row flex-wrap sm:grid grid-cols-3 gap-2'>
                        <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                                <FormItem className='mt-auto w-full'>
                                    <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Type<FormMessage /></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingForm}>
                                            <FormControl
                                                className="text-xs sm:text-sm">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TypeData.map((option, index) => (
                                                    <SelectItem key={index}
                                                        value={option.value || 'default_value'}
                                                        disabled={loadingForm}
                                                        className="text-xs sm:text-sm">{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="targetParticipant"
                            render={({ field }) => (
                                <FormItem className='mt-auto w-full'>
                                    <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm flex-nowrap'>Target Participant<FormMessage /></FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loadingForm} className='text-xs sm:text-sm' placeholder="ex. IPS, IPO, LPMIU, RPCO, PSO, etc." />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className='mt-auto w-full'>
                                    <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Location<FormMessage /></FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loadingForm} className='text-xs sm:text-sm' placeholder="ex. World Palace, Ecoland, Davao City" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                    </div>
                    <Separator />
                    <FormLabel className='flex flex-row gap-2 justify-start items-center'>
                        <label className='font-bold md:text-xl items-center'>
                            Schedule
                        </label>
                        <div className='flex flex-row items-center justify-start gap-1'>
                            <Checkbox checked={allDayChecked} onClick={handleAllDayChecked} disabled={loadingForm} />
                            <label
                                htmlFor="allday"
                                className="text-xs sm:text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap">
                                All day
                            </label>
                        </div>
                        <TooltipComponent
                            trigger={<button type='button' className='flex items-center'><IoInformationCircleOutline size={24} /></button>}
                            description="Please check (All day) if the activity is more than just 1 day"
                        />
                    </FormLabel>
                    <div className='flex flex-row gap-2 item-start flex-wrap'>
                        {allDayChecked ?
                            <div className='flex flex-col mt-auto w-fit'>
                                <FormLabel 
                                    className='text-xs sm:text-sm' 
                                    style={dateToError ? { color: '#f04d44' } : {}}>
                                        Planned Date Range</FormLabel>
                                <RangePicker
                                    className='text-xs sm:text-sm dark:bg-[#020817] dark:text-[#f8fafc] dark:border-[#182334]'
                                    
                                    defaultValue={[dayjs(), null]}
                                    format={'YYYY-MM-DD'}
                                    onChange={(value) => handleRangePickerChange(value)}
                                    disabled={loadingForm}
                                />
                            </div>
                            :
                            <div className='flex flex-row gap-2 mt-auto '>
                                <div className='mt-auto'>
                                    <FormLabel className='text-xs sm:text-sm'>Planned Date</FormLabel>
                                    <DatePicker
                                        className='w-full text-xs sm:text-sm dark:bg-[#020817] dark:text-[#f8fafc] dark:border-[#182334]'
                                        defaultValue={[dayjs()]}
                                        onChange={(value) => handleDatePickerChange(value)}
                                        disabled={loadingForm} />
                                </div>
                                <div className='flex flex-col mt-auto gap-2'>
                                    <FormLabel
                                        className='text-xs sm:text-sm'
                                        style={scheduleError ? { color: '#f04d44' } : {}}
                                    >
                                        Time Range {scheduleError && '*'}
                                    </FormLabel>
                                    <TimePicker.RangePicker
                                        className='w-full text-xs sm:text-sm dark:bg-[#020817] dark:text-[#f8fafc] dark:border-[#182334]'
                                        onChange={(value) => handleTimeRangeChange(value)}
                                        disabled={loadingForm}
                                        format={'HH:mm'}
                                    />
                                </div>


                            </div>
                        }

                    </div>
                    {!individualActivity_ && <>
                        <Separator />
                        <FormLabel className='flex flex-row gap-2 justify-between items-center flex-wrap'>
                            <div className='flex flex-row gap-2 items-center'>
                                <label
                                    className='font-bold md:text-xl mr-auto'
                                    style={participantError ? { color: '#f04d44' } : {}}
                                >
                                    Participants {participantError && '*'}
                                </label>
                                <TooltipComponent
                                    trigger={<button type='button' className='flex items-center'><IoInformationCircleOutline size={24} /></button>}
                                    description="Please press (All) to select all participants, (trash icon) to remove all"
                                />
                            </div>
                            <div className='flex flex-row gap-2 justify-center sm:justify-end items-center w-full sm:w-fit'>
                                <Badge className='flex flex-row gap-1 justify-center items-center'><MdPeopleAlt />{filteredUsersData.length}</Badge>
                                <Select onValueChange={setFilterRegion} defaultValue={filterRegion} disabled={loadingForm}>
                                    <SelectTrigger className='text-xs sm:text-sm'>
                                        <SelectValue placeholder="Filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='All' className='text-xs sm:text-sm'>All</SelectItem>
                                        {regionOptions.map((option, index) => (
                                            <SelectItem
                                                key={index}
                                                value={option}
                                                className="text-xs sm:text-sm">{option}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Badge className='flex flex-row gap-1 justify-center items-center' variant='secondary'><MdPeopleAlt />{selectedParticipants.length}</Badge>
                                <Button
                                    variant={'destructive'}
                                    type='button' size={'sm'}
                                    disabled={loadingForm || selectedParticipants.length == 0}
                                    onClick={() => {
                                        if (clearFunctionRef.current) clearFunctionRef.current();
                                    }}>
                                    <FaTrash />
                                </Button>
                                <Button
                                    type='button'
                                    size={'sm'}
                                    disabled={loadingForm}
                                    onClick={() => {
                                        if (selectAllFunctionRef.current) selectAllFunctionRef.current();
                                    }}>
                                    All
                                </Button>
                            </div>
                        </FormLabel>
                        <FancyMultiSelect
                            data={multiSelectUsersDropdownData}
                            onSelectionChange={(selected) => setSelectedParticipants(selected)}
                            clearFunctionRef={clearFunctionRef}
                            selectAllFunctionRef={selectAllFunctionRef}
                            disabled={loadingForm}
                        />
                    </>}



                    {/* Preparatory list items */}
                    {!individualActivity_ && <>
                        <Separator />
                        <FormLabel className='flex flex-row gap-2 justify-between items-centers'>
                            <div className='flex flex-row gap-2 items-center'>
                                <label
                                    className='font-bold md:text-xl'
                                style={preparatoryContentError ? { color: '#f04d44' } : {}}
                                >
                                    Preparatory List
                                </label>
                                <TooltipComponent
                                    trigger={<button type='button' className='flex items-center'><IoInformationCircleOutline size={24} /></button>}
                                    description="Please enter your preparatory list below. For clarity, consider using bullet points or numbering."
                                />
                            </div>
                            {/* <div className='flex flex-row gap-2 justify-end items-center'>
                            <Badge variant='secondary' className='h-fit'>{preparatoryListFields.length}</Badge>
                            <Button type='button' size={'sm'} disabled={loadingForm} onClick={() => appendPreparatoryList({ description: '', status: '', remarks: '' })}>
                                <FaPlus />
                            </Button>
                        </div> */}

                        </FormLabel>
                        <QuillEditor
                            readOnly={loadingForm}
                            value={watch('preparatoryContent')}
                            onChange={handleEditorChange}
                            modules={quillModules}
                            formats={quillFormats}
                            className="w-full"
                            
                        />
                    </>}

                    {/* {preparatoryListFields.map((field, index) => (
                        <div key={index} className="flex flex-row gap-2 items-end w-full">
                            <FormField
                                control={form.control}
                                name={`preparatoryList.${index}.description`}
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormControl>
                                            <Input {...field} disabled={loadingForm} className='text-xs sm:text-sm' placeholder="Enter description" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`preparatoryList.${index}.status`}
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingForm}>
                                            <SelectTrigger className='text-xs sm:text-sm'>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PreparatoryActivityStatus.map((option, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={option.value || 'default_value'}
                                                        disabled={loadingForm}
                                                        className='cursor-pointer text-xs sm:text-sm'>
                                                        <Badge variant={'outline'}>{option.label}</Badge>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                                    <Input {...field} className='w-full' disabled={loadingForm} placeholder="Please specify..." />
                                                </FormControl>
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
                    ))} */}
                    <Separator />
                    <div className='flex flex-row w-full items-end gap-2'>
                        <FormField
                            control={form.control}
                            name="attachments"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Attachments <Label className=' font-extralight text-xs sm:text-sm'> (Optional)</Label></FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loadingForm} className='text-xs sm:text-sm' placeholder="Link for you attachments here." />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='ml-auto'>
                            <Button disabled size={'sm'}><Upload /></Button>

                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Remarks <Label className=' font-extralight text-xs sm:text-sm'> (Optional)</Label></FormLabel>
                                <FormControl>
                                    <Textarea {...field} disabled={loadingForm} className='text-xs sm:text-sm' placeholder="Type your remarks here." />
                                </FormControl>
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
        </Form >
    )
}

export default CalendarForm
