import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  User,
  Post,
  TokenResponse,
  LoginCredentials,
  RegisterData,
  UserUpdate,
  PostCreate,
  PostUpdate,
  DashboardStats,
  APIError,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post<TokenResponse>(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token, refresh_token: newRefreshToken } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleAPIError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as APIError;
    return apiError?.detail || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await axios.post<TokenResponse>(
      `${API_BASE_URL}/auth/login`,
      formData,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    return response.data;
  },

  adminLogin: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await axios.post<TokenResponse>(
      `${API_BASE_URL}/auth/admin/login`,
      formData,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await axios.post<User>(`${API_BASE_URL}/users/register`, data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await axios.post<TokenResponse>(
      `${API_BASE_URL}/auth/refresh`,
      { refresh_token: refreshToken }
    );
    return response.data;
  },
};

// User API
export const userAPI = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await axios.post<User>(`${API_BASE_URL}/users/register`, data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: UserUpdate): Promise<User> => {
    const response = await apiClient.put<User>('/users/profile', data);
    return response.data;
  },

  deleteProfile: async (): Promise<void> => {
    await apiClient.delete('/users/profile');
  },
};

// Post API
export const postAPI = {
  createPost: async (data: PostCreate): Promise<Post> => {
    const response = await apiClient.post<Post>('/users/posts', data);
    return response.data;
  },

  getPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/users/posts');
    return response.data;
  },

  getPost: async (id: number): Promise<Post> => {
    const response = await apiClient.get<Post>(`/users/posts/${id}`);
    return response.data;
  },

  updatePost: async (id: number, data: PostUpdate): Promise<Post> => {
    const response = await apiClient.put<Post>(`/users/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/posts/${id}`);
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/admin/dashboard');
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/admin/users');
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id: number, role: 'user' | 'admin'): Promise<User> => {
    const response = await apiClient.put<User>(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  activateUser: async (id: number): Promise<User> => {
    const response = await apiClient.put<User>(`/admin/users/${id}/activate`);
    return response.data;
  },

  deactivateUser: async (id: number): Promise<User> => {
    const response = await apiClient.put<User>(`/admin/users/${id}/deactivate`);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  getAllPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/admin/posts');
    return response.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/posts/${id}`);
  },
};

export default apiClient;
