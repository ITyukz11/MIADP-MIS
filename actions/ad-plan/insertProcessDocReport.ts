type ProcessDocReportPayload = {
    activityTitle: string;
    WFPActivity: string;
    activityObjectives: string;
    dateConducted: string;
    region: string;
    province: string;
    city: string;
    municipality: string;
    baranggay: string;
    totalMaleIP: string;
    totalFemaleIP: string;
    totalMaleNonIP: string;
    totalFemaleNonIP: string;

    preActivity: string;
    preOtherActivity?: string;
    preActivityDescription: string;
    preActivityOutputQty: string;
    preActivityOutputDescription: string;
    preActivityOutcome: string;
    preActivityEmergingImpact: string;

    during: string;
    duringOtherActivity?: string;
    duringDescription: string;
    duringOutputQty: string;
    duringOutputDescription: string;
    duringOutcome: string;
    duringEmergingImpact: string;

    postActivity: string;
    postOtherActivity?: string;
    postActivityDescription: string;
    postActivityOutputQty: string;
    postActivityOutputDescription: string;
    postActivityOutcome: string;
    postActivityEmergingImpact: string;

    attendanceSheet: string;
    program: string;
    photoDocumentation: string;
    participantsProfile: string;
    presentationMaterials: string;

    preparedByName: string;
    reviewedByName: string;
    notedByName: string;
};

export const submitProcessDocReport = async (data: ProcessDocReportPayload) => {
    console.log("Calling /api/auth/ad-plan/process-doc-report with:", data);
    try {
        const res = await fetch(`/api/auth/ad-plan/process-doc-report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            console.error("Server responded with non-OK:", res.status);
            throw new Error("Failed to submit report");
        }

        const responseData = await res.json();
        console.log("Response received:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error submitting report:", error);
        return { success: false, message: "Submission failed." };
    }
}

