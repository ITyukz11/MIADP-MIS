'use client'
import { useCurrentUser } from "@/components/context/CurrentUserContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EnterPasswordDialog } from "@/components/dialog/enter-password";
import { useEffect, useState } from "react";
import { updateprofile } from "@/actions/profile/updateprofile";
import { error } from "console";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { componentOptions, regionOptions, unitOptions } from "@/lib/data/filter";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ProfileDialogProps {
    open: boolean;
    setClose: () => void;
}

export function ProfileDialog({ open, setClose }: ProfileDialogProps) {
    const [enterPassDialog, setEnterPassDialog] = useState<boolean>(false)
    const [editProfile, setEditProfile] = useState<boolean>(true)
    const { currentUser } = useCurrentUser();
    const [loading, setLoading] = useState<boolean>()
    const [error, setError] = useState<string | null>(null);
    const [component4, setComponent4] = useState<boolean>(!currentUser?.component)

    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            position: currentUser?.position || '',
            unit: currentUser?.unit || '',
            component: currentUser?.component || '',
            region: currentUser?.region || ''
        },
    });

    const handleUnitDropDown = (allow: boolean) => {
        form.setValue('unit', '');
        setComponent4(allow);
    }

    const onSubmit = async (values: z.infer<typeof UserSchema>) => {
        console.log("submit profile dialog:", values);
        setLoading(true)
        setError(null);
        updateprofile(values)
            .then((data) => {
                setError(data.error || null)
                setLoading(false)

                if (!data.error) {
                    toast({
                        title: "Success",
                        description: "You have successfully updated your profile.",
                        duration: 5000,
                        action: (
                            <ToastAction altText="OK">Ok</ToastAction>
                        ),
                    })
                }

                setEditProfile(true)
                setClose()
            })
    };

    const avoidDefaultDomBehavior = (e: Event) => {
        e.preventDefault();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            event.stopPropagation();
        }
    };

    useEffect(() => {
      if(!error){
        setLoading(false)
      }
    }, [error])
    
    return (
        <>
            <Dialog open={open} onOpenChange={setClose}>
                <DialogContent className="sm:max-w-[425px]"
                    onPointerDownOutside={avoidDefaultDomBehavior}
                    onInteractOutside={avoidDefaultDomBehavior}
                    onKeyDown={handleKeyDown}
                >
                    <DialogHeader>
                        <DialogTitle>Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your account here.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full" autoComplete="off">
                            <div className="grid gap-1 pb-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <FormLabel className="text-xs sm:text-sm text-right">Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    {...field}
                                                    className="col-span-3"
                                                    disabled={editProfile || loading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <FormLabel className="text-xs sm:text-sm text-right">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    {...field}
                                                    className="col-span-3"
                                                    disabled={true}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <FormLabel className="text-xs sm:text-sm text-right">Position</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="position"
                                                    {...field}
                                                    className="col-span-3"
                                                    disabled={editProfile || loading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {currentUser?.unit  && (
                                   <FormField
                                   name='unit'
                                   control={form.control}
                                   render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                          <FormLabel className="text-xs sm:text-sm text-right">Unit<FormMessage /></FormLabel>
                                           <Select
                                               onValueChange={field.onChange}
                                               defaultValue={field.value}
                                               disabled={editProfile || loading || component4}
                                               value={field.value}
                                           >
                                               <FormControl className="col-span-3">
                                                   <SelectTrigger>
                                                       <SelectValue placeholder="Select a unit" />
                                                   </SelectTrigger>
                                               </FormControl>
                                               <SelectContent>
                                                   {unitOptions.map((option, index) => (
                                                       <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                                                   ))}
                                               </SelectContent>
                                           </Select>
                                       </FormItem>
                                   )}
                               />
                                )}
                                <FormField
                                name='component'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-xs sm:text-sm text-right">Component<FormMessage /></FormLabel>
                                        <Select
                                            onValueChange={(newValue) => {
                                                field.onChange(newValue)
                                                newValue == 'Component 4' ? handleUnitDropDown(false) : handleUnitDropDown(true)
                                            }}
                                            defaultValue={field.value}
                                            disabled={editProfile || loading}
                                            
                                        >
                                            <FormControl className="col-span-3">
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
                                        </Select>
                                    </FormItem>
                                )}
                            />
                                 <FormField
                                name='region'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-xs sm:text-sm text-right">Region <FormMessage /></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={editProfile || loading}>
                                            <FormControl className="col-span-3">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a region" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {regionOptions.map((option, index) => (
                                                    <SelectItem key={index} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            </div>
                            <DialogFooter className="flex justify-between">
                                <Label className=" text-destructive">{error}</Label> 
                                {!editProfile ?
                                    <>
                                        <Button type="submit" disabled={loading}> {loading? <LoadingSpinner/>:'Submit changes'}</Button>

                                        <Button type="button" disabled={loading} onClick={() => setEditProfile(true)} variant={'destructive'}>Cancel</Button>
                                    </>
                                    :
                                    <>
                                        <Button variant="secondary" type="button" onClick={() => setEnterPassDialog(!enterPassDialog)}>Change password</Button>
                                        <Button type="button" onClick={() => setEditProfile(false)}>Edit profile</Button>
                                    </>
                                }
                            </DialogFooter>
                        </form>
                    </Form>

                </DialogContent>
            </Dialog>
            <EnterPasswordDialog open={enterPassDialog} setClose={() => setEnterPassDialog(!enterPassDialog)} />
        </>
    );
}
