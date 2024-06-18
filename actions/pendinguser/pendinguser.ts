import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import axios, { AxiosError } from "axios";
import bcrypt from 'bcryptjs';

interface RegisterResponse {
    success?: string;
    error?: string;
}


export const pendinguser = async (values: z.infer<typeof RegisterSchema>): Promise<RegisterResponse> => {
    const validatedFields = RegisterSchema.safeParse(values);

    try {
        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        } else {

            type ColorMapping = {
                [key: string]: string;
              };
              
              const componentColors: ColorMapping = {
                'Component 1': '#B4A7D6',
                'Component 2': '#FBBC04',
                'Component 3': '#00FF00',
                'ODPD': '#1155CC'
              };
              
              const unitColors: ColorMapping = {
                'Procurement': '#FFFF00',
                'Finance': '#E06666',
                'PMEU': '#46BDC6',
                'SES': '#B6D7A8',
                'Admin': '#EAD1DC',
                'GGU': '#783F04',
                'Economist':'#38761D',
                'Communication Advocacy':'#3D85C6',
                'Legal':'#A64D79',
                'Secretary':'#674EA7'
              };

              const regionColors: ColorMapping ={
                'PSO':'#C80000',
                'RPCO 9':'#ffc124',
                'RPCO 10':'#9117c2',
                'RPCO 11':'#0173bc',
                'RPCO 12':'#ff6f00',
                'RPCO 13':'#ff0090',
                'BARMM':'#3cb54b'
              }
              
              let color = "";
              
            //   if (values.component in componentColors) {
            //     color = componentColors[values.component];
            //   } else if (values.unit in unitColors) {
            //     color = unitColors[values.unit];
            //   }

            if(values.region in regionColors){
                color=regionColors[values.region]
            }
            
            const hashedPassword = await bcrypt.hash(values.password, 10);
            const response = await axios.post('/api/auth/pending-users', {
                region: values.region,
                fullname: values.fullname,
                email: values.email,
                component: values.component,
                unit: values.unit,
                position: values.position,
                color:color,
                // password:values.password
                password: hashedPassword
            }, {
                auth: {
                    username: 'MIADP',
                    password: 'test'
                  }
            });
    
            // Check if the response contains an error message
            if (response.data && response.data.error) {
                // If there's an error message, return it
                return { error: response.data.error };
            } else {
                // If no error message, assume successful registration
                return { success: response.data.message };
            }
        }
    } catch (error) {
        // Handle any errors from the API
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const responseData = axiosError.response.data;
                if (responseData && typeof responseData === 'object' && 'message' in responseData && typeof responseData.message === 'string') {
                    return { error: responseData.message };
                }
            }
            return { error: error.response?.data?.error === 'Email already exists' ? error.response?.data?.error : "An error occurred while registering." };
        } else {
            return { error: "An error occurred while registering." };
        }
    }
};
