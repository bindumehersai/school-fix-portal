import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export const EmptyState = ({ title, message, action }: { title: string; message: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="mb-4 rounded-full bg-slate-100 p-4">
      <Inbox className="h-8 w-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
