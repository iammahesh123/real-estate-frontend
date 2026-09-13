import api from './client';
import { Amenity, ApiResponse, City, Locality, PropertyType } from '../types';

export type { City, Locality, PropertyType, Amenity };

export const masterApi = {
  getPropertyTypes: async () => {
    const res = await api.get<ApiResponse<PropertyType[]>>('/master/property-types');
    return res.data.data;
  },

  getAmenities: async () => {
    const res = await api.get<ApiResponse<Amenity[]>>('/master/amenities');
    return res.data.data;
  },

  getCities: async (featuredOnly = false) => {
    const res = await api.get<ApiResponse<City[]>>('/master/locations/cities', {
      params: { featuredOnly },
    });
    return res.data.data;
  },

  getLocalities: async (cityId: number) => {
    const res = await api.get<ApiResponse<Locality[]>>(`/master/locations/cities/${cityId}/localities`);
    return res.data.data;
  },

  createPropertyType: async (data: { name: string; category: string; description?: string; icon?: string }) => {
    const res = await api.post<ApiResponse<PropertyType>>('/master/property-types', data);
    return res.data.data;
  },

  createAmenity: async (data: { name: string; category: string; icon?: string }) => {
    const res = await api.post<ApiResponse<Amenity>>('/master/amenities', data);
    return res.data.data;
  },
};

export const masterDataApi = masterApi;
