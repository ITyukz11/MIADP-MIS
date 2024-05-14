import axios from 'axios';

const instance = axios.create({
  timeout: 30000, // 30 seconds in milliseconds
});

export async function fetchPendingUsers() {
  try {
    const username = 'MIADP';
    const password = 'test';
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    
    const response = await instance.get('/api/auth/pending-users', {
      headers: {
        Authorization: authHeader,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching pending users:', error);
    throw new Error('Internal Server Error');
  }
}
