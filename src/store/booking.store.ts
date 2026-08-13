import { create } from 'zustand';

interface BookingStore {
  serviceIds: string[];
  barberId: string;
  date: string;

  setServices: (ids: string[]) => void;
  setBarber: (id: string) => void;
  setDate: (date: string) => void;

  clear: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  serviceIds: [],
  barberId: '',
  date: '',

  setServices: (ids) =>
    set({
      serviceIds: ids,
    }),

  setBarber: (id) =>
    set({
      barberId: id,
    }),

  setDate: (date) =>
    set({
      date,
    }),

  clear: () =>
    set({
      serviceIds: [],
      barberId: '',
      date: '',
    }),
}));