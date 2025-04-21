import { createAsyncThunk } from "@reduxjs/toolkit";
import { CountComponentActivity } from "@/types/calendar-of-activity/calendar-of-activity";

// Define the action to fetch component counts data
export const fetchComponentCountsData =
  createAsyncThunk<CountComponentActivity>(
    "components/fetchComponentCountsData",
    async () => {
      const response = await fetch("/api/activities/count-components"); // Adjust the URL to your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return (await response.json()) as CountComponentActivity;
    }
  );
