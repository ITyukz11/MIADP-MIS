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
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from '@/app/store/store';


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

    const { usersData, errorUser, loadingUser } = useSelector((state) => state.users)
    const { activitiesData, activityLoading, activityError } = useSelector((state) => state.activity)

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
        // console.log("filteredProfileData: ", filteredProfileData)
    }, [profileUserName, usersData])

    useEffect(() => {
        const user = usersData.find(user => user.name === profileUserName);
        if (user) {
            const userId = user.id;
            const userActivities = activitiesData.filter(activity =>
                activity.participants.some(participant => participant.userId === userId)
            );
            setTotalActivity(userActivities.length);
        }
    }, [activitiesData, usersData, profileUserName]);

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
                                                <FormLabel className="flex flex-row text-black dark:text-white">Total Activities <FormMessage /></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className='text-black dark:text-white'
                                                        {...field}
                                                        value={totalActivity}
                                                        readOnly={true}
                                                        disabled={activityLoading} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='button' className='mt-auto'>More Stats</Button>
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