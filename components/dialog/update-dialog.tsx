'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarOfActivitySchema } from '@/schemas/calendar-of-activity';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { DatePicker, TimePicker } from 'antd';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { updateCalendarOfActivity } from '@/actions/calendar-of-activity/update';
import { useCalendarOfActivityContext } from '../context/CalendarOfActivityContext';
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { Separator } from '@/components/ui/separator'
import { ActivityStatus, PreparatoryActivityStatus, TypeData } from '@/components/calendar-of-activity/data'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { regionOptions, statusOptions } from '@/lib/data/filter';
import { getStatusColor } from '../table/data/activities/coa-columns';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { ChevronLeftCircleIcon, ChevronLeftSquare, ChevronRightCircleIcon } from 'lucide-react';
import { ToastAction } from '../ui/toast';
import { toast } from '../ui/use-toast';
import moment from 'moment';
import { User, useUsers } from '../context/UsersContext';
import { useCurrentUser } from '../context/CurrentUserContext';
import { MdPeopleAlt } from 'react-icons/md';


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

    const { activities, loading, fetchActivitiesData } = useCalendarOfActivityContext();
    const [allDayChecked, setAllDayChecked] = useState(false);
    const { RangePicker } = DatePicker;

    const [selectedParticipants, setSelectedParticipants] = useState(['']);
    const [participantError, setParticipantError] = useState(false)
    const [preparatoryError, setPreparatoryError] = useState(false)

    const { usersData, loadingUser, errorUser, fetchUsers } = useUsers();
    const { currentUser } = useCurrentUser();

    const [filterRegion, setFilterRegion] = useState(currentUser?.region);

    const [filteredUsersData, setFilteredUsersData] = useState<User[]>([]);

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
            participants: [{ userId: '' }],
            preparatoryList: [{ description: '', status: '', remarks: '' }],
            remarks: '',
            name: '',
        },
    });


    useEffect(() => {
        const filteredUsersData = filterRegion === 'All'
            ? usersData
            : usersData.filter(user => user.region === filterRegion);

        setFilteredUsersData(filteredUsersData);
    }, [currentUser?.region, usersData, filterRegion]);

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
                    participants: activityData.participants.length > 0 ? activityData.participants : [{ userId: '' }],
                    preparatoryList: activityData.preparatoryList.length > 0 ? activityData.preparatoryList : [{ description: '', status: '', remarks: '' }],
                    remarks: activityData.remarks,
                });
                setAllDayChecked(activityData.allDay);
            }
            setLoadingForm(false);
        }
    }, [activityId, currentIndex, activities, form]);

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

    const participants = watch('participants');

    const onSubmit = async (values: any) => {
        setError('');
        setSuccess('');
        setLoadingForm(true);

        // Transform participants to match Prisma's expected structure
        const formattedParticipants = values.participants.map((item: { userId: any }) => ({
            userId: item.userId,
        }));
        // Transform preparatoryList to match Prisma's expected structure
        const formattedPreparatoryList = values.preparatoryList.map((item: { id: any; description: any; status: any; remarks: any; }) => ({
            id: item.id,
            description: item.description,
            status: item.status,
            remarks: item.remarks,
        }));

        const formattedValues: any = {
            ...values,
            preparatoryList: {
                deleteMany: {}, // This will delete all preparatory list items for the given CalendarOfActivity
                createMany: {
                    data: formattedPreparatoryList
                }
            }
        };
    
        if (formattedParticipants.length > 0) {
            formattedValues.participants = {
                deleteMany: {}, // This will delete all participants for the given CalendarOfActivity
                createMany: {
                    data: formattedParticipants
                }
            };
        }

        console.log("submitting values: ", formattedValues);

        try {
            const result = await updateCalendarOfActivity(activityId[currentIndex], formattedValues);

            if (result.success) {
                toast({
                    className:"bg-green-500",
                    title: "Success",
                    description: result.success,
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
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full md:min-w-[60%]" autoComplete="off">
                                <div className="space-y-4">
                                    <div className='flex flex-row gap-2 w-full'>
                                        <FormField
                                            control={form.control}
                                            name="activityTitle"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel className='text-xs sm:text-sm'>Activity Title</FormLabel>
                                                    <FormControl>
                                                        <Textarea className='text-xs sm:text-sm'  {...field} disabled={loadingForm} placeholder="Type your activity title here." />
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
                                                <FormLabel className='text-xs sm:text-sm'>Activity Description</FormLabel>
                                                <FormControl>
                                                    <Textarea className='text-xs sm:text-sm'  {...field} disabled={loadingForm} placeholder="Type your description here." />
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
                                                <FormItem className='mt-auto'>
                                                    <FormLabel className='text-xs sm:text-sm'>Type</FormLabel>
                                                    <FormControl>
                                                        <Select {...field} onValueChange={field.onChange} defaultValue={field.value} disabled={loadingForm}>
                                                            <FormControl>
                                                                <SelectTrigger className='text-xs sm:text-sm'>
                                                                    <SelectValue placeholder="Select a type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {TypeData.map((option, index) => (
                                                                    <SelectItem className='text-xs sm:text-sm' key={index} value={option.value || 'default_value'} disabled={loadingForm}>{option.label}</SelectItem>
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
                                                <FormItem className='mt-auto'>
                                                    <FormLabel className='text-xs sm:text-sm'>Target Participants</FormLabel>
                                                    <FormControl>
                                                        <Input className='text-xs sm:text-sm' {...field} disabled={loadingForm} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem className='mt-auto'>
                                                    <FormLabel className='text-xs sm:text-sm'>Location</FormLabel>
                                                    <FormControl>
                                                        <Input className='text-xs sm:text-sm' {...field} disabled={loadingForm} />
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
                                                    className="text-xs sm:text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap">
                                                    All day
                                                </Label>
                                            </div>

                                            {!allDayChecked && (
                                                <FormField
                                                    control={form.control}
                                                    name="dateFrom"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='text-xs sm:text-sm'>Planned Date</FormLabel>
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
                                                        <FormLabel className='text-xs sm:text-sm'>Planned Date Range</FormLabel>
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
                                                                <FormLabel className='text-xs sm:text-sm'>Time Range</FormLabel>
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
                                                    <FormLabel className='text-xs sm:text-sm'>Status</FormLabel>
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
                                    <FormLabel className='flex flex-row gap-2 justify-between items-centers'>
                                        <div className='flex flex-row gap-2 items-center'>
                                            <label
                                                className='font-bold md:text-xl'
                                                style={participantError ? { color: '#f04d44' } : {}}
                                            >
                                                Participants {participantError && '*'}
                                            </label>

                                            <FormDescription className='items-center hidden sm:flex'>
                                                Please press the plus (+) button when adding new participant, (-) to remove
                                            </FormDescription>
                                        </div>
                                        <div className='flex flex-row gap-2 justify-end items-center'>
                                            <Badge className='flex flex-row gap-1 justify-center items-center'><MdPeopleAlt />{filteredUsersData.length}</Badge>
                                            <Select onValueChange={setFilterRegion} defaultValue={filterRegion} disabled={loadingForm}>
                                                <SelectTrigger className='text-xs sm:text-sm'>
                                                    <SelectValue placeholder="Filter" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='All'  className='text-xs sm:text-sm'>All</SelectItem>
                                                    {regionOptions.map((option, index) => (
                                                        <SelectItem  className='text-xs sm:text-sm' key={index} value={option}>{option}</SelectItem>
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
                                                name={`participants.${index}.userId`}
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
                                                                    <SelectTrigger className='text-xs sm:text-sm'>
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
                                    <FormLabel className='flex flex-row gap-2 items-centers'>
                                        <label className='font-bold md:text-xl '>Preparatory List</label>
                                        <Button type='button' size={'sm'} disabled={loadingForm} onClick={() => appendPreparatoryList({ description: '', status: '', remarks: '' })}>
                                            <FaPlus />
                                        </Button>
                                        <FormDescription className='items-center hidden sm:flex'>
                                            Please press the plus (+) button when adding new preparatory list
                                        </FormDescription>
                                    </FormLabel>
                                    {preparatoryListFields.map((field, index) => (
                                        <div key={index} className="flex flex-row gap-2 items-end w-full">
                                            <FormField
                                                control={form.control}
                                                name={`preparatoryList.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem className='w-full text-xs sm:text-sm'>
                                                        <FormControl>
                                                            <Input {...field} disabled={loadingForm} placeholder="Enter description" 
                                                            className='text-xs sm:text-sm'/>
                                                        </FormControl>
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
                                                                    <SelectTrigger className='text-xs sm:text-sm'>
                                                                        <SelectValue placeholder="Select a status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className='text-xs sm:text-sm'>
                                                                    {PreparatoryActivityStatus.map((option, index) => (
                                                                        <SelectItem className='text-xs sm:text-sm cursor-pointer' key={index} value={option.value || 'default_value'} disabled={loadingForm}>
                                                                            <Badge variant={'outline'}>{option.label}</Badge>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
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
                                    ))}
                                    <Separator />
                                    <FormField
                                        control={form.control}
                                        name="remarks"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormLabel className='text-xs sm:text-sm'>Remarks</FormLabel>
                                                <FormControl>
                                                    <Textarea className='text-xs sm:text-sm'  {...field} disabled={loadingForm} placeholder="Type your remarks here." />
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
