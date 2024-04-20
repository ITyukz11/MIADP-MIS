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
import { pendinguser } from "@/actions/pendinguser";

interface RegisterFormProps{
    backToLogin: ()=> void
}
export const RegisterForm = ({backToLogin}:RegisterFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false); // Initialize loading state

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const router = useRouter(); // Initialize useRouter
    const { toast } = useToast()
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            region:"",
            email: "",
            password: "",
            fullname: "",
            
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
                                    duration:10000,
                                    action: (
                                      <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
                                    ),
                                  })
                                  backToLogin()
                            }
                            setLoading(false)
                          }, 2000); // Delay for 2 seconds                      
                    });
            })
        
    }

    return (
        <div className=" w-96">
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
                        <FormField
                    name='region'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Region</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a region" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="PSO">Project Support Office (PSO)</SelectItem>
                                    <SelectItem value="Region IX">Zamboanga Peninsula (Region IX)</SelectItem>
                                    <SelectItem value="Region X">Northern Mindanao (Region X)</SelectItem>
                                    <SelectItem value="Region XI">Davao Region (Region XI)</SelectItem>
                                    <SelectItem value="Region XII">SOCCSKSARGEN (Region XII)</SelectItem>
                                    <SelectItem value="Region XIII">Caraga (Region XIII)</SelectItem>
                                    <SelectItem value="BARMM">Bangsamoro Autonomous Region of Muslim Mindanao (BARMM)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                        <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fullname</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={loading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={loading}
                                                autoComplete="false"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                disabled={loading} />
                                        </FormControl>
                                        <FormMessage />
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
                          {loading&&<LoadingSpinner/>}  Create an account
                        </Button>
                    </form>
                </Form>
            {/* </CardWrapper> */}
        </div>

    )
}