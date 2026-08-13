import api from '../lib/api';

// ============================================================
// TYPES
// ============================================================

export type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'NO_SHOW';

export type BarberStatus =
  | 'AVAILABLE'
  | 'BUSY'
  | 'UNAVAILABLE'
  | 'VACATION';

export type AppointmentStatus =
  | 'CONFIRMED'
  | 'IN_QUEUE'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface CreateServiceData {
  name: string;
  description?: string;
  price: number;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
}

// ============================================================
// ADMIN SERVICE
// ============================================================

export const adminService = {
  // ============================================================
  // DASHBOARD
  // ============================================================

  getDashboard() {
    return api.get('/admin/dashboard');
  },

  // ============================================================
  // USERS
  // ============================================================

  getUsers() {
    return api.get('/admin/users');
  },

  getUser(id: string) {
    return api.get(`/admin/users/${id}`);
  },

  setUserActive(
    id: string,
    isActive: boolean,
  ) {
    return api.patch(
      `/admin/users/${id}/active`,
      {
        isActive,
      },
    );
  },

  // ============================================================
  // CUSTOMERS
  // ============================================================

  getCustomers() {
    return api.get('/admin/customers');
  },

  // ============================================================
  // BARBERS
  // ============================================================

  getBarbers() {
    return api.get('/admin/barbers');
  },

  getBarber(id: string) {
    return api.get(`/admin/barbers/${id}`);
  },

  updateBarberStatus(
    id: string,
    status: BarberStatus,
  ) {
    return api.patch(
      `/barbers/${id}/status`,
      {
        status,
      },
    );
  },

  // ============================================================
  // SERVICES
  // ============================================================

  getServices() {
    return api.get('/admin/services');
  },

  createService(
    data: CreateServiceData,
  ) {
    return api.post('/services', data);
  },

  updateService(
    id: string,
    data: UpdateServiceData,
  ) {
    return api.patch(
      `/services/${id}`,
      data,
    );
  },

  deleteService(id: string) {
    return api.delete(
      `/services/${id}`,
    );
  },

  // ============================================================
  // APPOINTMENTS
  // ============================================================

  getAppointments() {
    return api.get('/admin/appointments');
  },

  updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
  ) {
    return api.patch(
      `/appointments/${id}/status`,
      {
        status,
      },
    );
  },

  // ============================================================
  // QUEUE
  // ============================================================

  getQueue() {
    return api.get('/admin/queue');
  },

  updateQueueStatus(
    id: string,
    status: QueueStatus,
  ) {
    return api.patch(
      `/queue/${id}/status`,
      {
        status,
      },
    );
  },

  // ============================================================
  // PAYMENTS
  // ============================================================

  getPayments() {
    return api.get('/admin/payments');
  },

  markPaymentAsPaid(id: string) {
    return api.patch(
      `/payments/${id}/pay`,
    );
  },

  // ============================================================
  // REVIEWS
  // ============================================================

  getReviews() {
    return api.get('/admin/reviews');
  },
};