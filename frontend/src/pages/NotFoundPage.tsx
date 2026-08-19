import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center animate-fade-in">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-100 text-primary-600">
        <Compass className="h-10 w-10" />
      </div>
      <p className="text-6xl font-extrabold text-slate-900">404</p>
      <h1 className="mt-2 text-xl font-semibold text-slate-700">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="btn-primary mt-6"><Home className="h-4 w-4" /> Back to Dashboard</Link>
    </div>
  );
}
