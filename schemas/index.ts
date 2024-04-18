import * as z from "zod";
 
export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password:z.string().min(6, {
        message:"Password is required atleast 6 characters"
    })
})

export const RegisterSchema = z.object({
    region:z.string().min(1, {
        message:"Region is required"
    }),
    fullname: z.string().min(1, {
        message: "Fullname is required"
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    password:z.string().min(6, {
        message:"Minimum 6 characters required"
    }),

 
})

