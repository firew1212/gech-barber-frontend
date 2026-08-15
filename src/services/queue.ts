import  api  from '../lib/api';

import type { QueueEntry } from '../types/queue';

export const queueService = {
  getBarberQueue(barberId: string) {
    return api<QueueEntry[]>(
      `/queue/barber/${barberId}`,
    );
  },

  getOne(id: string) {
    return api<QueueEntry>(
      `/queue/${id}`,
    );
  },

  getNextCustomer(barberId: string) {
    return api<QueueEntry>(
      `/queue/barber/${barberId}/next`,
    );
  },
};