export type BarberStatus =
  | 'AVAILABLE'
  | 'BUSY'
  | 'UNAVAILABLE'
  | 'VACATION';

export interface Barber {
  id: string;
  userId: string;
  status: BarberStatus;

  user: {
    id: string;
    fullName: string;
    phoneNumber?: string;
  };
}