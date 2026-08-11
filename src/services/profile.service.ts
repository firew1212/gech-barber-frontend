import api from '../lib/api';

export interface ProfileUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: 'ADMIN' | 'BARBER' | 'CUSTOMER';
  isActive?: boolean;
}

export const profileService = {
  getProfile() {
    return api.get<ProfileUser>('/auth/profile');
  },
};