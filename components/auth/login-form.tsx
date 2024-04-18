'use client'
import { CardWrapper } from "./card-warpper"
import { useState, useTransition } from "react";
import * as z from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
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


export const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [loading, setLoading] = useState(false); // Initialize loading state
    
    const router = useRouter(); // Initialize useRouter

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues:{
            email:"",
            password:"",
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
              setLoading(false); // Set loading state to false when login request completes

              if (!data.error) {
                router.push('/'); // Redirect to '/' if there's no error (login is successful)
              }

            })
            .catch((error) => {
              setError('An error occurred while logging in. Error: ' + error);
              setLoading(false); // Set loading state to false if there's an error
            });
        });


        //Pwde axios diri
        //axios.post("/your/api/router", values).then .get etc
    }

    console.log("isPending: ",isPending)
    
    return (
        <div className=" w-96">
       <CardWrapper
            headerTitle="Sign In"
            headerLabel="MIADP Management Information System"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            loading={loading}
            showSocial>
             
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            >
                <div className="space-y-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({field})=> (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                {...field}
                                placeholder="miadp@gmail.com"
                                disabled={loading}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="password"
                    render={({field})=> (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                {...field}
                                placeholder="******"
                                type="password"
                                disabled={loading}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                </div>
                <FormSuccess message={success}/>
                <FormError message={error}/>
                <Button
                    typeof="submit"
                    className="w-full"
                    disabled={loading}
                >
                    Login
                </Button>
            </form>
          </Form>
        </CardWrapper>
        </div>
 
    )
}