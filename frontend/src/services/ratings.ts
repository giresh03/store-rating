import { api } from '@/config/api';
import { 
  ApiResponse, 
  Rating, 
  RatingRequest
} from '@/types';

export const createOrUpdateRating = async (ratingData: RatingRequest): Promise<ApiResponse<{ rating: Rating }>> => {
  const response = await api.post('/ratings', ratingData);
  return response.data;
};

export const getMyRatings = async (): Promise<ApiResponse<{ ratings: Rating[] }>> => {
  const response = await api.get('/ratings/me');
  return response.data;
};

export const getStoreRatings = async (storeId: string): Promise<ApiResponse<{ ratings: Rating[] }>> => {
  const response = await api.get(`/ratings/store/${storeId}`);
  return response.data;
};

export const getRatingStats = async (storeId: string): Promise<ApiResponse<{ stats: any }>> => {
  const response = await api.get(`/ratings/store/${storeId}/stats`);
  return response.data;
};

export const deleteRating = async (storeId: string): Promise<ApiResponse> => {
  const response = await api.delete(`/ratings/store/${storeId}`);
  return response.data;
};
