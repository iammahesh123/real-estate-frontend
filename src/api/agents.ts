import api from './client';
import { ApiResponse, PageResponse } from '../types';

export interface AgentProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  agencyName?: string;
  licenseNumber?: string;
  bio?: string;
  profileImageUrl?: string;
  experienceYears?: number;
  specialization?: string;
  activeListingsCount?: number;
  totalDealsClosed?: number;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
}

export const agentApi = {
  getAll: async (page = 0, size = 12) => {
    const res = await api.get<ApiResponse<PageResponse<AgentProfile>>>('/agents', {
      params: { page, size },
    });
    return res.data.data;
  },

  getById: async (id: number) => {
    const res = await api.get<ApiResponse<AgentProfile>>(`/agents/${id}`);
    return res.data.data;
  },

  getCurrentAgentProfile: async () => {
    const res = await api.get<ApiResponse<AgentProfile>>('/agents/me');
    return res.data.data;
  },

  updateCurrentAgentProfile: async (data: Partial<AgentProfile>) => {
    const res = await api.put<ApiResponse<AgentProfile>>('/agents/me', data);
    return res.data.data;
  },
};
