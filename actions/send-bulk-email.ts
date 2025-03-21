import axios, { AxiosError } from "axios";

interface SendBulkEmailResponse {
  success?: string;
  error?: string;
}

interface SendBulkEmailData {
  to: string[]; // Array of email addresses
  subject: string;
  text: string;
  attachment?: File | null; // Optional attachment
}

export const sendBulkEmail = async (
  values: SendBulkEmailData
): Promise<SendBulkEmailResponse> => {
  try {
    if (!values.to.length || !values.subject || !values.text) {
      return { error: "Missing required fields!" };
    }

    const formData = new FormData();
    formData.append("to", values.to.join(",")); // Convert array to a comma-separated string
    formData.append("subject", values.subject);
    formData.append("text", values.text);

    if (values.attachment) {
      formData.append("attachment", values.attachment);
    }

    const response = await axios.post("/api/send-bulk-email", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.error) {
      return { error: response.data.error };
    }

    return { success: "Bulk emails sent successfully!" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const responseData = axiosError.response.data;
        if (
          responseData &&
          typeof responseData === "object" &&
          "error" in responseData
        ) {
          return { error: responseData.error as string };
        }
      }
    }
    return { error: "Failed to send emails. Please try again later." };
  }
};
