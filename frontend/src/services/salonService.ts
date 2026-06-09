import axios from 'axios';
import type { Salon, SalonMutateRequest, PageResponse } from '../types/salon';

const API_BASE_URL = 'http://localhost:8080/salons';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const salonService = {
    
    // Fetch paginated list of salons
    getSalons: async (page = 0, size = 20): Promise<PageResponse<Salon>> => {
        const response = await apiClient.get<PageResponse<Salon>>('', {
            params: {
                page: page,
                size: size,
                sort: 'id,asc'
            }
        });
        return response.data;
    },

    // Fetch a single salon by ID
    getSalonById: async (id: number): Promise<Salon> => {
        const response = await apiClient.get<Salon>(`/${id}`);
        return response.data;
    },

    // Create a new salon
    createSalon: async (salonData: SalonMutateRequest): Promise<Salon> => {
        const response = await apiClient.post<Salon>('', salonData);
        return response.data;
    },

    // Update an existing salon
    updateSalon: async (id: number, salonData: SalonMutateRequest): Promise<Salon> => {
        const response = await apiClient.put<Salon>(`/${id}`, salonData);
        return response.data;
    },

    // Delete a salon
    deleteSalon: async (id: number): Promise<void> => {
        await apiClient.delete(`/${id}`);
    }
};

export default salonService;