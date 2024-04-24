import * as z from "zod";
import { WFPActivitySchema, WFPActivityFinancialMonthSchema, WFPActivityPhysicalMonthSchema } from "@/schemas";
import axios, { AxiosError } from "axios";

interface WPFActivityResponse {
    success?: string;
    error?: string;
}


// Define a union schema combining both schemas
const combinedSchema = z.union([WFPActivitySchema, WFPActivityPhysicalMonthSchema,WFPActivityFinancialMonthSchema]);

export const WFPActivityAction = async (values: z.infer<typeof combinedSchema>): Promise<WPFActivityResponse> => {
    const validatedFields = combinedSchema.safeParse(values);
    
// Define the properties for wfpActivityData
const wfpActivityData = {
    activityIdNumber: (values as any).activityIdNumber || "", // Using 'any' to assert type
    typeOfActivity: (values as any).typeOfActivity || "",
    operatingUnit: (values as any).operatingUnit || "",
    componentsUnits: (values as any).componentsUnits || "",
    budgetYear: (values as any).budgetYear || "",
    activities: (values as any).activities || "",
    costTabMajorActivity: (values as any).costTabMajorActivity || "",
    costTabSubActivity: (values as any).costTabSubActivity || "",
    unitOfMeasure: (values as any).unitOfMeasure || "",
    physicalTarget: (values as any).physicalTarget || "",
    financialTotal: (values as any).financialTotal || "",
    loanProceed: (values as any).loanProceed || "",
    gopCounterpart: (values as any).gopCounterpart || "",
    budgetLine: (values as any).budgetLine || "",
    UACSCode: (values as any).UACSCode || ""
};

// Define the properties for wfpActivityMonths
const wfpActivityPhysicalMonths = {
    physicalJan: (values as any).physicalJan || "", // Using 'any' to assert type
    physicalFeb: (values as any).physicalFeb || "",
    physicalMar: (values as any).physicalMar || "",
    physicalApr: (values as any).physicalApr || "",
    physicalMay: (values as any).physicalMay || "",
    physicalJun: (values as any).physicalJun || "",
    physicalJul: (values as any).physicalJul || "",
    physicalAug: (values as any).physicalAug || "",
    physicalSep: (values as any).physicalSep || "",
    physicalOct: (values as any).physicalOct || "",
    physicalNov: (values as any).physicalNov || "",
    physicalDec: (values as any).physicalDec || "",
};

const wfpActivityFinancialMonths = {
    financialJan: (values as any).financialJan || "",
    financialFeb: (values as any).financialFeb || "",
    financialMar: (values as any).financialMar || "",
    financialApr: (values as any).financialApr || "",
    financialMay: (values as any).financialMay || "",
    financialJun: (values as any).financialJun || "",
    financialJul: (values as any).financialJul || "",
    financialAug: (values as any).financialAug || "",
    financialSep: (values as any).financialSep || "",
    financialOct: (values as any).financialOct || "",
    financialNov: (values as any).financialNov || "",
    financialDec: (values as any).financialDec || ""
};





    try {
        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        } else {
            const response = await axios.post('/api/auth/wpf', {
                wfpActivityData: wfpActivityData,
                wfpActivityPhysicalMonths: wfpActivityPhysicalMonths,
                wfpActivityFinancialMonths: wfpActivityFinancialMonths
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
