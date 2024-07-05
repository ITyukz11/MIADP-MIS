import * as z from "zod";
import axios, { AxiosError } from "axios";
import { CalendarOfActivitySchema } from "@/schemas/calendar-of-activity";

interface InsertActivityResponse {
    success?: string;
    error?: string;
}

export const calendarOfActivity = async (values: z.infer<typeof CalendarOfActivitySchema>): Promise<InsertActivityResponse> => {
    const validatedFields = CalendarOfActivitySchema.safeParse(values);
    console.log("server values: ", values)
    console.log("console.log(validatedFields.error): ", validatedFields);
    
    try {
        if (!validatedFields.success) {
            console.log(validatedFields.error); // Log the validation error
            return { error: "Invalid fields!" };
        } else {
            const response = await axios.post('/api/auth/calendar-of-activity', {
                authorizeOther: values.authorizeOther,
                individualActivity:values.individualActivity,
                WFPYear:values.WFPYear,
                activityTitle:values.activityTitle,
                activityDescription: values.activityDescription,
                type: values.type,
                targetParticipant: values.targetParticipant,
                participants:values.participants,
                location: values.location,
                dateFrom: values.dateFrom,
                dateTo: values.dateTo,
                timeStart: values.timeStart,
                timeEnd: values.timeEnd,
                allDay: values.allDay,
                status: values.status,
                color: values.color,
                remarks: values.remarks,
                preparatoryContent:values.preparatoryContent,
                preparatoryList: values.preparatoryList,
                attachments:values.attachments,
                userName:values.name
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
            return { error: "An error occurred while inserting new calendar of activity." };
        } else {
            return { error: "An error occurred while inserting new calendar of activity." };
        }
    }
};
