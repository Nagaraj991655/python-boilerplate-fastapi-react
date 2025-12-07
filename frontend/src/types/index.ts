// API Response Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string | null;
  user_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
}

export interface PostCreate {
  title: string;
  content?: string;
}

export interface PostUpdate {
  title?: string;
  content?: string;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  admin_users: number;
  total_posts: number;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials, isAdmin?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// API Error Response
export interface APIError {
  detail: string;
}
