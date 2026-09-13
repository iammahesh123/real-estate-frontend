import api from './client';
import { ApiResponse, PageResponse, PropertyDetail, PropertySummary } from '../types';

export interface PropertySearchParams {
  keyword?: string;
  city?: string;
  cityId?: number;
  propertyType?: string;
  propertyTypeId?: number;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: string;
  possessionStatus?: string;
  amenityIds?: number[];
  featured?: boolean;
  page?: number;
  size?: number;
  sortDirection?: string;
  sortBy?: string;
}

export const propertyApi = {
  search: async (params: PropertySearchParams = {}) => {
    const res = await api.get<ApiResponse<PageResponse<PropertySummary>>>('/properties', {
      params: {
        ...params,
        amenityIds: params.amenityIds ? params.amenityIds.join(',') : undefined,
      },
    });
    return res.data.data;
  },

  getFeatured: async () => {
    const res = await api.get<ApiResponse<PropertySummary[]>>('/properties/featured');
    return res.data.data;
  },

  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<PropertyDetail>>(`/properties/${slug}`);
    return res.data.data;
  },

  getById: async (id: number) => {
    const res = await api.get<ApiResponse<PropertyDetail>>(`/properties/id/${id}`);
    return res.data.data;
  },

  getMyProperties: async (page = 0, size = 10) => {
    const res = await api.get<ApiResponse<PageResponse<PropertySummary>>>('/properties/my-properties', {
      params: { page, size },
    });
    return res.data.data;
  },

  create: async (data: Record<string, unknown>) => {
    const res = await api.post<ApiResponse<PropertyDetail>>('/properties', data);
    return res.data.data;
  },

  update: async (id: number, data: Record<string, unknown>) => {
    const res = await api.put<ApiResponse<PropertyDetail>>(`/properties/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<void>>(`/properties/${id}`);
    return res.data;
  },

  uploadMedia: async (propertyId: number, file: File, isPrimary = false, altText = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', 'IMAGE');
    formData.append('isPrimary', String(isPrimary));
    formData.append('altText', altText);

    const res = await api.post(`/properties/${propertyId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  getPendingApprovals: async (page = 0, size = 10) => {
    const res = await api.get<ApiResponse<PageResponse<PropertySummary>>>('/admin/properties/pending', {
      params: { page, size },
    });
    return res.data.data;
  },

  approveOrReject: async (id: number, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) => {
    const res = await api.patch<ApiResponse<PropertyDetail>>(`/admin/properties/${id}/approval`, {
      status,
      rejectionReason,
    });
    return res.data.data;
  },
};
