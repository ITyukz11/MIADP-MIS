interface InsertNewStatusResponse {
    success?: string;
    error?: string;
}

export const insertNewStatus = async (values: any): Promise<InsertNewStatusResponse> => {
    console.log("server values: ", values);

    try {
        const response = await fetch('/api/auth/document-tracking/correspondence/incoming-route-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('MIADP:test')
            },
            body: JSON.stringify(values)
        });

        const data = await response.json();

        // Check if the response contains an error message
        if (!response.ok || data.error) {
            return { error: data.error || "An error occurred while inserting new document. Please try again later." };
        } else {
            // If no error message, assume successful registration
            return { success: data.message };
        }
    } catch (error) {
        console.error('Error inserting new document:', error);
        return { error: "An error occurred while inserting new document. Please try again later." };
    }
};
