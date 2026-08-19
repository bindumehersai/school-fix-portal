import { useEffect, useState } from 'react';
import { Search, Trash2, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Wrench } from 'lucide-react';
import { issueService } from '../api/issues';
import { notificationService } from '../api/notifications';
import type { Issue, IssueStatus, IssuePriority } from '../types';
import { Card } from '../components/Card';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { TableSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';

const STATUSES: IssueStatus[] = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

export default function AdminPanelPage() {
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [editing, setEditing] = useState<Issue | null>(null);
  const [editStatus, setEditStatus] = useState<IssueStatus>('Pending');
  const [editAssigned, setEditAssigned] = useState('');
  const [editPriority, setEditPriority] = useState<IssuePriority>('Low');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setIssues(null);
    issueService.list({ search, status: statusFilter, priority: priorityFilter }).then(setIssues).catch(() => setIssues([]));
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, priorityFilter]);

  const openEdit = (issue: Issue) => {
    setEditing(issue);
    setEditStatus(issue.status);
    setEditAssigned(issue.assignedTo || '');
    setEditPriority(issue.priority);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const updated = await issueService.update(editing._id, { status: editStatus, assignedTo: editAssigned, priority: editPriority });
      setIssues((arr) => arr?.map((i) => (i._id === updated._id ? updated : i)) || null);
      toast('Issue updated', 'success');
      setEditing(null);
    } catch (e) {
      toast((e as { message: string }).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeIssue = async (id: string) => {
    if (!confirm('Delete this issue permanently?')) return;
    try {
      await issueService.remove(id);
      setIssues((arr) => arr?.filter((i) => i._id !== id) || null);
      toast('Issue deleted', 'success');
    } catch (e) {
      toast((e as { message: string }).message, 'error');
    }
  };

  const total = issues?.length || 0;
  const pending = issues?.filter((i) => i.status === 'Pending').length || 0;
  const resolved = issues?.filter((i) => i.status === 'Resolved').length || 0;
  const high = issues?.filter((i) => i.priority === 'High' || i.priority === 'Emergency').length || 0;

  const stats = [
    { label: 'Total Issues', value: total, icon: ShieldCheck, color: 'bg-primary-600' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-warning-500' },
    { label: 'Resolved', value: resolved, icon: CheckCircle2, color: 'bg-success-500' },
    { label: 'High Priority', value: high, icon: AlertTriangle, color: 'bg-error-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-sm text-slate-500">Manage all facility issues, assign staff, and update statuses.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${s.color}`}><Icon className="h-5 w-5" /></div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search all issues..." className="input pl-10" />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All priorities</option>
            {['Low', 'Medium', 'High', 'Emergency'].map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6">
        {!issues ? (
          <TableSkeleton />
        ) : issues.length === 0 ? (
          <EmptyState title="No issues found" message="No issues match the current filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Reporter</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Assigned</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {issues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-slate-50">
                    <td className="py-3 pr-4 font-medium text-slate-800 max-w-xs truncate">{issue.title}</td>
                    <td className="py-3 pr-4 text-slate-600">{issue.reportedBy.name}</td>
                    <td className="py-3 pr-4"><PriorityBadge priority={issue.priority} /></td>
                    <td className="py-3 pr-4"><StatusBadge status={issue.status} /></td>
                    <td className="py-3 pr-4 text-slate-600 max-w-[120px] truncate">{issue.assignedTo || '—'}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" onClick={() => openEdit(issue)}><Wrench className="h-4 w-4" /></Button>
                        <Button variant="ghost" onClick={() => removeIssue(issue._id)}><Trash2 className="h-4 w-4 text-error-600" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Manage Issue">
        {editing && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">{editing.title}</p>
              <p className="text-xs text-slate-500">{editing.category} · {editing.location}</p>
            </div>
            <Select label="Status" value={editStatus} onChange={(e) => setEditStatus(e.target.value as IssueStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select label="Priority" value={editPriority} onChange={(e) => setEditPriority(e.target.value as IssuePriority)}>
              {['Low', 'Medium', 'High', 'Emergency'].map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Input label="Assigned to (staff name)" value={editAssigned} onChange={(e) => setEditAssigned(e.target.value)} placeholder="e.g. Maintenance Team" />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={saveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
