export type Role = 'parent' | 'teacher' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  schoolId: string;
  createdAt?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: Role;
  schoolId: string;
  token: string;
}

export type IssueStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type IssueCategory = 'Furniture' | 'Electrical' | 'Plumbing' | 'Building' | 'Sanitation' | 'Playground';

export interface TimelineEntry {
  status: string;
  changedAt: string;
  note: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  location: string;
  image?: string;
  status: IssueStatus;
  assignedTo?: string;
  timeline: TimelineEntry[];
  reportedBy: { _id: string; name: string; email: string; role: Role };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  message: string;
  type: 'issue' | 'status' | 'system';
  relatedIssue?: string;
  isRead: boolean;
  createdAt: string;
}

export interface IssueInput {
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  location: string;
  image?: File;
}
