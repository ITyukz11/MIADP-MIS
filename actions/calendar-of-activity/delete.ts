import axios from 'axios';

interface DeleteResponse {
  success?: string;
  error?: string;
}

export const deleteCalendarOfActivity = async (activityDataIds: string[]): Promise<DeleteResponse> => {
  try {
    const response = await axios.delete('/api/auth/calendar-of-activity', {
      data: { id: activityDataIds }
    });

    if (response.status === 200) {
      // console.log('Activities deleted successfully');
      return { success: response.data.message || 'Activities deleted successfully' };
    } else {
      console.error('Error deleting calendar activities. Status:', response.status);
      return { error: 'Failed to delete activities. Please try again later.' };
    }
  } catch (error) {
    console.error('Error deleting calendar activities:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
};
