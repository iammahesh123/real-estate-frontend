import api from './client';
import { ApiResponse, PageResponse } from '../types';

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  roles: string[];
  createdAt?: string;
}

export const userApi = {
  getAll: async (page = 0, size = 15) => {
    const res = await api.get<ApiResponse<PageResponse<UserSummary>>>('/admin/users', {
      params: { page, size },
    });
    return res.data.data;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await api.patch<ApiResponse<UserSummary>>(`/admin/users/${id}/status`, {
      status,
    });
    return res.data.data;
  },
};
