import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import axios, { AxiosError } from "axios";

interface RegisterResponse {
    success?: string;
    error?: string;
}

export const register = async (values: z.infer<typeof RegisterSchema>): Promise<RegisterResponse> => {
    const validatedFields = RegisterSchema.safeParse(values);

    try {
        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        } else {
            const response = await axios.post('/api/auth/register', {
                fullname: values.fullname,
                email: values.email,
                password: values.password
            });
    
            // Check if the response contains an error message
            if (response.data.error) {
                // If there's an error message, return it
                return { error: response.data.error };
            } else {
                // If no error message, assume successful registration
                return { success: response.data.message };
            }
        }
    }
    catch (error) {
        // Handle any errors from the API
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const responseData = axiosError.response.data;
                if (responseData && typeof responseData === 'object' && 'message' in responseData && typeof responseData.message === 'string') {
                    return { error: responseData.message };
                }
            }
            return { error: "An error occurred while registering." };
        } else {
            return { error: "An error occurred while registering." };
        }
    }
};
