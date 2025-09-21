const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

console.log('API_BASE_URL:', API_BASE_URL);

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
  },

  create: async (projectData: any) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ project: projectData })
    });
    return { data: await handleResponse(response) };
  }
};

export const dashboardApi = {
  getMetrics: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
      headers: getAuthHeaders()
    });
    return { data: await handleResponse(response) };
  },

  getUserActivity: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/user_activity`, {
      headers: getAuthHeaders()
    });
    return { data: await handleResponse(response) };
  },

  getTrends: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/trends`, {
      headers: getAuthHeaders()
    });
    return { data: await handleResponse(response) };
  }
};

export const invitationsApi = {
  create: async (invitationData: any) => {
    const response = await fetch(`${API_BASE_URL}/user_invitations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(invitationData)
    });
    return { data: await handleResponse(response) };
  }
};

export const notificationsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders()
    });
    return { data: await handleResponse(response) };
  },

  markAsRead: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return { data: await handleResponse(response) };
  }
};

export const profileApi = {
  changePassword: async (passwordData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/change_password`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });
    return { data: await handleResponse(response) };
  }
};