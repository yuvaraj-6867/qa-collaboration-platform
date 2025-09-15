const API_BASE_URL = 'http://localhost:3001/api/v1';

export const authDebug = {
  checkAuthStatus: async () => {
    const token = localStorage.getItem('token');
    console.log('🔍 Auth Debug - Token from localStorage:', token ? 'Present' : 'Missing');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/debug/status`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      const data = await response.json();
      console.log('🔍 Auth Debug - Server response:', data);
      return data;
    } catch (error) {
      console.error('🔍 Auth Debug - Error:', error);
      return { error: 'Network error' };
    }
  },

  getTestToken: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/debug/test_token`);
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('🔍 Auth Debug - Test token set:', data);
      }
      
      return data;
    } catch (error) {
      console.error('🔍 Auth Debug - Error getting test token:', error);
      return { error: 'Network error' };
    }
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🔍 Auth Debug - Auth data cleared');
  }
};

// Add to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).authDebug = authDebug;
}