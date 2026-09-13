import api from './client';
import { ApiResponse, Enquiry, Lead, PageResponse } from '../types';

export const crmApi = {
  createEnquiry: async (data: {
    propertyId?: number;
    name: string;
    email: string;
    phone: string;
    message?: string;
    source?: string;
    budget?: number;
  }) => {
    const res = await api.post<ApiResponse<Enquiry>>('/enquiries', data);
    return res.data.data;
  },

  submitEnquiry: async (data: {
    propertyId?: number;
    name: string;
    email: string;
    phone: string;
    message?: string;
    source?: string;
    budget?: number;
  }) => {
    const res = await api.post<ApiResponse<Enquiry>>('/enquiries', data);
    return res.data.data;
  },


  getMyEnquiries: async () => {
    const res = await api.get<ApiResponse<Enquiry[]>>('/enquiries/my');
    return res.data.data;
  },

  getLeads: async (status?: string, page = 0, size = 15) => {
    const res = await api.get<ApiResponse<PageResponse<Lead>>>('/leads', {
      params: { status, page, size },
    });
    return res.data.data;
  },

  getLeadById: async (id: number) => {
    const res = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data.data;
  },

  updateLeadStatus: async (id: number, data: { status: string; remarks?: string; nextFollowUp?: string }) => {
    const res = await api.patch<ApiResponse<Lead>>(`/leads/${id}/status`, data);
    return res.data.data;
  },

  addLeadNote: async (id: number, note: string) => {
    const res = await api.post(`/leads/${id}/notes`, { note });
    return res.data.data;
  },

  assignLead: async (id: number, agentId: number) => {
    const res = await api.patch<ApiResponse<Lead>>(`/admin/leads/${id}/assign`, { agentId });
    return res.data.data;
  },
};
