import api from '../lib/api';

export type PaymentType =
  | 'FULL'
  | 'PARTIAL';

export type PaymentMethod =
  | 'TELEBIRR'
  | 'BANK_TRANSFER';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED';

export interface CreatePaymentData {
  appointmentId: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: string | number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt?: string;
  appointment?: {
    id: string;
    appointmentDate: string;
    totalAmount: string | number;
    status: string;
  };
}

export const paymentService = {
  create(data: CreatePaymentData) {
    return api.post<Payment>('/payments', data);
  },

  getOne(id: string) {
    return api.get<Payment>(`/payments/${id}`);
  },
};