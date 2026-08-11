import api from '../lib/api';
import type { Service } from '../types/service';

export const serviceService = {
  async getAll(): Promise<Service[]> {
    const response = await api.get<Service[]>('/services');

    return response.data;
  },
};