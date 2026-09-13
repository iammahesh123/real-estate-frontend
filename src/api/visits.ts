import api from './client';
import { ApiResponse, SiteVisit } from '../types';

export const visitsApi = {
  schedule: async (data: { propertyId: number; scheduledDate: string; scheduledTime: string; notes?: string }) => {
    const res = await api.post<ApiResponse<SiteVisit>>('/visits', data);
    return res.data.data;
  },

  getMyVisits: async () => {
    const res = await api.get<ApiResponse<SiteVisit[]>>('/visits/my');
    return res.data.data;
  },

  getAgentVisits: async () => {
    const res = await api.get<ApiResponse<SiteVisit[]>>('/visits/agent');
    return res.data.data;
  },

  updateStatus: async (id: number, data: { status: string; rescheduledDate?: string; rescheduledTime?: string; notes?: string }) => {
    const res = await api.patch<ApiResponse<SiteVisit>>(`/visits/${id}/status`, data);
    return res.data.data;
  },
};
