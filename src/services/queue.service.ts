import api from '../lib/api';

export type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'NO_SHOW';

export const queueService = {
  getBarberQueue(barberId: string) {
    return api.get(`/queue/barber/${barberId}`);
  },

  getNextCustomer(barberId: string) {
    return api.get(`/queue/next/${barberId}`);
  },

  getOne(id: string) {
    return api.get(`/queue/${id}`);
  },

  updateStatus(
    id: string,
    data: { status: QueueStatus },
  ) {
    return api.patch(`/queue/${id}/status`, data);
  },
};