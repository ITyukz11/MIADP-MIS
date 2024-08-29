import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useEffect, useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { RegisterSchema } from '@/schemas';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from '@/app/store/store';
import { fetchCountActivityParticipantsData } from '@/app/store/calendar-of-activity/countActivityParticipantAction';


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
    const dispatch = useDispatch();

    const { usersData, errorUser, loadingUser } = useSelector((state) => state.users)
    const { activitiesData, activityLoading, activityError } = useSelector((state) => state.activity)
    const { countParticipantActivitiesData, countParticipantActivityLoading, countParticipantActivityError } = useSelector((state)=> state.countActivityParticipant)
    
    useEffect(() => {
        if (countParticipantActivitiesData.length === 0) {
            dispatch(fetchCountActivityParticipantsData());
        }
    }, [dispatch, countParticipantActivitiesData.length]);

    console.log("countParticipantActivitiesData: ", countParticipantActivitiesData)
    const [totalActivity, setTotalActivity] = useState<number>(0)
    const form = useForm<z.infer<any>>({
        defaultValues: {
            region: profileData[0]?.region,
            email: profileData[0]?.email,
            component: profileData[0]?.component,
            unit: profileData[0]?.unit,
            position: profileData[0]?.position,
            name: profileData[0]?.name,
            totalActivity: profileData[0]?.totalActivity,
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
        const filteredProfileData = countParticipantActivitiesData.filter(user => user.name == profileUserName)
        setProfileData(filteredProfileData)
    }, [profileUserName, countParticipantActivitiesData])
    
    useEffect(() => {
        const user = countParticipantActivitiesData.find(user => user.name === profileUserName);
            setTotalActivity(user?.totalActivities || 0);
    }, [activitiesData, usersData, profileUserName, countParticipantActivitiesData]);
    console.log("totalActivity: ",totalActivity)
    return (
        <Dialog open={openProfileDialog} onOpenChange={setProfileDialogClose}>
            <DialogContent
                onPointerDownOutside={avoidDefaultDomBehavior}
                onInteractOutside={avoidDefaultDomBehavior}
                onKeyDown={handleKeyDown}
            >
                <DialogTitle>Profile Information</DialogTitle>
                <DialogDescription>
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
                                                    disabled={activityLoading} />
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
                                                    disabled={activityLoading} />
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
                                                        disabled={activityLoading} />
                                                </FormControl>
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
                                                        disabled={activityLoading} />
                                                </FormControl>
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
                                                        disabled={activityLoading} />
                                                </FormControl>
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
                                                        disabled={activityLoading} />
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
                                                <FormLabel className="flex flex-row text-black dark:text-white">Total Participated Activities <FormMessage /></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className='text-black dark:text-white'
                                                        {...field}
                                                        value={totalActivity}
                                                        readOnly={true}/>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='button' className='mt-auto' disabled>More Stats</Button>
                                </div>
                            </div>
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