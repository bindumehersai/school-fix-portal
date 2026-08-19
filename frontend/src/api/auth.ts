import api from './client';
import type { AuthResponse, User } from '../types';

export const authService = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),
  register: (data: { name: string; email: string; password: string; role: string; schoolId: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
  getProfile: () => api.get<User>('/users/profile').then((r) => r.data),
  updateProfile: (data: { name?: string; schoolId?: string; password?: string }) =>
    api.put<User>('/users/profile', data).then((r) => r.data),
};
