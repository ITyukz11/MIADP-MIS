import * as z from "zod";
import axios, { AxiosError } from "axios";
import { CorrespondenceIncomingSchema } from "@/schemas/document-tracking/correspondence";

interface InsertIncomingRouteResponse {
    success?: string;
    error?: string;
}

export const newIncomingRoute = async (values: z.infer<typeof CorrespondenceIncomingSchema>): Promise<InsertIncomingRouteResponse> => {
    const validatedFields = CorrespondenceIncomingSchema.safeParse(values);
    console.log("server values: ", values)
    // console.log("console.log(validatedFields.error): ", validatedFields);
    
    try {
        if (!validatedFields.success) {
            console.log(validatedFields.error); // Log the validation error
            return { error: "Invalid fields!" };
        } else {

            const response = await axios.post('/api/auth/document-tracking/correspondence/incoming-route', {
                ...values,
                },{
                    auth: {
                        username: 'MIADP',
                        password: 'test'
                      }
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
            return { error: "An error occurred while inserting new document. Please try again later." };
        } else {
            return { error: "An error occurred while inserting new document. Please try again later." };
        }
    }
};
