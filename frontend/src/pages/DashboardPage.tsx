import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  AlertTriangle,
  FileText,
  Clock,
  UserCheck,
  Wrench,
  CheckCircle2,
  FilePlus,
  ListChecks,
} from 'lucide-react';

import { issueService } from '../api/issues';
import type { Issue, IssueStatus } from '../types';
import { Card } from '../components/Card';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { CardSkeleton, TableSkeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS: Record<IssueStatus, string> = {
  Pending: '#f59e0b',
  Assigned: '#3b82f6',
  'In Progress': '#06b6d4',
  Resolved: '#22c55e',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [issues, setIssues] = useState<Issue[] | null>(null);

  useEffect(() => {
    // Dashboard should display ALL reported issues
    issueService
      .list()
      .then(setIssues)
      .catch(() => setIssues([]));
  }, []);

  if (!issues) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        <Card className="p-6">
          <TableSkeleton />
        </Card>
      </div>
    );
  }

  const total = issues.length;

  const pending = issues.filter(
    (i) => i.status === 'Pending'
  ).length;

  const assigned = issues.filter(
    (i) => i.status === 'Assigned'
  ).length;

  const inProgress = issues.filter(
    (i) => i.status === 'In Progress'
  ).length;

  const resolved = issues.filter(
    (i) => i.status === 'Resolved'
  ).length;

  const highPriority = issues.filter(
    (i) =>
      i.priority === 'High' ||
      i.priority === 'Emergency'
  ).length;

  const statusData = (
    ['Pending', 'Assigned', 'In Progress', 'Resolved'] as IssueStatus[]
  ).map((status) => ({
    name: status,
    value: issues.filter((i) => i.status === status).length,
  }));

  const categoryData = [
    'Furniture',
    'Electrical',
    'Plumbing',
    'Building',
    'Sanitation',
    'Playground',
  ].map((category) => ({
    name: category,
    issues: issues.filter(
      (i) => i.category === category
    ).length,
  }));

  const stats = [
    {
      label: 'Total Issues',
      value: total,
      icon: FileText,
      color: 'bg-primary-600',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'bg-warning-500',
    },
    {
      label: 'Assigned',
      value: assigned,
      icon: UserCheck,
      color: 'bg-primary-500',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Wrench,
      color: 'bg-accent-500',
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: CheckCircle2,
      color: 'bg-success-500',
    },
    {
      label: 'High Priority',
      value: highPriority,
      icon: AlertTriangle,
      color: 'bg-error-500',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500">
            Overview of all facility issues and repair progress.
          </p>
        </div>

        <div className="flex gap-2">

          {/* My Reported Issues */}
          <Button
            variant="secondary"
            onClick={() => navigate('/track')}
          >
            <ListChecks className="h-4 w-4" />
            My Issues
          </Button>

          {/* Report New Issue */}
          <Button
            onClick={() => navigate('/report')}
          >
            <FilePlus className="h-4 w-4" />
            Report Issue
          </Button>

        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="overflow-hidden"
            >
              <div className="p-5">

                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${stat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>

                <p className="text-sm text-slate-500">
                  {stat.label}
                </p>

              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Status Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-base font-semibold text-slate-800">
            Issues by Status
          </h3>

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={3}
              >
                {statusData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      STATUS_COLORS[
                        entry.name as IssueStatus
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-base font-semibold text-slate-800">
            Issues by Category
          </h3>

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <BarChart data={categoryData}>
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="issues"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* Recent Issues */}
      <Card className="p-6">

        <div className="mb-4 flex items-center justify-between">

          <h3 className="text-base font-semibold text-slate-800">
            Recent Issues
          </h3>

          {/* IMPORTANT: Go to ALL issues */}
          <Button
            variant="ghost"
            onClick={() => navigate('/issues')}
          >
            View all
          </Button>

        </div>

        {issues.length === 0 ? (

          <p className="py-8 text-center text-sm text-slate-400">
            No issues reported yet.
          </p>

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
                    Priority
                  </th>

                  <th className="pb-3 font-medium">
                    Status
                  </th>

                  <th className="pb-3 font-medium">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">

                {issues
                  .slice(0, 6)
                  .map((issue) => (

                    <tr
                      key={issue._id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() =>
                        navigate('/issues')
                      }
                    >

                      <td className="py-3 pr-4 font-medium text-slate-800">
                        {issue.title}
                      </td>

                      <td className="py-3 pr-4 text-slate-600">
                        {issue.category}
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

                      <td className="py-3 text-slate-500">
                        {new Date(
                          issue.createdAt
                        ).toLocaleDateString()}
                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        )}

      </Card>

    </div>
  );
}