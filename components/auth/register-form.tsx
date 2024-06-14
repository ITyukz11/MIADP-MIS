'use client'
import { CardWrapper } from "./card-warpper"
import { useState, useTransition } from "react";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema } from "@/schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Header } from "./header";
import { LoadingSpinner } from "../LoadingSpinner";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { pendinguser } from "@/actions/pendinguser/pendinguser";
import { componentOptions, regionOptions, unitOptions } from "@/lib/data/filter";
import { PiEyeClosedBold,PiEyeBold } from "react-icons/pi";
import { motion } from 'framer-motion';

interface RegisterFormProps {
    backToLogin: () => void
}
export const RegisterForm = ({ backToLogin }: RegisterFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false); // Initialize loading state

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const router = useRouter(); // Initialize useRouter
    const { toast } = useToast()

    const [component4, setComponent4] = useState(true)
    // Define the options for the component and unit select fields
    const [showPassword, setShowPassword] = useState(false)


    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            region: "",
            email: "",
            password: "",
            component: "",
            unit: "",
            position: "",
            fullname: "",
            color: ""
        }
    })


    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {

        setError("")
        setSuccess("")
        startTransition(() => {
            setLoading(true)
            pendinguser(values)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                    setTimeout(() => {
                        if (!data.error) {
                            toast({
                                title: "Registration",
                                description: "Please contact MMIS Team Leader for approval",
                                duration: 10000,
                                action: (
                                    <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
                                ),
                            })
                            localStorage.removeItem("pendingUsers");

                            backToLogin()
                        }
                        setLoading(false)
                    }, 2000); // Delay for 2 seconds                      
                });
        })

    }

    const handleUnitDropDown = (allow: boolean) => {
        form.setValue('unit', '');
        setComponent4(allow);
    }

    return (
        <div className="w-full justify-center flex flex-col">
            {/* <CardWrapper
                headerTitle="Sign Up"
                headerLabel="Create an account"
                backButtonLabel="Already have an account?"
                backButtonHref="/auth/login"
                loading={loading}
                showSocial> */}
            <Header label='Enter your credentials below to register' title='Sign Up' />
            <Form  {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    autoComplete="off" >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <FormField
                                name='region'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex flex-row">Region <FormMessage /></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                            <FormControl>
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
                            <FormField
                                name='component'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex flex-row">Component<FormMessage /></FormLabel>
                                        <Select
                                            onValueChange={(newValue) => {
                                                field.onChange(newValue)
                                                newValue == 'Component 4' ? handleUnitDropDown(false) : handleUnitDropDown(true)
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
                                        </Select>
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
                                        <FormLabel className="flex flex-row">Unit<FormMessage /></FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={loading || component4}
                                            value={field.value}
                                        >
                                            <FormControl>
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
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex flex-row">Position<FormMessage /></FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={loading} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex flex-row">Name<FormMessage /></FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
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
                                    <FormLabel className="flex flex-row">Email<FormMessage /></FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={loading}
                                            autoComplete="false" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel className="flex flex-row">Password<FormMessage /></FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showPassword ? 'text' : 'password'}
                                                disabled={loading} />
                                            {showPassword ? (
                                                <motion.div
                                                    key="open"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute right-3 top-[0.7rem] transform -translate-y-1/2 cursor-pointer"
                                                    onClick={() => setShowPassword(false)}
                                                >
                                                    <PiEyeBold />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="closed"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute right-3 top-[0.7rem] transform -translate-y-1/2 cursor-pointer"
                                                    onClick={() => setShowPassword(true)}
                                                >
                                                    <PiEyeClosedBold />
                                                </motion.div>
                                            )}
                                        </div>
                                    </FormControl>

                                </FormItem>
                            )}
                        />

                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button
                        typeof="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading && <LoadingSpinner />}  Create an account
                    </Button>
                </form>
            </Form>
            {/* </CardWrapper> */}
        </div>

    )
}