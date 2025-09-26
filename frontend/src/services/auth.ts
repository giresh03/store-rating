import { api } from '@/config/api';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  UpdatePasswordRequest,
  User 
} from '@/types';

export const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<ApiResponse<{ user: User }>> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updatePassword = async (passwords: UpdatePasswordRequest): Promise<ApiResponse> => {
  const response = await api.put('/auth/password', passwords);
  return response.data;
};

export const logout = async (): Promise<ApiResponse> => {
  const response = await api.post('/auth/logout');
  return response.data;
};
