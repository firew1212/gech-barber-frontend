import api from '../lib/api';
import type { Barber } from '../types/barber';

export const barberService = {
  async getAll(): Promise<Barber[]> {
    const response = await api.get<Barber[]>('/barbers');

    return response.data;
  },
};