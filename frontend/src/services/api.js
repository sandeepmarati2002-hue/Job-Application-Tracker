/**
 * API Service Layer: Connects React to the FastAPI Backend
 * Base URL: http://127.0.0.1:8000
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Helper to retrieve auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper with clean error extraction
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);

    // If 204 No Content, return empty object
    if (response.status === 204) {
      return {};
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || data.message || `Request failed with status ${response.status}`;
      throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
}

// 1. Health & Status
export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, ...data };
  } catch {
    return { online: false };
  }
};

// 2. Authentication API Endpoints
export const authApi = {
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => request('/auth/me'),

  logout: () => {
    localStorage.removeItem('access_token');
  },
};

// 3. Applications CRUD API Endpoints
export const applicationsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    const queryString = query.toString();
    return request(`/applications${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => request(`/applications/${id}`),

  create: (data) =>
    request('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/applications/${id}`, {
      method: 'DELETE',
    }),
};

// 4. Interviews API Endpoints
export const interviewsApi = {
  create: (applicationId, interviewData) =>
    request(`/applications/${applicationId}/interviews`, {
      method: 'POST',
      body: JSON.stringify(interviewData),
    }),

  delete: (interviewId) =>
    request(`/interviews/${interviewId}`, {
      method: 'DELETE',
    }),
};

// 5. Dashboard Summary API Endpoints
export const dashboardApi = {
  getSummary: () => request('/dashboard/summary'),
};
