import * as z from "zod";
import axios, { AxiosError } from "axios";
import { CalendarOfActivitySchema } from "@/schemas/calendar-of-activity";
import { GenerateCodeSchema } from "@/schemas/forms/generatecode";

interface InsertSubProjectCodeResponse {
    success?: string;
    error?: string;
}

export const insertSubProjectCode = async (values: z.infer<typeof GenerateCodeSchema>): Promise<InsertSubProjectCodeResponse> => {
    const validatedFields = GenerateCodeSchema.safeParse(values);
    // console.log("server values: ", values)
    // console.log("console.log(validatedFields.error): ", validatedFields);
    
    try {
        if (!validatedFields.success) {
            console.log(validatedFields.error); // Log the validation error
            return { error: "Invalid fields!" };
        } else {
            const response = await axios.post('/api/subproject', {
               values
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
            return { error: "An error occurred while inserting new subproject code." };
        } else {
            return { error: "An error occurred while inserting new subproject code." };
        }
    }
};
