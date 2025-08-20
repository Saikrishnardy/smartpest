const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  static async detectPest(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async getPestInfo(pestName) {
    try {
      const response = await fetch(`${API_BASE_URL}/pest-info/${pestName}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async getReports() {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error fetching reports:', error);
      throw error;
    }
  }

  static async saveReport(reportData) {
    try {
      const response = await fetch(`${API_BASE_URL}/save-report/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default ApiService; 