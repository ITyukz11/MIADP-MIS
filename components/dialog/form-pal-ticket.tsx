import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingSpinner } from '../LoadingSpinner';
import { PalTicket } from '@/schemas/forms/palticket';
import FormFieldWrapper from '../FormFieldWrapper';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Separator } from '../ui/separator';
import { Ticket, User, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { Badge } from '../ui/badge';
import { IoAirplane } from 'react-icons/io5';
import { Label } from '../ui/label';
import { FaArrowLeftLong } from 'react-icons/fa6';

interface RequestFormPalTicketProps {
    open: boolean;
    close: () => void;
}

function RequestFormPalTicket({ open, close }: RequestFormPalTicketProps) {
    const [loading, setLoading] = useState(false);
    const [numPassengers, setNumPassengers] = useState(1); // Default to 1 passenger

    const form = useForm<z.infer<typeof PalTicket>>({
        resolver: zodResolver(PalTicket),
        defaultValues: {
            passengerDetails: [{ firstName: "", surName: "", birthDate: "", emailAddress: "", mobileNo: "" }],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "passengerDetails",
    });

    useEffect(() => {
        form.reset()
    }, [form, open])


    // Handle passenger count input
    const handleNumPassengersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let num = parseInt(event.target.value, 10);

        // Limit to two digits
        if (num > 99) {
            num = 99;
        }

        if (num >= 1) {
            setNumPassengers(num);
            const currentPassengerCount = fields.length;

            if (num > currentPassengerCount) {
                for (let i = currentPassengerCount; i < num; i++) {
                    append({ firstName: "", surName: "", birthDate: "", emailAddress: "", mobileNo: "", mabuhayMiles: "" });
                }
            } else if (num < currentPassengerCount) {
                for (let i = currentPassengerCount; i > num; i--) {
                    remove(i - 1);
                }
            }
        }
    };

    const onSubmit = async (values: z.infer<typeof PalTicket>) => {
        console.log(values); // Submit the form values
        setLoading(true);
        // Add your form submission logic here (e.g., API call)
        setLoading(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[80%] md:min-w-[40%] overflow-y-auto scrollbar-thin max-h-[95vh]">
                    <DialogHeader>
                        <DialogTitle className='flex flex-row items-center gap-2'>

                            <Ticket /> Request Form for PAL Ticket</DialogTitle>
                        <DialogDescription>
                            *Please make sure all the details are correct before submitting!
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                            <div className="space-y-4">
                                {/* Number of Passengers Input */}


                                {/* Dynamic Passenger Details */}

                                <h2 className="font-semibold flex flex-row gap-2 items-center">
                                    <Users /> Number of Passengers
                                    <Input
                                        placeholder='#'
                                        className="appearance-none w-fit"
                                        type='number'
                                        onChange={handleNumPassengersChange}
                                        max={99}  // Set max value for UI
                                    />

                                </h2>
                                {/* Flight Details Section */}
                                <Card>
                                    <CardHeader>
                                        <h3 className="font-semibold border-b flex flex-row items-center gap-2">
                                            <IoAirplane /> Flight Details
                                        </h3>
                                    </CardHeader>
                                    <CardContent className='grid grid-cols-2 gap-4'>
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="dateOfDeparture"
                                            label="Date of Departure"
                                            placeholder="Select Departure Date"
                                            type="date"
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="dateOfReturn"
                                            label="Date of Return"
                                            placeholder="Select Return Date"
                                            type="date"
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="itineraryRoute"
                                            label="Itinerary Route"
                                            placeholder="Enter Itinerary Route"
                                            type="text"
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="itineraryRoute2"
                                            label="Return Itinerary Route"
                                            placeholder="Enter Return Itinerary Route"
                                            type="text"
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="preferredFlightTime"
                                            label="Preferred Flight Time"
                                            placeholder="Enter Flight Time"
                                            type="text"
                                            note='(Ex. 8:00am - 10:00am)'
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="preferredFlightTime2"
                                            label="Preferred Return Flight Time"
                                            placeholder="Enter Return Flight Time"
                                            type="text"
                                            note='(Ex. 6:00pm - 9:00pm)'
                                        />
                                           <FormFieldWrapper
                                            control={form.control}
                                            name="price"
                                            label="Price"
                                            placeholder="Enter Price"
                                            type="text"
                                        />
                                           <FormFieldWrapper
                                            control={form.control}
                                            name="cabin"
                                            label="Cabin"
                                            placeholder="Enter Cabin Type"
                                            type="text"
                                        />
                                    </CardContent>

                                </Card>
                                <Separator />
                                {fields.map((field, index) => (
                                    <Card key={field.id}>
                                        <CardHeader>
                                            <div className="border-b pb-1 flex flex-row justify-between items-center gap-2">
                                                <div className='flex flex-row gap-2'>
                                                    <User />
                                                    <Label className='font-semibold text-lg'>
                                                        Passenger
                                                    </Label>
                                                </div>
                                                <Badge className='text-xl'># {index + 1}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-2 gap-4">
                                            <FormFieldWrapper
                                                control={form.control}
                                                name={`passengerDetails.${index}.firstName`}
                                                label="First Name"
                                                placeholder="Enter First Name"
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                name={`passengerDetails.${index}.surName`}
                                                label="Surname"
                                                placeholder="Enter Surname"
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                name={`passengerDetails.${index}.birthDate`}
                                                label="Birth Date"
                                                placeholder="Select Birth Date"
                                                type="date"
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                name={`passengerDetails.${index}.emailAddress`}
                                                label="Email Address"
                                                placeholder="Enter Email Address"
                                                type="email"
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                name={`passengerDetails.${index}.mobileNo`}
                                                label="Mobile No"
                                                placeholder="Enter Mobile Number"
                                                type="text"
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                name={`passengerDetails.${index}.mabuhayMiles`}
                                                label="Mabuhay Miles"
                                                placeholder="Enter Mabuhay Miles"
                                                type="text"
                                                isOptional
                                            />
                                        </CardContent>
                                    </Card>
                                ))}



                            </div>

                            <div className="flex flex-row justify-end">
                                <Button
                                    className="mr-1"
                                    variant={'destructive'}
                                    disabled={loading}
                                    onClick={close}
                                    type="button"
                                >
                                    {loading && <LoadingSpinner />} Cancel
                                </Button>
                                <Button
                                    disabled={loading}
                                    type="submit"
                                >
                                    {loading && <LoadingSpinner />} Submit!
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default RequestFormPalTicket;
