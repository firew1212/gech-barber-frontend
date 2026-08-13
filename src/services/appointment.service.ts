import api from '../lib/api';

export interface CreateAppointmentPayload {
  barberId: string;
  serviceIds: string[];
  appointmentDate: string;
  notes?: string;
}

export type AppointmentStatus =
  | 'CONFIRMED'
  | 'IN_QUEUE'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface UpdateAppointmentStatusPayload {
  status: AppointmentStatus;
}

export const appointmentService = {
  create(payload: CreateAppointmentPayload) {
    return api.post('/appointments', payload);
  },

  getMyAppointments() {
    return api.get('/appointments/my');
  },

  getAll() {
    return api.get('/appointments');
  },

  getOne(id: string) {
    return api.get(`/appointments/${id}`);
  },

  updateStatus(
    id: string,
    payload: UpdateAppointmentStatusPayload,
  ) {
    return api.patch(
      `/appointments/${id}/status`,
      payload,
    );
  },

  cancel(id: string) {
    return api.patch(
      `/appointments/${id}/cancel`,
    );
  },
};