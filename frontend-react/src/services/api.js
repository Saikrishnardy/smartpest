const RAW_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = RAW_BASE.endsWith('/api') ? RAW_BASE : `${RAW_BASE.replace(/\/$/, '')}/api`;

class ApiService {
  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      return data;
    } catch (error) {
      console.error('API Error during login:', error);
      throw error;
    }
  }

  static async register(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || data.detail || (data.email && data.email[0]) || (data.password && data.password[0]) || 'Signup failed.'
        );
      }
      return data;
    } catch (error) {
      console.error('API Error during register:', error);
      throw error;
    }
  }
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

  static async getUsers() {
    try {
      const token = localStorage.getItem('authToken');
      console.log('ApiService.getUsers - Sending token:', token);
      const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error fetching users:', error);
      throw error;
    }
  }

  static async getFeedback() {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error fetching feedback:', error);
      throw error;
    }
  }

  static async getPesticides() {
    try {
      const response = await fetch(`${API_BASE_URL}/pesticides/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error fetching pesticides:', error);
      throw error;
    }
  }

  static async submitFeedback(feedbackData) {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error submitting feedback:', error);
      throw error;
    }
  }

  static async deleteFeedback(feedbackId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      return { message: 'Feedback deleted successfully' };
    } catch (error) {
      console.error('API Error deleting feedback:', error);
      throw error;
    }
  }

  static async updateFeedback(feedbackId, updateData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error updating feedback:', error);
      throw error;
    }
  }

  static async createPesticide(pesticideData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/pesticides/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(pesticideData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error creating pesticide:', error);
      throw error;
    }
  }

  static async updatePesticide(pesticideId, updateData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/pesticides/${pesticideId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error updating pesticide:', error);
      throw error;
    }
  }

  static async deletePesticide(pesticideId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/pesticides/${pesticideId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      return { message: 'Pesticide deleted successfully' };
    } catch (error) {
      console.error('API Error deleting pesticide:', error);
      throw error;
    }
  }

  static async getPests() {
    try {
      const response = await fetch(`${API_BASE_URL}/pests/`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error fetching pests:', error);
      throw error;
    }
  }

  static async createPest(pestData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/pests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(pestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error creating pest:', error);
      throw error;
    }
  }

  static async updatePest(pestId, updateData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/pests/${pestId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error updating pest:', error);
      throw error;
    }
  }

  static async deletePest(pestId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/pests/${pestId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      return { message: 'Pest deleted successfully' };
    } catch (error) {
      console.error('API Error deleting pest:', error);
      throw error;
    }
  }
}

export default ApiService; 