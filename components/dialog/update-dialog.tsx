'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarOfActivitySchema } from '@/schemas/calendar-of-activity';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { DatePicker, TimePicker } from 'antd';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { updateCalendarOfActivity } from '@/actions/calendar-of-activity/update';
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa'
import { Separator } from '@/components/ui/separator'
import { PreparatoryActivityStatus, TypeData } from '@/components/calendar-of-activity/data'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { regionOptions, statusOptions } from '@/lib/data/filter';
import { getStatusColor } from '../table/data/activities/coa-columns';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from 'lucide-react';
import { ToastAction } from '../ui/toast';
import { toast } from '../ui/use-toast';
import { useCurrentUser } from '../context/CurrentUserContext';
import { MdPeopleAlt } from 'react-icons/md';
import { useDispatch, useSelector } from '@/app/store/store';
import { User } from '@/types/users/userType';
import { fetchActivitiesData } from '@/app/store/activityAction';
import { Framework } from '../MultiSelect';
import FancyMultiSelectUpdateActivity from '../MultiSelectUpdateActivity';
import { QuillEditor, quillFormats, quillModules } from '@/app/(app)/activities/calendar-form';
import { HiUser, HiUserGroup } from 'react-icons/hi2';
import { TooltipComponent } from '../Tooltip';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { Switch } from '../ui/switch';


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
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [currentIndex, setCurrentIndex] = useState(0);

    // const { activities, loading, fetchActivitiesData } = useCalendarOfActivityContext();
    const { activitiesData, activityError, activityLoading } = useSelector((state) => state.activity)

    const dispatch = useDispatch()

    const [allDayChecked, setAllDayChecked] = useState(false);
    const { RangePicker } = DatePicker;

    const [selectedParticipants, setSelectedParticipants] = useState(['']);
    const [participantError, setParticipantError] = useState(false)
    const [preparatoryError, setPreparatoryError] = useState(false)
    const [timeError, setTimeError] = useState(false)
    const [dateToError, setDateToError] = useState(false)
    // const { usersData, loadingUser, errorUser, fetchUsers } = useUsers();
    const { usersData, loadingUser, errorUser } = useSelector((state) => state.users)

    const { currentUser } = useCurrentUser();

    const [filterRegion, setFilterRegion] = useState(currentUser?.region);

    const [filteredUsersData, setFilteredUsersData] = useState<User[]>([]);

    const [multiSelectUsersDropdownData, setMultiSelectUsersDropdownData] = useState<Framework[]>([])

    const [selectedData, setSelectedData] = useState<Framework[]>([])

    const [listMode, setListMode] = useState<boolean>(false)

    const [WFPYear, setWFPYear] = useState(new Date().getFullYear().toString());
    const WFPYears = ['2023', '2024', '2025', '2026', '2027', '2028']

    const form = useForm<z.infer<typeof CalendarOfActivitySchema>>({
        resolver: zodResolver(CalendarOfActivitySchema),
        defaultValues: {
            activityTitle: '',
            individualActivity: false,
            WFPYear: WFPYear,
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
            participants: [{ userId: '' }],
            preparatoryContent: '',
            preparatoryList: [{ description: '', status: '', remarks: '' }],
            calendarOfActivityAttachment: [{ details: '', link: '' }],
            remarks: '',
            name: '',
        },
    });
    const convertUsersToDropdownData = (users: User[]) => {
        return users.map(user => ({ value: user.id, label: `${user.region} - ${user.name}` }));
    };
    // console.log("selectedParticipants: ", selectedParticipants)
    const participants = form.watch('participants');

    const convertUsersToSelectedParticipantData = useCallback((): Framework[] => {
        if (!participants) {
            return []; // Return an empty array if participants is undefined
        }

        return participants.map((participant: any) => {
            const matchedUser = usersData.find((user: any) => user.id === participant.userId);
            if (matchedUser) {
                return { value: matchedUser.id, label: `${matchedUser.region} - ${matchedUser.name}` };
            }
            return null; // or handle the case when there's no match found
        })
            .filter((user): user is Framework => user !== null); // filter out any null values
    }, [participants, usersData]);


    useEffect(() => {
        if (participants) {
            setSelectedData(convertUsersToSelectedParticipantData());
            setSelectedParticipants(participants.map((participant) => participant.userId));
        } else {
            setSelectedData([]);
            setSelectedParticipants([]);
        }
    }, [activityId, currentIndex, openUpdateDialog, participants, usersData, setSelectedData, setSelectedParticipants, convertUsersToSelectedParticipantData]);

    useEffect(() => {
        const filteredUsersData = filterRegion === 'All'
            ? usersData
            : usersData.filter(user => user.region === filterRegion);

        setFilteredUsersData(filteredUsersData);

        const multiSelectUsersDropdownDatas = convertUsersToDropdownData(filteredUsersData)
        setMultiSelectUsersDropdownData(multiSelectUsersDropdownDatas);

    }, [currentUser?.region, usersData, filterRegion]);

    // console.log("filteredUsersData: ", filteredUsersData)
    // console.log("MultiSelectUsersDropdownData: ", multiSelectUsersDropdownData)

    // console.log("form.participants", form.watch('participants'))
    // console.log("selectedData: ", selectedData)

    useEffect(() => {
        if (activityId.length > 0 && currentIndex < activityId.length) {
            setLoadingForm(true);
            const activityData = activitiesData.find((activity: { id: string; }) => activity.id === activityId[currentIndex]);
            if (activityData) {
                form.reset({
                    activityTitle: activityData.activityTitle,
                    individualActivity: activityData.individualActivity,
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
                    participants: activityData.participants.length > 0 ? activityData.participants : [{ userId: '' }],
                    preparatoryContent: activityData.preparatoryContent,
                    preparatoryList: activityData.preparatoryList.length > 0 ? activityData.preparatoryList : [{ description: '', status: '', remarks: '' }],
                    calendarOfActivityAttachment: activityData.calendarOfActivityAttachment && activityData.calendarOfActivityAttachment.length > 0 ? activityData.calendarOfActivityAttachment : [{ details: '', link: '' }],
                    remarks: activityData.remarks,
                });
                setListMode(activityData.preparatoryContent ? false : true)
                setAllDayChecked(activityData.dateFrom != activityData.dateTo);
            }
            setLoadingForm(false);
        }
    }, [activityId, currentIndex, activitiesData, form]);


    console.log("activityData: ", activitiesData)
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

    const {
        fields: attachmentFields,
        append: appendAttachments,
        remove: removeAttachments
    } = useFieldArray({
        control,
        name: 'calendarOfActivityAttachment'
    });
    const onSubmit = async (values: z.infer<typeof CalendarOfActivitySchema>) => {
        console.log("updatedvalues: ", values)
        setError('');
        setSuccess('');

        const individualActivity = watch('individualActivity');
        // Transform participants to match Prisma's expected structure
        const formattedParticipants = selectedParticipants.map((item: any) => ({
            userId: item,
        }));

        if (!allDayChecked) {
            values.dateTo = values.dateFrom
        }

        if (!allDayChecked) {
            if (!values.timeStart || !values.timeEnd) {
                setTimeError(true)
                return
            }
            else {
                setTimeError(false)
            }
        }

        if (allDayChecked) {
            if (values.dateFrom == values.dateTo) {
                setDateToError(true)
                return
            }
            else {
                setDateToError(false)
            }
        }
        // Check for id presence in preparatoryList items
        const formattedPreparatoryList = values.preparatoryList?.map((item: { id?: any; description?: string; status?: string; remarks?: string }) => ({
            id: item.id || '', // Handle cases where id might be missing
            description: item.description,
            status: item.status,
            remarks: item.remarks,
        })) || [];

        // Check for id presence in calendarOfActivityAttachment items
        const formattedAttachments = values.calendarOfActivityAttachment?.map((item: { id?: any; details?: string; link?: string }) => ({
            id: item.id || '', // Handle cases where id might be missing
            details: item.details,
            link: item.link,
        })) || [];


        //Final updated values
        const formattedValues: any = {
            ...values,
            preparatoryList: {
                deleteMany: {}, // This will delete all preparatory list items for the given CalendarOfActivity
                createMany: {
                    data: individualActivity ? [] : formattedPreparatoryList
                }
            },
            calendarOfActivityAttachment: {
                deleteMany: {}, // This will delete all preparatory list items for the given CalendarOfActivity
                createMany: {
                    data: formattedAttachments
                }
            }
        };



        if (formattedParticipants.length > 0) {
            formattedValues.participants = {
                deleteMany: {}, // This will delete all participants for the given CalendarOfActivity
                createMany: {
                    data: individualActivity ? [] : formattedParticipants
                }
            };
        }
        if (formattedParticipants[0].userId.length == 0 && !individualActivity) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please update your participants",
                duration: 5000,
                action: (
                    <ToastAction altText="Ok">Ok</ToastAction>
                ),
            });

        } else {
            setLoadingForm(true);

            try {

                const result = await updateCalendarOfActivity(activityId[currentIndex], formattedValues);

                if (result.success) {
                    toast({
                        title: "Success",
                        description: result.success,
                        duration: 5000,
                        action: (
                            <ToastAction altText="Ok">Ok</ToastAction>
                        ),
                    });

                    // console.log("submitting result: ", result);

                    if (currentIndex < activityId.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                    } else {
                        setUpdateDialogClose(false);
                    }

                    dispatch(fetchActivitiesData())
                } else if (result.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: result.error,
                        duration: 5000,
                        action: (
                            <ToastAction altText="Ok">Ok</ToastAction>
                        ),
                    });
                }
            } catch (err) {
                console.error('Failed to update activity:', err);
                setError('Failed to update activity. Please try again.');
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to update activity. Please try again.",
                    duration: 5000,
                    action: (
                        <ToastAction altText="Ok">Ok</ToastAction>
                    ),
                });
            } finally {
                setLoadingForm(false);
            }
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

    const avoidDefaultDomBehavior = (e: Event) => {
        e.preventDefault();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            event.stopPropagation();
        }
    };

    const defaultTimeStart = dayjs(form.watch("timeStart"), 'HH:mm');
    const defaultTimeEnd = dayjs(form.watch("timeEnd"), 'HH:mm');
    const defaultTimeValues: [dayjs.Dayjs | null, dayjs.Dayjs | null] = [
        defaultTimeStart.isValid() ? defaultTimeStart : null,
        defaultTimeEnd.isValid() ? defaultTimeEnd : null
    ];
    const handleAllDayChecked = () => {
        setAllDayChecked(!allDayChecked)
        form.setValue('dateFrom', dayjs().format('YYYY-MM-DD'));
        form.setValue('timeStart', '');
        form.setValue('timeEnd', '');
    }

    const clearFunctionRef = useRef<() => void | null>(null);
    const selectAllFunctionRef = useRef<() => void | null>(null);

    const handleListChange = () => {
        form.setValue("preparatoryList", [{ description: '', status: '', remarks: '' }])
        form.setValue("preparatoryContent", "")
    }

    return (
        <Dialog open={openUpdateDialog} onOpenChange={setUpdateDialogClose}>
            <DialogContent className="min-w-[99%] md:min-w-[90%] lg:min-w-[60%] overflow-y-auto scrollbar-thin max-h-[95vh] rounded-lg"
                onPointerDownOutside={avoidDefaultDomBehavior}
                onInteractOutside={avoidDefaultDomBehavior}
                onKeyDown={handleKeyDown}>

                <DialogTitle className='flex justify-between -mb-2'>
                    <div className='flex flex-row gap-1'>
                        Update {watch('individualActivity') ? 'individual' : 'major'} activity form {watch('individualActivity') ? <HiUser /> : <HiUserGroup />}
                    </div>
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
                        </div>
                    )}

                </DialogTitle>
                {activityId.length ? (
                    <>
                        <DialogDescription>
                            Don&apos;t forget to press update when finished.
                        </DialogDescription>
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
                                                        <Input {...field} className='text-xs sm:text-sm' disabled={loadingForm} placeholder="Type your activity title here." />
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
                                                    <Textarea className='text-xs sm:text-sm'  {...field} disabled={loadingForm} placeholder="Type your description here." />
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
                                    <div className='flex flex-row gap-2 item-start flex-wrap'>
                                        <div className='flex flex-row items-center justify-start gap-1 mt-5'>
                                            <Checkbox checked={allDayChecked} onClick={handleAllDayChecked} disabled={loadingForm} />
                                            <label
                                                htmlFor="allday"
                                                className="text-xs sm:text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap">
                                                All day
                                            </label>
                                        </div>
                                        {allDayChecked ?
                                            <FormField
                                                control={form.control}
                                                name="dateTo"
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col mt-auto w-fit'>
                                                        <FormLabel className='text-xs sm:text-sm'>Planned Date Range</FormLabel>
                                                        <RangePicker
                                                            className='text-xs sm:text-sm dark:bg-[#020817] dark:text-[#f8fafc] dark:border-[#182334]'
                                                            defaultValue={[dayjs(form.watch('dateFrom')), dayjs(form.watch('dateTo'))]}
                                                            format={'YYYY-MM-DD'}
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
                                                            <FormLabel className='text-xs sm:text-sm'>Planned Date</FormLabel>
                                                            <DatePicker
                                                                className='w-full text-xs sm:text-sm dark:bg-[#020817] dark:text-[#f8fafc] dark:border-[#182334]'
                                                                defaultValue={[dayjs(form.watch('dateFrom'))]}
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
                                                        <FormItem className='mt-auto'>
                                                            <FormLabel className='text-xs sm:text-sm'
                                                                style={timeError ? { color: '#f04d44' } : {}}
                                                            >Time Range {timeError && '*'}</FormLabel>
                                                            <TimePicker.RangePicker
                                                                className='w-full text-xs sm:text-sm dark:bg-[#020817] dark:text-[#f8fafc] dark:border-[#182334]'
                                                                onChange={(value) => handleTimeRangeChange(value)}
                                                                format={"HH:mm"}
                                                                defaultValue={defaultTimeValues}
                                                                disabled={loadingForm}
                                                            />
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        }
                                        <FormField
                                            control={form.control}
                                            name='status'
                                            render={({ field }) => (
                                                <FormItem className='w-full mt-auto'>
                                                    <FormLabel className='text-xs sm:text-sm'>Status</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingForm}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {statusOptions.map((option, index) => (
                                                                    <SelectItem key={index} value={option} disabled={loadingForm}
                                                                    ><Badge aria-disabled={loadingForm} className={`font-medium cursor-pointer hover:${getStatusColor(option)
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
                                    <Separator />
                                    {!watch('individualActivity') && <>
                                        <div className='flex flex-row gap-2 justify-between items-center flex-wrap'>
                                            <FormLabel>
                                                <div className='flex flex-row gap-2 items-center'>
                                                    <label
                                                        className='font-bold md:text-xl mr-auto flex flex-row'
                                                    >
                                                        Participants
                                                    </label>
                                                    <TooltipComponent
                                                        trigger={<button type='button' className='flex items-center'><IoInformationCircleOutline size={24} /></button>}
                                                        description="Please press (All) to select all participants, (trash icon) to remove all"
                                                    />
                                                </div>
                                            </FormLabel>

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

                                                <Badge className='flex flex-row gap-1 justify-center items-center'
                                                    variant='secondary'><MdPeopleAlt />{form.watch('participants')?.length}</Badge>
                                                <Button
                                                    variant={'destructive'}
                                                    type='button' size={'sm'}
                                                    disabled={loadingForm || form.watch('participants')?.length == 0}
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
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="participants"
                                            render={({ field }) => (
                                                <FormItem className='mt-auto w-full'>

                                                    <FormMessage />

                                                    <FormControl>
                                                        <FancyMultiSelectUpdateActivity
                                                            {...field}
                                                            data={multiSelectUsersDropdownData}
                                                            onSelectionChange={(selected) => {
                                                                const formattedParticipants = selected.map(user => ({ userId: user }));
                                                                field.onChange(formattedParticipants);  // Ensure this matches the format
                                                            }}
                                                            clearFunctionRef={clearFunctionRef}
                                                            selectAllFunctionRef={selectAllFunctionRef}
                                                            disabled={loadingForm}
                                                            selectedData={selectedData}

                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </>}

                                    {!watch('individualActivity') &&
                                        <>

                                            {/* Preparatory list items */}
                                            <FormLabel className='flex flex-row gap-2 justify-between items-centers'>
                                                <div className='flex flex-row gap-2 items-center'>
                                                    <label
                                                        className='font-bold md:text-xl'
                                                    >
                                                        Preparatory {listMode ? 'List' : 'Content'}
                                                    </label>
                                                    <TooltipComponent
                                                        trigger={<button type='button' className='flex items-center'><IoInformationCircleOutline size={24} /></button>}
                                                        description="Please enter your preparatory list below. For clarity, consider using bullet points or numbering."
                                                    />
                                                 
                                                            <div className="flex items-center space-x-2">
                                                                <Switch id="list-mode" checked={listMode} onCheckedChange={(value) => { setListMode(value); handleListChange() }} disabled={loadingForm} />
                                                                <Label htmlFor="list-mode" className='text-xs sm:text-sm'>List mode</Label>
                                                            </div>
                                                 

                                                </div>
                                                {listMode &&
                                                    <div className='flex flex-row gap-2 justify-end items-center'>
                                                        <Badge variant='secondary' className='h-fit'>{preparatoryListFields.length}</Badge>
                                                        <Button type='button' size={'sm'} disabled={loadingForm} onClick={() => appendPreparatoryList({ description: '', status: '', remarks: '' })}>
                                                            <FaPlus />
                                                        </Button>
                                                    </div>
                                                }

                                                <FormMessage />
                                            </FormLabel>
                                            {!listMode ? <>
                                                <FormField
                                                    control={form.control}
                                                    name="preparatoryContent"
                                                    render={({ field }) => (
                                                        <FormItem className='w-full'>
                                                            <FormMessage />
                                                            <FormControl>
                                                                <QuillEditor
                                                                    readOnly={loadingForm}
                                                                    value={field.value}
                                                                    defaultValue={field.value}
                                                                    onChange={field.onChange}
                                                                    modules={quillModules}
                                                                    formats={quillFormats}
                                                                    className="w-full"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                            </> :
                                                <>
                                                    {preparatoryListFields.map((field, index) => (
                                                        <FormField
                                                            control={form.control}
                                                            name={'preparatoryList'}
                                                            key={index}
                                                            render={({ field }) => (
                                                                <FormItem className='w-full'>
                                                                    <FormControl>
                                                                        <div key={index} className="flex flex-row gap-2 items-end w-full">
                                                                            <FormField
                                                                                control={form.control}
                                                                                name={`preparatoryList.${index}.description`}
                                                                                render={({ field }) => (
                                                                                    <FormItem className='w-full'>
                                                                                        <FormMessage />
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
                                                                                        <FormMessage />
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
                                                                                                <FormMessage />
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
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />

                                                    ))}
                                                </>
                                            }

                                        </>

                                    }
                                    <FormLabel className='flex items-center justify-between -pb-10'>
                                        <div className='flex flex-row items-center gap-1'>
                                            <label
                                                className='font-bold md:text-xl'

                                            >
                                                Attachments
                                            </label>
                                            <TooltipComponent
                                                trigger={<button type='button' className='flex items-center'><IoInformationCircleOutline size={24} /></button>}
                                                description="If you add any attachment here, the attachment fields will be required."
                                            />
                                            <Label className=' font-extralight text-xs sm:text-sm'>
                                                (Optional)
                                            </Label>
                                        </div>
                                        <Button type='button' size={'sm'} disabled={loadingForm} onClick={() => appendAttachments({ details: '', link: '' })}>
                                            <FaPlus />
                                        </Button>
                                    </FormLabel>
                                    {attachmentFields.map((field, index) => (
                                        <FormField
                                            control={form.control}
                                            name={'calendarOfActivityAttachment'}
                                            key={index}
                                            render={({ field }) => (
                                                <FormItem className='w-full pt-0 mt-0'>
                                                    <FormControl>
                                                        <div key={index} className="flex flex-row gap-2 items-end w-full">
                                                            <FormField
                                                                control={form.control}
                                                                name={`calendarOfActivityAttachment.${index}.details`}
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormMessage />
                                                                        <FormControl>
                                                                            <Input {...field} disabled={loadingForm} className='text-xs sm:text-sm' placeholder="Enter details" />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`calendarOfActivityAttachment.${index}.link`}
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormMessage />
                                                                        <FormControl>
                                                                            <Input {...field} disabled={loadingForm} className='text-xs sm:text-sm text-blue-500' placeholder="Paste link here." />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button
                                                                className='w-fit'
                                                                type='button'
                                                                variant={'destructive'}
                                                                size={'sm'}
                                                                onClick={() => removeAttachments(index)}
                                                                disabled={loadingForm || attachmentFields.length === 1}
                                                            >
                                                                <FaMinus />
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                    ))}

                                    <FormField
                                        control={form.control}
                                        name="remarks"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Remarks <Label className=' font-extralight text-xs sm:text-sm'> (Optional)</Label></FormLabel>
                                                <FormControl>
                                                    <Textarea className='text-xs sm:text-sm'  {...field} disabled={loadingForm} placeholder="Type your remarks here." />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* <FormSuccess message={success} /> */}
                                <FormError message={error} />
                                <div className='flex flex-row justify-end gap-2'>
                                    <Button variant="secondary" onClick={onCancel} disabled={loadingForm}>
                                        Cancel
                                    </Button>
                                    <Button typeof="submit" disabled={loadingForm}>
                                        {loadingForm ? <LoadingSpinner /> : 'Update'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
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
