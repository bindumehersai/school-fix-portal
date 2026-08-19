import type { IssueStatus, IssuePriority } from '../types';

const statusStyles: Record<IssueStatus, string> = {
  Pending: 'bg-warning-100 text-warning-700',
  Assigned: 'bg-primary-100 text-primary-700',
  'In Progress': 'bg-accent-100 text-accent-700',
  Resolved: 'bg-success-100 text-success-700',
};

const priorityStyles: Record<IssuePriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-primary-100 text-primary-700',
  High: 'bg-warning-100 text-warning-700',
  Emergency: 'bg-error-100 text-error-700',
};

export const StatusBadge = ({ status }: { status: IssueStatus }) => (
  <span className={`badge ${statusStyles[status]}`}>{status}</span>
);

export const PriorityBadge = ({ priority }: { priority: IssuePriority }) => (
  <span className={`badge ${priorityStyles[priority]}`}>{priority}</span>
);
