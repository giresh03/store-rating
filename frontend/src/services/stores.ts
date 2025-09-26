import { api } from '@/config/api';
import { 
  ApiResponse, 
  PaginationResponse,
  Store, 
  StoreFilters,
  CreateStoreRequest
} from '@/types';

export const getAllStores = async (filters: StoreFilters = {}): Promise<ApiResponse<PaginationResponse<Store>>> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/stores?${params.toString()}`);
  return response.data;
};

export const getStoreById = async (id: string): Promise<ApiResponse<{ store: Store }>> => {
  const response = await api.get(`/stores/${id}`);
  return response.data;
};

export const createStore = async (storeData: CreateStoreRequest): Promise<ApiResponse<{ store: Store }>> => {
  const response = await api.post('/stores', storeData);
  return response.data;
};

export const updateStore = async (id: string, storeData: Partial<CreateStoreRequest>): Promise<ApiResponse<{ store: Store }>> => {
  const response = await api.put(`/stores/${id}`, storeData);
  return response.data;
};

export const deleteStore = async (id: string): Promise<ApiResponse> => {
  const response = await api.delete(`/stores/${id}`);
  return response.data;
};

export const getMyStores = async (): Promise<ApiResponse<{ stores: Store[] }>> => {
  const response = await api.get('/stores/owner/me');
  return response.data;
};
