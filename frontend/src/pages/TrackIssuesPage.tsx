import { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { issueService } from '../api/issues';
import type { Issue } from '../types';
import { Card } from '../components/Card';
import { Select } from '../components/Input';
import { Button } from '../components/Button';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { TableSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export default function TrackIssuesPage() {
  const { user } = useAuth();

  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selected, setSelected] = useState<Issue | null>(null);

  const load = () => {
    setIssues(null);

    issueService
      .list({
        search,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
      })
      .then((data) => {
        // Show only issues reported by the logged-in user
        const myIssues = data.filter((issue) => {
          const reporterId =
            typeof issue.reportedBy === 'string'
              ? issue.reportedBy
              : issue.reportedBy?._id;

          return reporterId === user?._id;
        });

        setIssues(myIssues);
      })
      .catch(() => setIssues([]));
  };

  useEffect(() => {
    if (!user?._id) return;

    const t = setTimeout(load, 300);

    return () => clearTimeout(t);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?._id,
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Reported Issues
        </h1>

        <p className="text-sm text-slate-500">
          Issues you have reported.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues..."
              className="input pl-10"
            />
          </div>

          {/* Status */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>

            {[
              'Pending',
              'Assigned',
              'In Progress',
              'Resolved',
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>

          {/* Priority */}
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All priorities</option>

            {[
              'Low',
              'Medium',
              'High',
              'Emergency',
            ].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>

          {/* Category */}
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All categories</option>

            {[
              'Furniture',
              'Electrical',
              'Plumbing',
              'Building',
              'Sanitation',
              'Playground',
            ].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

        </div>
      </Card>

      {/* Issues Table */}
      <Card className="p-6">

        {!issues ? (
          <TableSkeleton />

        ) : issues.length === 0 ? (

          <EmptyState
            title="No issues found"
            message="You have not reported any issues matching these filters."
            action={
              <Button
                onClick={() =>
                  window.location.assign('/report')
                }
              >
                Report Issue
              </Button>
            }
          />

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">

                  <th className="pb-3 font-medium">
                    Title
                  </th>

                  <th className="pb-3 font-medium">
                    Category
                  </th>

                  <th className="pb-3 font-medium">
                    Location
                  </th>

                  <th className="pb-3 font-medium">
                    Priority
                  </th>

                  <th className="pb-3 font-medium">
                    Status
                  </th>

                  <th className="pb-3 font-medium">
                    Date
                  </th>

                  <th className="pb-3 font-medium text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">

                {issues.map((issue) => (

                  <tr
                    key={issue._id}
                    className="hover:bg-slate-50"
                  >

                    <td className="py-3 pr-4 font-medium text-slate-800 max-w-xs truncate">
                      {issue.title}
                    </td>

                    <td className="py-3 pr-4 text-slate-600">
                      {issue.category}
                    </td>

                    <td className="py-3 pr-4 text-slate-600 max-w-[120px] truncate">
                      {issue.location}
                    </td>

                    <td className="py-3 pr-4">
                      <PriorityBadge
                        priority={issue.priority}
                      />
                    </td>

                    <td className="py-3 pr-4">
                      <StatusBadge
                        status={issue.status}
                      />
                    </td>

                    <td className="py-3 pr-4 text-slate-500">
                      {new Date(
                        issue.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="py-3 text-right">

                      <Button
                        variant="ghost"
                        onClick={() =>
                          setSelected(issue)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </Card>

      {/* Issue Details Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Issue Details"
        size="lg"
      >

        {selected && (

          <div className="space-y-5">

            {selected.image && (
              <img
                src={selected.image}
                alt={selected.title}
                className="h-48 w-full rounded-xl object-cover"
              />
            )}

            <div>

              <h3 className="text-lg font-semibold text-slate-900">
                {selected.title}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">

                <StatusBadge
                  status={selected.status}
                />

                <PriorityBadge
                  priority={selected.priority}
                />

                <span className="badge bg-slate-100 text-slate-600">
                  {selected.category}
                </span>

              </div>

            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">
                Location
              </p>

              <p className="text-sm text-slate-700">
                {selected.location}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">
                Description
              </p>

              <p className="text-sm text-slate-700">
                {selected.description}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">
                Reported by
              </p>

              <p className="text-sm text-slate-700">
                {selected.reportedBy.name} ·{' '}
                {selected.reportedBy.email}
              </p>
            </div>

            {/* Timeline */}
            <div>

              <p className="mb-3 text-xs uppercase text-slate-400">
                Timeline
              </p>

              <ol className="relative border-l border-slate-200 pl-6">

                {selected.timeline.map((t, idx) => (

                  <li
                    key={idx}
                    className="mb-4 last:mb-0"
                  >

                    <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 ring-4 ring-white" />

                    <p className="text-sm font-medium text-slate-800">
                      {t.status}
                    </p>

                    <p className="text-xs text-slate-400">
                      {new Date(
                        t.changedAt
                      ).toLocaleString()}
                    </p>

                    {t.note && (
                      <p className="text-xs text-slate-500">
                        {t.note}
                      </p>
                    )}

                  </li>

                ))}

              </ol>

            </div>

          </div>

        )}

      </Modal>

    </div>
  );
}