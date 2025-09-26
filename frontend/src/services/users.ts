import { api } from '@/config/api';
import { 
  ApiResponse, 
  PaginationResponse,
  User, 
  UserFilters,
  CreateUserRequest,
  DashboardStats
} from '@/types';

export const getAllUsers = async (filters: UserFilters = {}): Promise<ApiResponse<PaginationResponse<User>>> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/users?${params.toString()}`);
  return response.data;
};

export const getUserById = async (id: string): Promise<ApiResponse<{ user: User }>> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: CreateUserRequest): Promise<ApiResponse<{ user: User }>> => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: Partial<CreateUserRequest>): Promise<ApiResponse<{ user: User }>> => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<ApiResponse> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getDashboardStats = async (): Promise<ApiResponse<{ stats: DashboardStats }>> => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};
