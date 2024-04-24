import axios from 'axios';

const instance = axios.create({
  timeout: 30000, // 30 seconds in milliseconds
});

export async function fetchWPFActivityData() {
  try {
    const response = await instance.get('/api/auth/wpf');
    return response.data;
  } catch (error) {
    console.error('Error fetching WPF Activity Datas:', error);
    throw new Error('Internal Server Error');
  }
}


