import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Ticket, Search, Plus, Minus } from 'lucide-react';  // Added Plus icon
import { useDispatch, useSelector } from '@/app/store/store';
import { fetchUsersData } from '@/app/store/userAction';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import FlightSearchForm from '../FlightSearchForm';
import { HiArrowLongLeft } from 'react-icons/hi2';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaLongArrowAltRight } from 'react-icons/fa';

interface RequestFormPalTicketTestProps {
    open: boolean;
    close: () => void;
}

function RequestFormPalTicketTest({ open, close }: RequestFormPalTicketTestProps) {
    const [searchTerm, setSearchTerm] = useState("");  // For search functionality
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);  // To store selected users
    const [cities, setCities] = useState<any[]>([]);  // To store cities

    const [page, setPage] = useState<number>(1)
    const dispatch = useDispatch();
    const { usersData, loadingUser, errorUser } = useSelector((state) => state.users);

    useEffect(() => {
        if (usersData.length === 0) {
            dispatch(fetchUsersData());
            setSelectedUsers([])
        }
    }, [dispatch, usersData.length]);

    useEffect(() => {
        setSelectedUsers([])
    }, [open])


    // Filtered list based on search
    const filteredUsers = usersData.filter((user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group users alphabetically
    const groupedUsers = filteredUsers.reduce((groups: any, user: any) => {
        const letter = user.name[0].toUpperCase();
        if (!groups[letter]) {
            groups[letter] = [];
        }
        groups[letter].push(user);
        return groups;
    }, {});

    // Handle user selection
    const handleUserClick = (user: any) => {
        // Check if the user is already selected
        if (selectedUsers.includes(user)) {
            setSelectedUsers((prev) => prev.filter((u) => u !== user)); // Remove user from selected list
        } else {
            setSelectedUsers((prev) => [...prev, user]); // Add user to selected list
        }
    };

    const handleBack = () =>{
        setPage(1)
    }
    // Alphabet letters for indexing
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    console.log("selected: ", selectedUsers)
    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[80%] lg:min-w-[50%] overflow-y-auto scrollbar-thin max-h-[95vh]">
                    <DialogHeader>
                        <DialogTitle className='flex flex-row items-center gap-2'>
                            <Ticket /> Request Form for PAL Ticket
                        </DialogTitle>
                        <DialogDescription>
                            *Please make sure all the details are correct before submitting!
                        </DialogDescription>
                    </DialogHeader>
                    {page === 1 ? (
                        <div>
                            {loadingUser ? (



                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-row gap-2'>
                                        <Skeleton className='w-4/5 h-16' />
                                        <Skeleton className='w-1/5 h-16' />
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <Skeleton className='w-2/5 h-16' />
                                        <Skeleton className='w-3/5 h-16' />
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <Skeleton className='w-1/5 h-16' />
                                        <Skeleton className='w-4/5 h-16' />
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <Skeleton className='w-3/5 h-16' />
                                        <Skeleton className='w-2/5 h-16' />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="relative">
                                        <Search className="absolute right-2 top-1" />
                                        <Input
                                            type="text"
                                            placeholder="Search Traveller&apos;s Name"
                                            className="w-full pr-4 text-lg"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className='flex flex-row items-center justify-between mt-2'>
                                        <div className='flex flex-row items-center gap-4'>
                                            <Label className="font-semibold text-xl">{selectedUsers.length} Traveler(s) Selected</Label>
                                            <Button variant='secondary'>
                                                View
                                            </Button>
                                        </div>
                                        <Button disabled={selectedUsers.length==0} variant='link' onClick={() => setPage(2)}>
                                            <Label className='cursor-pointer'>Continue</Label>
                                            <FaLongArrowAltRight className='w-10 h-10 cursor-pointer' />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col">
                                        {alphabet.map((letter) => (
                                            groupedUsers[letter] ? (  // Only display letters that have users
                                                <div key={letter}>
                                                    <h2 className="text-lg font-semibold">{letter}</h2>
                                                    <Separator className="my-2" />
                                                    {
                                                        groupedUsers[letter].map((user: any) => (
                                                            <div
                                                                key={user.name}
                                                                className={`flex items-center justify-between p-2 rounded-lg mb-1 ${selectedUsers.includes(user) ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                                                            >
                                                                <div className="flex items-center w-full justify-between">
                                                                    <div className='flex flex-row gap-4 items-center'>
                                                                        <div
                                                                            className={`flex justify-center items-center w-10 h-10 rounded-full ${selectedUsers.includes(user) ? 'bg-blue-500' : 'bg-gray-200'}`}  // Change background if selected
                                                                        >
                                                                            {/* Get the initials of the user's name */}
                                                                            <Label className={`text-lg font-semibold z-10 ${selectedUsers.includes(user) ? 'text-white' : 'text-black'}`}>
                                                                                {user.name
                                                                                    .split(' ') // Split the name into words
                                                                                    .map((word: string) => word[0]) // Take the first letter of each word
                                                                                    .slice(0, 2) // Limit to two letters (e.g., first and last name initials)
                                                                                    .join('')}  {/* Join them as a single string */}
                                                                            </Label>
                                                                        </div>
                                                                        <Label className={`font-medium ${selectedUsers.includes(user) ? 'text-black' : ''}`}>
                                                                            {user.name} - <Badge variant='outline' className={`hover:dark:text-black`}>{user.region}</Badge>
                                                                        </Label>
                                                                    </div>
                                                                    {selectedUsers.includes(user) ? (
                                                                        <Minus
                                                                            className='text-red-500 h-7 w-7 rounded-full cursor-pointer'
                                                                            onClick={() => handleUserClick(user)} />
                                                                    ) : (
                                                                        <Plus
                                                                            className='text-green-500 h-7 w-7 rounded-full cursor-pointer'
                                                                            onClick={() => handleUserClick(user)} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ) : null  // Skip letters without users
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div>

                            {/* You can add content here for page 2 or keep it empty */}
                            <FlightSearchForm passengerSelected={selectedUsers} back={()=> handleBack()}/>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default RequestFormPalTicketTest;
