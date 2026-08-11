import api from '../lib/api';
import { RegisterDto } from '../types/auth';

export const authService = {
  register(data: RegisterDto) {
    return api.post(
      '/auth/register',
      data,
    );
  },

  login(data: {
    phoneNumber: string;
    password: string;
  }) {
    return api.post(
      '/auth/login',
      data,
    );
  },
};