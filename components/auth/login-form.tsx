'use client'
import { useState, useTransition } from "react";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { Header } from "./header";
import { FcGoogle } from "react-icons/fc";
import { LoadingSpinner } from "../LoadingSpinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";



export const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [loading, setLoading] = useState(false); // Initialize loading state

    const [isChecked, setIsChecked] = useState(false);
    const router = useRouter(); // Initialize useRouter

    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })


    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError('');
        setSuccess('');
        setLoading(true); // Set loading state to true

        startTransition(() => {
            setLoading(true)
            login(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);

                    if (!data.error) {
                        router.push('/'); // Redirect to '/' if there's no error (login is successful)
                    }
                    setLoading(false);

                    // if (!data.error) {
                    //     setTimeout(() => {
                    //         if (!data.error) {
                    //             router.push('/'); // Redirect to '/' if there's no error (login is successful)
                    //         }
                    //     }, 2000); // Delay for 2 seconds    

                    // } else {
                    //     setLoading(false);

                    // }
                })
                .catch((error) => {
                    setError('An error occurred while logging in. Error: ' + error);
                    setLoading(false); // Set loading state to false if there's an error
                });
        });


        //Pwde axios diri
        //axios.post("/your/api/router", values).then .get etc
    }


    return (
        <div className="flex flex-col gap-2 w-full justify-center items-center">
            {/* <CardWrapper
            headerTitle="Sign In"
            headerLabel="MIADP Management Information System"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            loading={loading}
            showSocial> */}

            <Header label='Enter your email below to login' title='Sign In' />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 w-full"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showPassword?'text':'password'}
                                                disabled={loading}
                                                className="pr-10" // Add padding to the right to make space for the icon
                                            />
                                            {showPassword?
                                             <FaEye 
                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                             onClick={()=> setShowPassword(false)} />:
                                            <FaEyeSlash 
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                            onClick={()=> setShowPassword(true)} /> }
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember-password" checked={isChecked} onClick={() => setIsChecked(!isChecked)} disabled={loading} />
                        <label
                            htmlFor="remember-password" // this matches the ID of the associated checkbox
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Remember password
                        </label>
                    </div>
                    {/* <FormSuccess message={success} /> */}
                    <FormError message={error} />
                    <Button
                        typeof="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading? <LoadingSpinner />:'Login'} 
                    </Button>
                </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" className=" hover:cursor-not-allowed w-full">
                <FcGoogle className=" h-96 mr-2" /> Google
            </Button>
            {/* </CardWrapper> */}
        </div>

    )
}