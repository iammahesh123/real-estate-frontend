import api from './client';
import {
  AdminDashboardStats,
  AgentDashboardStats,
  AgentDetail,
  AgentSummary,
  ApiResponse,
  CustomerDashboardStats,
  PageResponse,
  Project,
  PropertySummary,
  UserProfile,
} from '../types';

export const dashboardApi = {
  getAdminStats: async () => {
    const res = await api.get<ApiResponse<AdminDashboardStats>>('/dashboard/admin/stats');
    return res.data.data;
  },

  getAgentStats: async () => {
    const res = await api.get<ApiResponse<AgentDashboardStats>>('/dashboard/agent/stats');
    return res.data.data;
  },

  getCustomerStats: async () => {
    const res = await api.get<ApiResponse<CustomerDashboardStats>>('/dashboard/customer/stats');
    return res.data.data;
  },
};

export const favouriteApi = {
  getFavourites: async () => {
    const res = await api.get<ApiResponse<PropertySummary[]>>('/favourites');
    return res.data.data;
  },

  add: async (propertyId: number) => {
    const res = await api.post<ApiResponse<void>>(`/favourites/${propertyId}`);
    return res.data;
  },

  remove: async (propertyId: number) => {
    const res = await api.delete<ApiResponse<void>>(`/favourites/${propertyId}`);
    return res.data;
  },

  check: async (propertyId: number) => {
    const res = await api.get<ApiResponse<boolean>>(`/favourites/check/${propertyId}`);
    return res.data.data;
  },
};

export const agentApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<AgentSummary[]>>('/agents');
    return res.data.data;
  },

  getById: async (id: number) => {
    const res = await api.get<ApiResponse<AgentDetail>>(`/agents/${id}`);
    return res.data.data;
  },
};

export const projectApi = {
  getAll: async (status?: string, cityId?: number) => {
    const res = await api.get<ApiResponse<Project[]>>('/projects', {
      params: { status, cityId },
    });
    return res.data.data;
  },

  getById: async (id: number) => {
    const res = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data.data;
  },

  create: async (data: Record<string, unknown>) => {
    const res = await api.post<ApiResponse<Project>>('/projects', data);
    return res.data.data;
  },
};

export const userAdminApi = {
  getAllUsers: async (page = 0, size = 15) => {
    const res = await api.get<ApiResponse<PageResponse<UserProfile>>>('/admin/users', {
      params: { page, size },
    });
    return res.data.data;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await api.patch<ApiResponse<UserProfile>>(`/admin/users/${id}/status`, { status });
    return res.data.data;
  },
};
