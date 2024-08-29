export async function fetchDocumentsData() {
    try {
      // Base64 encode the credentials
      const username = 'MIADP';
      const password = 'test';
      const credentials = btoa(`${username}:${password}`);
  
      // Perform the fetch request
      const response = await fetch('/api/auth/document-tracking/correspondence', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching documents data:', errorData);
        throw new Error(errorData.error || 'Internal Server Error');
      }
  
      // Return the JSON data from the response
      const data = await response.json();
      return data.documents;
  
    } catch (error) {
      console.error('Error fetching documents data:', error);
      throw new Error('Internal Server Error');
    }
  }
  