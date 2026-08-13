export type AppointmentStatus =
  | 'CONFIRMED'
  | 'IN_QUEUE'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'NO_SHOW';

export interface AppointmentService {
  id: string;
  name: string;
  price: number;
}

export interface AppointmentBarber {
  id: string;
  fullName: string;
}

export interface AppointmentCustomer {
  id: string;
  fullName: string;
  phoneNumber: string;
}

export interface AppointmentQueue {
  id: string;
  queuePosition: number;
  status: QueueStatus;
}

export interface Appointment {
  id: string;

  customerId: string;
  barberId: string;

  appointmentDate: string;

  status: AppointmentStatus;

  totalPrice: number;

  customer?: AppointmentCustomer;
  barber?: AppointmentBarber;

  services: AppointmentService[];

  queueEntry?: AppointmentQueue | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  barberId: string;
  serviceIds: string[];
  appointmentDate: string;
  notes?: string;
}

export interface UpdateAppointmentStatusDto {
  status: AppointmentStatus;
}