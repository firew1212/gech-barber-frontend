export type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'NO_SHOW';

export interface QueueEntry {
  id: string;
  barberId: string;
  customerId: string;
  appointmentId?: string;
  queuePosition: number;
  status: QueueStatus;
}