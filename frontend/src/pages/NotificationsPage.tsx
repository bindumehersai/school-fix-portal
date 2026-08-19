import { useEffect, useState } from 'react';
import { Bell, CheckCheck, AlertCircle, Info, FileText } from 'lucide-react';
import { notificationService } from '../api/notifications';
import type { Notification } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[] | null>(null);

  const load = () => {
    setNotifications(null);
    notificationService.list().then(setNotifications).catch(() => setNotifications([]));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifications((n) => n?.map((x) => (x._id === id ? { ...x, isRead: true } : x)) || null);
    } catch (e) {
      toast((e as { message: string }).message, 'error');
    }
  };

  const markAll = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((n) => n?.map((x) => ({ ...x, isRead: true })) || null);
      toast('All notifications marked as read', 'success');
    } catch (e) {
      toast((e as { message: string }).message, 'error');
    }
  };

  const icons = { issue: FileText, status: AlertCircle, system: Info };
  const colors = { issue: 'bg-primary-100 text-primary-600', status: 'bg-warning-100 text-warning-600', system: 'bg-slate-100 text-slate-600' };

  const unread = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">{unread} unread notification{unread === 1 ? '' : 's'}</p>
        </div>
        {unread > 0 && <Button variant="secondary" onClick={markAll}><CheckCheck className="h-4 w-4" /> Mark all read</Button>}
      </div>

      <Card className="p-6">
        {!notifications ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : notifications.length === 0 ? (
          <EmptyState title="No notifications" message="You're all caught up. New notifications will appear here." />
        ) : (
          <ul className="divide-y divide-slate-50">
            {notifications.map((n) => {
              const Icon = icons[n.type];
              return (
                <li key={n._id} className={`flex items-start gap-4 py-4 ${!n.isRead ? 'bg-primary-50/40' : ''} -mx-2 rounded-xl px-2`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[n.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${n.isRead ? 'text-slate-600' : 'font-semibold text-slate-900'}`}>{n.message}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && (
                    <button onClick={() => markRead(n._id)} className="shrink-0 text-xs font-medium text-primary-600 hover:text-primary-700">
                      Mark read
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
