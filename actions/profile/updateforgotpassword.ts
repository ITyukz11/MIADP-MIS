import axios, { AxiosError } from "axios";

interface ForgotPasswordResponse {
  success?: string;
  error?: string;
}

interface ForgotPassValues {
  email: string;
  newPassword?: string;
  code: string;
  verifyOnly?: boolean;
}

export const updateforgotpass = async (values: ForgotPassValues): Promise<ForgotPasswordResponse> => {
  try {
    const response = await axios.post('/api/auth/update-forgot-password', {
      email: values.email,
      code: values.code,
      newPassword: values.newPassword,
      verifyOnly: values.verifyOnly || false,
    });

    if (response.data.error) {
      return { error: response.data.error };
    } else {
      return { success: response.data.message };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === 'object' &&
        'error' in axiosError.response.data &&
        typeof axiosError.response.data.error === 'string'
      ) {
        return { error: axiosError.response.data.error };
      }
    }
    return { error: "An error occurred while changing password." };
  }
};
