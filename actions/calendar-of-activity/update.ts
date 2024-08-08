import axios from 'axios';

interface UpdateActivityResponse {
  success?: string;
  error?: string;
}

export const updateCalendarOfActivity = async (activityId:string, activity: any): Promise<UpdateActivityResponse> => {
  try {
    const response = await axios.put('/api/auth/calendar-of-activity', {
      id: activityId,
      newData: activity
    });

    if (response.status === 200) {
      // console.log('Activity updated successfully');
      return { success: 'Activity updated successfully' };
    } else {
      console.error('Error updating calendar activity. Status:', response.status);
      return { error: 'Failed to update activity. Please try again later.' };
    }
  } catch (error) {
    console.error('Error updating calendar activity:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
};
