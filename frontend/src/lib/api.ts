import axios from 'axios';
import { TestCase, Ticket, TestRun, DashboardMetrics, Document as DocumentType, AutomationScript, Label, Activity, TrendData, Project } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => api.post<Project>('/projects', { project: data }),
  update: (id: number, data: Partial<Project>) => api.patch<Project>(`/projects/${id}`, { project: data }),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const testCasesApi = {
  getAll: (params?: any) => api.get<{ test_cases: TestCase[]; meta: any }>('/test_cases', { params }),
  getById: (id: number) => api.get<{ test_case: TestCase }>(`/test_cases/${id}`),
  create: (data: Partial<TestCase>) => api.post<{ test_case: TestCase }>('/test_cases', { test_case: data }),
  update: (id: number, data: Partial<TestCase>) => api.patch<{ test_case: TestCase }>(`/test_cases/${id}`, { test_case: data }),
  delete: (id: number) => api.delete(`/test_cases/${id}`),
};

export const ticketsApi = {
  getAll: (params?: any) => api.get<{ tickets: Ticket[]; meta: any }>('/tickets', { params }),
  getById: (id: number) => api.get<{ ticket: Ticket }>(`/tickets/${id}`),
  create: (data: Partial<Ticket>) => api.post<{ ticket: Ticket }>('/tickets', { ticket: data }),
  update: (id: number, data: Partial<Ticket>) => api.patch<{ ticket: Ticket }>(`/tickets/${id}`, { ticket: data }),
  delete: (id: number) => api.delete(`/tickets/${id}`),
};

export const testRunsApi = {
  getAll: (params?: any) => api.get<{ test_runs: TestRun[]; meta: any }>('/test_runs', { params }),
  create: (data: Partial<TestRun>) => api.post<{ test_run: TestRun }>('/test_runs', { test_run: data }),
  update: (id: number, data: Partial<TestRun>) => api.patch<{ test_run: TestRun }>(`/test_runs/${id}`, { test_run: data }),
};

export const dashboardApi = {
  getMetrics: () => api.get<DashboardMetrics>('/dashboard/metrics'),
  getRecentActivity: () => api.get<{ activities: Activity[] }>('/dashboard/recent_activity'),
  getTrends: () => api.get<{ pass_fail_trend: TrendData[]; ticket_trend: TrendData[] }>('/dashboard/trends'),
};

export const commentsApi = {
  getForTestCase: (testCaseId: number) => api.get<{ comments: Comment[] }>(`/test_cases/${testCaseId}/comments`),
  getForTicket: (ticketId: number) => api.get<{ comments: Comment[] }>(`/tickets/${ticketId}/comments`),
  create: (type: 'test_case' | 'ticket', id: number, data: { content: string }) => 
    api.post<{ comment: Comment }>(`/${type}s/${id}/comments`, { comment: data }),
  update: (type: 'test_case' | 'ticket', id: number, commentId: number, data: { content: string }) => 
    api.patch<{ comment: Comment }>(`/${type}s/${id}/comments/${commentId}`, { comment: data }),
  delete: (type: 'test_case' | 'ticket', id: number, commentId: number) => 
    api.delete(`/${type}s/${id}/comments/${commentId}`),
};

export const documentsApi = {
  getAll: (params?: any) => api.get<{ documents: DocumentType[]; meta: any }>('/documents', { params }),
  getById: (id: number) => api.get<{ document: DocumentType }>(`/documents/${id}`),
  create: (data: FormData) => api.post<{ document: DocumentType }>('/documents', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: number, data: FormData) => api.patch<{ document: DocumentType }>(`/documents/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: number) => api.delete(`/documents/${id}`),
  download: (id: number) => api.get(`/documents/${id}/download`),
};

export const automationScriptsApi = {
  getAll: (params?: any) => api.get<{ automation_scripts: AutomationScript[]; meta: any }>('/automation_scripts', { params }),
  getById: (id: number) => api.get<{ automation_script: AutomationScript }>(`/automation_scripts/${id}`),
  create: (data: FormData) => api.post<{ automation_script: AutomationScript }>('/automation_scripts', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: number, data: FormData) => api.patch<{ automation_script: AutomationScript }>(`/automation_scripts/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: number) => api.delete(`/automation_scripts/${id}`),
  execute: (id: number) => api.post(`/automation_scripts/${id}/execute`),
};

export const labelsApi = {
  getAll: () => api.get<{ labels: Label[] }>('/labels'),
  getById: (id: number) => api.get<{ label: Label }>(`/labels/${id}`),
  create: (data: Partial<Label>) => api.post<{ label: Label }>('/labels', { label: data }),
  update: (id: number, data: Partial<Label>) => api.patch<{ label: Label }>(`/labels/${id}`, { label: data }),
  delete: (id: number) => api.delete(`/labels/${id}`),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', { user: data }),
  update: (id: number, data: any) => api.patch(`/users/${id}`, { user: data }),
  delete: (id: number) => api.delete(`/users/${id}`),
};

const AUTH_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const authApi = {
  login: (email: string, password: string) => 
    axios.post(`${AUTH_BASE_URL}/auth/login`, { email, password }),
  register: (userData: any) => 
    axios.post(`${AUTH_BASE_URL}/auth/register`, userData),
  logout: () => api.delete('/auth/logout'),
};

export default api;
