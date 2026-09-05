import api from './client';
import type { AuthResponse, User, Role } from '../types';

export const authService = {
  login: (
    email: string,
    password: string,
    role: Role
  ) =>
    api
      .post<AuthResponse>('/auth/login', {
        email,
        password,
        role,
      })
      .then((r) => r.data),

  register: (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    schoolId: string;
  }) =>
    api
      .post<AuthResponse>('/auth/register', data)
      .then((r) => r.data),

  getProfile: () =>
    api
      .get<User>('/users/profile')
      .then((r) => r.data),

  updateProfile: (data: {
    name?: string;
    schoolId?: string;
    password?: string;
  }) =>
    api
      .put<User>('/users/profile', data)
      .then((r) => r.data),
};