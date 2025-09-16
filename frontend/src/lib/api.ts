const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response: Response, skipAuthRedirect = false) => {
  if (!response.ok) {
    if (response.status === 401 && !skipAuthRedirect) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  const text = await response.text();
  if (!text) {
    return {};
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Invalid JSON response:', text);
    throw new Error('Invalid server response');
  }
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    return { data: await handleResponse(response, true) };
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return { data: await handleResponse(response) };
  }
};

export const usersApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    return { data: await handleResponse(response) };
  },

  getCurrent: async () => {
    const response = await fetch(`${API_BASE_URL}/users/current`, {
      headers: getAuthHeaders()
    });
    return { data: await handleResponse(response) };
  }
};

export const projectsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getAuthHeaders()
    });
    return { data: await handleResponse(response) };
  }
};