import api from './client';
import { ApiResponse, PageResponse } from '../types';

export interface ProjectDetail {
  id: number;
  name: string;
  slug: string;
  description?: string;
  developerName: string;
  developerLogoUrl?: string;
  status: string;
  startDate?: string;
  completionDate?: string;
  totalTowers?: number;
  totalUnits?: number;
  reraNumber?: string;
  bannerImageUrl?: string;
  brochureUrl?: string;
  city?: {
    id: number;
    name: string;
  };
  locality?: {
    id: number;
    name: string;
  };
}

export const projectApi = {
  getAll: async (page = 0, size = 12, cityId?: number) => {
    const res = await api.get<ApiResponse<PageResponse<ProjectDetail>>>('/projects', {
      params: { page, size, cityId },
    });
    return res.data.data;
  },

  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<ProjectDetail>>(`/projects/${slug}`);
    return res.data.data;
  },

  create: async (data: Partial<ProjectDetail>) => {
    const res = await api.post<ApiResponse<ProjectDetail>>('/projects', data);
    return res.data.data;
  },
};
