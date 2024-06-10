import axios from 'axios';

const instance = axios.create({
  timeout: 30000, // 30 seconds in milliseconds
});

export async function fetchAllUsers() {
  try {
    const response = await instance.get('/api/auth/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching pcalendar-of-activity:', error);
    throw new Error('Internal Server Error');
  }
}
