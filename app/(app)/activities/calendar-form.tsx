'use client'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { ActivitySchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import React, { useState, useTransition } from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { FaCalendar } from 'react-icons/fa'
import { z } from 'zod'
import { DatePicker } from 'antd';
import { TimePicker } from 'antd';
import dayjs from 'dayjs'



type Props = {}

const CalendarForm = (props: Props) => {
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false); // Initialize loading state

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [fromTimeValue, setFromTimeValue] = useState('10:00');
    const [toTimeValue, setToTimeValue] = useState('10:00');

    const [allDayChecked, setAllDayChecked] = useState(false)

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2022, 0, 20), 20),
    })

    const { RangePicker } = DatePicker;

    const dateFormat = 'MM/DD/YYYY';

    const form = useForm<z.infer<typeof ActivitySchema>>({
        resolver: zodResolver(ActivitySchema),
        defaultValues: {
            activityDescription: '',
            type: '',
            plannedFromDate: null,
            plannedToDate: null,
            targetParticipants: '',
            location: '', // optional field, can be omitted if you don't want a default value
            status: 'new', // default value specified in the schema
            remarks:'',
            user: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof ActivitySchema>) => {
        console.log("values: ", values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="activityDescription"
                        render={({ field }) => (
                            <FormItem>
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
                            name="targetParticipants"
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
                    <div className='flex flex-row gap-2'>
                        <div className='flex flex-row items-center justify-start gap-1 mt-5'>
                            <Checkbox checked={allDayChecked} onClick={() => setAllDayChecked(!allDayChecked)} />
                            <label
                                htmlFor="allday"
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap">
                                All day
                            </label>
                        </div>
                        {allDayChecked ?
                         <FormField
                         control={form.control}
                         name="plannedFromDate"
                         render={({ field }) => (
                             <FormItem className='flex flex-col w-full'>
                                 <FormLabel>Planned Date Range</FormLabel>
                                 <RangePicker
                                defaultValue={[dayjs('01/01/2024', dateFormat), dayjs('01/01/2024', dateFormat)]}
                                format={dateFormat}
                            />
                                 <FormMessage />
                             </FormItem>
                         )}
                     />
                          
                            :
                            <div className='flex flex-row gap-2'>
                                <FormField
                                    control={form.control}
                                    name="plannedFromDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Planned Date Range</FormLabel>
                                            <DatePicker className='w-full' />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="plannedFromDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time Range</FormLabel>

                                            <TimePicker.RangePicker />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        }
                    </div>
                    <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                            <FormItem>
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
                <Button typeof="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    )
}

export default CalendarForm
