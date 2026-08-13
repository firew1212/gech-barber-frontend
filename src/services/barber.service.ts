import api from '../lib/api';

export const barberService = {
  getAll() {
    return api.get('/barbers');
  },

  getOne(id: string) {
    return api.get(`/barbers/${id}`);
  },

  updateStatus(
    id: string,
    status: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'VACATION',
  ) {
    return api.patch(`/barbers/${id}/status`, {
      status,
    });
  },
};