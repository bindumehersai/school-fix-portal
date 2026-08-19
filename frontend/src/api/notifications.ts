import api from './client';
import type { Notification } from '../types';

export const notificationService = {
  list: () => api.get<Notification[]>('/notifications').then((r) => r.data),
  markRead: (id: string) => api.put<Notification>(`/notifications/${id}`).then((r) => r.data),
  markAllRead: () => api.put('/notifications/read-all').then((r) => r.data),
};
