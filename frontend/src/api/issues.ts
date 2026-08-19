import api from './client';
import type { Issue, IssueInput, IssueStatus, IssuePriority } from '../types';

export const issueService = {
  list: (params?: { status?: string; priority?: string; category?: string; search?: string }) =>
    api.get<Issue[]>('/issues', { params }).then((r) => r.data),
  get: (id: string) => api.get<Issue>(`/issues/${id}`).then((r) => r.data),
  create: (data: IssueInput) => {
    const fd = new FormData();
    fd.append('title', data.title);
    fd.append('description', data.description);
    fd.append('category', data.category);
    fd.append('priority', data.priority);
    fd.append('location', data.location);
    if (data.image) fd.append('image', data.image);
    return api.post<Issue>('/issues', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  },
  update: (id: string, data: { status?: IssueStatus; assignedTo?: string; priority?: IssuePriority; title?: string; description?: string }) =>
    api.put<Issue>(`/issues/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/issues/${id}`).then((r) => r.data),
};
