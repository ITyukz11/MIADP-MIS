import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Separator } from './ui/separator';
import FormFieldWrapper from './FormFieldWrapper';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from './ui/badge';
import { Calendar } from "lucide-react";
import { FaMinus, FaPlus } from 'react-icons/fa';
import { Form, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Card, CardContent } from './ui/card';

interface FlightSearchFormProps {
    passengerSelected: any;
    back: () => void
}

// Define your Zod schema
const FlightSchema = z.object({
    tripType: z.string(),
    flights: z.array(z.object({
        departingFrom: z.object({
            value: z.string(),
        }),
        goingTo: z.object({
            value: z.string(),
        }),
        departureDate: z.object({
            value: z.string(),
        }),
    })),
    freqFlyerProgram: z.object({
        value: z.string(),
    }),
    freqFlyerNum: z.object({
        value: z.string(),
    }),
    cabin: z.object({
        value: z.string(),
    }),
});

const FlightSearchForm = ({ passengerSelected, back }: FlightSearchFormProps) => {
    const [tripType, setTripType] = useState("Return");
    const [date, setDate] = useState<any>();
    const [flightNumber, setFlightNumber] = useState<number>(1);
    const [cities, setCities] = useState<any[]>([]);  // To store cities

    const form = useForm({
        resolver: zodResolver(FlightSchema),
        defaultValues: {
            tripType: '',
            flights: Array.from({ length: flightNumber }, () => ({
                departingFrom: { value: '' },
                goingTo: { value: '' },
                departureDate: { value: '' },
                returnDate: { value: '' },
            })),
            freqFlyerProgram: { value: '' },
            freqFlyerNum: { value: '' },
            cabin: { value: '' },
        },
    });

    // Fetch city data from the API
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("https://psgc.gitlab.io/api/cities");
                const result = await response.json();  // Parse JSON response
                setCities(result);  // Store cities in state
            } catch (error) {
                console.log('Error fetching cities:', error);
            }
        };
        fetchCities();  // Call function to fetch cities
    }, []);

    console.log("cities: ", cities)
    const { control, handleSubmit } = form;

    const onSubmit = (data: any) => {
        console.log(data);
    };

    const handleAddFlight = () => {
        setFlightNumber(flightNumber + 1);
        form.setValue("flights", [
            ...form.getValues("flights"),
            {
                departingFrom: { value: '' },
                goingTo: { value: '' },
                departureDate: { value: '' },
                returnDate: { value: '' }
            },
        ]);
    };

    const handleRemoveFlight = () => {
        if (flightNumber > 1) {
            setFlightNumber(flightNumber - 1);
            const updatedFlights = form.getValues("flights").slice(0, -1);
            form.setValue("flights", updatedFlights);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <Button variant={'link'} className='p-0 flex flex-row gap-2' type='button' onClick={back}>
                    <FaArrowLeftLong className='w-5 h-5 cursor-pointer' />
                    <Label className='cursor-pointer'>Back</Label>
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="default" className="flex flex-row justify-end items-center">
                            <div className='flex flex-row gap-2'>
                                <span>{passengerSelected?.length || 0} Passenger(s) Selected</span>
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                        <ScrollArea className="h-fit max-h-64">
                            {passengerSelected && passengerSelected.length > 0 ? (
                                <ul className="space-y-1">
                                    {passengerSelected.map((passenger: any, index: number) => (
                                        <li key={index} className="text-sm text-gray-700">
                                            {passenger.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No passengers selected.</p>
                            )}
                        </ScrollArea>
                    </PopoverContent>
                </Popover>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className='flex flex-row gap-1 items-end justify-between'>
                        <FormField
                            control={control}
                            name="tripType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trip Type</FormLabel>
                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="flex space-x-4 mb-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Return" id="return" />
                                            <FormLabel htmlFor="return">Return</FormLabel>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="OneWay" id="one-way" />
                                            <FormLabel htmlFor="one-way">One Way</FormLabel>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="MultiCity" id="multi-city" />
                                            <FormLabel htmlFor="multi-city">Multi City</FormLabel>
                                        </div>
                                    </RadioGroup>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch("tripType") === 'MultiCity' &&
                            <div className='flex flex-row justify-end gap-2'>
                                <Button type='button' variant={'destructive'} disabled={flightNumber === 1} size={'sm'} className='gap-1' onClick={handleRemoveFlight}>
                                    <FaMinus /> Remove Flight
                                </Button>
                                <Badge>{flightNumber}</Badge>
                                <Button type='button' className="bg-green-700 dark:text-white gap-1 hover:bg-green-700 hover:dark:text-white hover:opacity-90" size={'sm'} onClick={handleAddFlight}>
                                    <FaPlus /> Add Flight
                                </Button>
                            </div>
                        }
                    </div>

                    {Array.from({ length: flightNumber }).map((_, index) => (
                        <Card key={index}>
                            <CardContent className="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                                <FormFieldWrapper
                                    control={control}
                                    name={`flights.${index}.departingFrom`}
                                    label={`Departing From`}
                                    placeholder="Select City"
                                    type="select"
                                    selectOptions={cities.map((city) => ({
                                        label: city.name,
                                        value: city.name,
                                    }))}
                                />
                                <FormFieldWrapper
                                    control={control}
                                    name={`flights.${index}.goingTo`}
                                    label={`Going To`}
                                    placeholder="Select City"
                                    type="select"
                                    selectOptions={cities.map((city) => ({
                                        label: city.name,
                                        value: city.name,
                                    }))}
                                />
                                <FormFieldWrapper
                                    control={control}
                                    name={`flights.${index}.departureDate`}
                                    label={`Departure Date`}
                                    placeholder="Select Date"
                                    type="date" // Change to appropriate type if necessary
                                />
                                <FormFieldWrapper
                                    control={control}
                                    name={`flights.${index}.returnDate`}
                                    label={`Return Date`}
                                    placeholder="Select Date"
                                    type="date" // Change to appropriate type if necessary
                                />
                            </CardContent>
                        </Card>
                    ))}
                    <Card>
                    <CardContent className='pt-4 grid grid-cols-3 gap-2'>
                        <FormFieldWrapper
                            control={control}
                            name="cabin"
                            label="Cabin"
                            placeholder="Select Cabin"
                            type="select"
                            selectOptions={[
                                { value: 'economy', label: 'Economy' },
                                { value: 'business', label: 'Business' },
                                { value: 'first', label: 'First Class' },
                            ]}
                        />
                        <FormFieldWrapper
                            control={control}
                            isOptional
                            name="freqFlyerProgram.value"
                            label="Frequent Flyer Program"
                            placeholder="Select Program"
                            type="select"
                            selectOptions={[
                                { value: 'None', label: 'None' },
                                { value: 'PAL Mabuhay Miles', label: 'PAL Mabuhay Miles' },
                            ]}
                        />
                        <FormFieldWrapper
                            control={control}
                            isOptional
                            name="freqFlyerNum"
                            label="Frequent Flyer Number"
                            placeholder="#"
                            type="number"
                        />
                    </CardContent>
                    </Card>
                    <Button className="w-full" type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default FlightSearchForm;
