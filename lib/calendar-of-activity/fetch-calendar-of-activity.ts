import axios from 'axios';

const instance = axios.create({
  timeout: 30000, // 30 seconds in milliseconds
});

export async function fetchCalendarOfActivity() {
  try {
    const response = await instance.get('/api/auth/calendar-of-activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching calendar-of-activity:', error);
    throw new Error('Internal Server Error');
  }
}
