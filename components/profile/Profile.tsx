import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useCalendarOfActivityContext } from '../context/CalendarOfActivityContext';
import { useEffect, useState } from 'react';
import { useUsers } from '../context/UsersContext';
import { Label } from '../ui/label';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { useForm } from 'react-hook-form';
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { componentOptions, regionOptions, unitOptions } from '@/lib/data/filter';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../LoadingSpinner';


interface ProfileProps {
    profileUserName: string;
    openProfileDialog: boolean
    setProfileDialogClose: () => void;
}
const Profile: React.FC<ProfileProps> = ({
    profileUserName,
    openProfileDialog,
    setProfileDialogClose
}) => {

    const [profileData, setProfileData] = useState<any[]>([])

    const { activities, error, fetchActivitiesData, loading } = useCalendarOfActivityContext()
    const { usersData } = useUsers()

    const [component4, setComponent4] = useState(true)
const [totalActivity, setTotalActivity] = useState(0)
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            region: profileData[0]?.region,
            email: profileData[0]?.email,
            component: profileData[0]?.component,
            unit: profileData[0]?.unit,
            position: profileData[0]?.position,
            fullname: profileData[0]?.name,
        }
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        console.log("values: ", values)
    }

    const avoidDefaultDomBehavior = (e: Event) => {
        e.preventDefault();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            event.stopPropagation();
        }
    };

    useEffect(() => {
        const filteredProfileData = usersData.filter(user => user.name == profileUserName)
        setProfileData(filteredProfileData)
        console.log("filteredProfileData: ", filteredProfileData)
    }, [profileUserName, usersData])

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleUnitDropDown = (allow: boolean) => {
        form.setValue('unit', '');
        setComponent4(allow);
    }

    useEffect(() => {
        const user = usersData.find(user=> user.name === profileUserName);
        if (user) {
            const userId = user.id;
            const userActivities = activities.filter(activity => 
                activity.participants.some(participant => participant.userId === userId)
            );
            setTotalActivity(userActivities.length);
        }
    }, [activities, usersData, profileUserName]);
    
    return (
        <Dialog open={openProfileDialog} onOpenChange={setProfileDialogClose}>
            <DialogContent
                onPointerDownOutside={avoidDefaultDomBehavior}
                onInteractOutside={avoidDefaultDomBehavior}
                onKeyDown={handleKeyDown}
            >
                <DialogTitle>Profile Information</DialogTitle>
                <DialogDescription>
                    {/* <div className="space-y-4">
                <Label><strong>Name:</strong> {profileData[0].name}</Label>
                <Label><strong>Email:</strong> {profileData[0].email}</Label>
                <Label><strong>Position:</strong> {profileData[0].position}</Label>
                <Label><strong>Region:</strong> {profileData[0].region}</Label>
                <Label><strong>Component:</strong> {profileData[0].component}</Label>
                <Label><strong>Unit:</strong> {profileData[0].unit}</Label>
                <Label><strong>Date Registered:</strong> {formatDate(profileData[0].createdAt)}</Label>
              </div> */}
                    <Form  {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                            autoComplete="off" >
                            <div className="space-y-4">
                                
                            <FormField
                                    control={form.control}
                                    name="fullname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex flex-row text-black dark:text-white">Name<FormMessage /></FormLabel>
                                            <FormControl>
                                                <Input
                                                    className='text-black dark:text-white'
                                                    {...field}
                                                    value={profileData[0]?.name}
                                                    readOnly={true}
                                                    disabled={loading} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex flex-row text-black dark:text-white">Email<FormMessage /></FormLabel>
                                            <FormControl>
                                                <Input
                                                    className='text-black dark:text-white'
                                                    {...field}
                                                    value={profileData[0]?.email}
                                                    readOnly={true}
                                                    disabled={loading} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                        name='region'
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex flex-row text-black dark:text-white">Region <FormMessage /></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className='text-black dark:text-white'
                                                        {...field}
                                                        value={profileData[0]?.region}
                                                        readOnly={true}
                                                        disabled={loading} />
                                                </FormControl>
                                                {/* <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a region" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {regionOptions.map((option, index)=>(
                                                <SelectItem key={index} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select> */}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name='component'
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex flex-row text-black dark:text-white">Component<FormMessage /></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className='text-black dark:text-white'
                                                        {...field}
                                                        value={profileData[0]?.component}
                                                        readOnly={true}
                                                        disabled={loading} />
                                                </FormControl>
                                                {/* <Select
                                            onValueChange={(newValue) => {
                                                field.onChange(newValue)
                                                newValue == 'Component 4' ? handleUnitDropDown(false):handleUnitDropDown(true)
                                            }}
                                            defaultValue={field.value}
                                            disabled={loading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a component" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {componentOptions.map((option, index) => (
                                                    <SelectItem key={index} value={option}>{option}</SelectItem>
                                                ))}
                                                <SelectItem key={'Component5'} value={' '} disabled={true}>Component 5</SelectItem>
                                            </SelectContent>
                                        </Select> */}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                        name='unit'
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex flex-row text-black dark:text-white">Unit<FormMessage /></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className='text-black dark:text-white'
                                                        {...field}
                                                        value={profileData[0]?.unit}
                                                        readOnly={true}
                                                        disabled={loading} />
                                                </FormControl>
                                                {/* <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={loading || component4}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a unit"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {unitOptions.map((option, index) => (
                                                    <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select> */}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex flex-row text-black dark:text-white">Position<FormMessage /></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className='text-black dark:text-white'
                                                        {...field}
                                                        value={profileData[0]?.position}
                                                        readOnly={true}
                                                        disabled={loading} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                        name='region'
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex flex-row text-black dark:text-white">Total Activities <FormMessage /></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className='text-black dark:text-white'
                                                        {...field}
                                                        value={totalActivity}
                                                        readOnly={true}
                                                        disabled={loading} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='button' className='mt-auto'>More Stats</Button>
                                </div>

                            </div>
                            {/* <Button
                                typeof="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading && <LoadingSpinner />}  Update account
                            </Button> */}
                        </form>
                    </Form>


                </DialogDescription>
                <DialogFooter>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Profile;
