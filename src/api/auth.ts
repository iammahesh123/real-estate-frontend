import api from './client';
import { ApiResponse, AuthResponse, UserProfile } from '../types';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data.data;
  },

  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    agencyName?: string;
    licenseNumber?: string;
    city?: string;
  }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  logout: async (refreshToken: string) => {
    const res = await api.post<ApiResponse<void>>('/auth/logout', { refreshToken });
    return res.data;
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<UserProfile>>('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: { firstName: string; lastName: string; phone?: string; profileImage?: string }) => {
    const res = await api.put<ApiResponse<UserProfile>>('/users/profile', data);
    return res.data.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.put<ApiResponse<void>>('/users/change-password', data);
    return res.data;
  },
};
