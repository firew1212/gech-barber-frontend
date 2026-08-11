import api from '../lib/api';

export interface CreateAppointmentPayload {
  barberId: string;
  serviceIds: string[];
  appointmentDate: string;
  notes?: string;
}

export interface UpdateAppointmentStatusPayload {
  status:
    | 'PENDING'
    | 'IN_QUEUE'
    | 'IN_SERVICE'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';
}

export const appointmentService = {
  /**
   * Customer creates a new appointment.
   */
  create(payload: CreateAppointmentPayload) {
    return api.post('/appointments', payload);
  },

  /**
   * Customer gets their own appointments.
   */
  getMyAppointments() {
    return api.get('/appointments/my');
  },

  /**
   * Admin / Barber gets all appointments.
   */
  getAll() {
    return api.get('/appointments');
  },

  /**
   * Admin / Barber gets one appointment.
   */
  getOne(id: string) {
    return api.get(`/appointments/${id}`);
  },

  /**
   * Admin / Barber updates appointment status.
   */
  updateStatus(
    id: string,
    payload: UpdateAppointmentStatusPayload,
  ) {
    return api.patch(
      `/appointments/${id}/status`,
      payload,
    );
  },

  /**
   * Customer cancels their appointment.
   */
  cancel(id: string) {
    return api.patch(
      `/appointments/${id}/cancel`,
    );
  },
};