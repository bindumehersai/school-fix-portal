import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  ListChecks,
  Bell,
  Shield,
  User,
  Building2,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { user } = useAuth();

  const commonItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const roleItems = {
    admin: [
      { to: '/track', label: 'All Reported Issues', icon: ListChecks },
      { to: '/admin', label: 'Admin Panel', icon: Shield },
    ],

    teacher: [
      { to: '/report', label: 'Report Facility Issue', icon: FilePlus },
      { to: '/track', label: 'My Reported Issues', icon: ListChecks },
    ],

    parent: [
      { to: '/report', label: 'Report School Issue', icon: FilePlus },
      { to: '/track', label: 'My Submitted Reports', icon: ListChecks },
    ],

    student: [
      { to: '/report', label: 'Report an Issue', icon: FilePlus },
      { to: '/track', label: 'My Issues', icon: ListChecks },
    ],
  };

  const items = [
    ...commonItems,
    ...(roleItems[user?.role as keyof typeof roleItems] || roleItems.student),
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 transform border-r border-slate-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">
                Facility Portal
              </p>
              <p className="text-xs text-slate-400">
                School Reporting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User information */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name}
              </p>

              <p className="text-xs capitalize text-slate-400">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};