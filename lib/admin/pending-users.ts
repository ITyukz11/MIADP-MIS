import axios from 'axios';

const instance = axios.create({
  timeout: 30000, // 30 seconds in milliseconds
});

export async function fetchPendingUsers() {
  try {
    const response = await instance.get('/api/auth/pending-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending users:', error);
    throw new Error('Internal Server Error');
  }
}
