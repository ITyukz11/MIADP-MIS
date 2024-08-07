import axios from 'axios';

const instance = axios.create({
  timeout: 30000, // 30 seconds in milliseconds
});

export async function countActivities() {
  try {
    const response = await instance.get('/api/activities/count-activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching /api/activities/count-activities:', error);
    throw new Error('Internal Server Error');
  }
}
