import * as z from "zod";
import axios, { AxiosError } from "axios";

interface RegisterResponse {
    success?: string;
    error?: string;
}

export const verifyemail = async (values:any): Promise<RegisterResponse> => {
    // console.log("values: ",values)

    try {
            const response = await axios.post('/api/verify-email', {
                email:values.email,
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
            return { error: "An error occurred while changing password." };
        } else {
            return { error: "An error occurred while changing password." };
        }
    }
};
