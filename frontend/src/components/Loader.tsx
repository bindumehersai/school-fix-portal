import { Loader2 } from 'lucide-react';

export const Spinner = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <Loader2 className={`animate-spin ${className}`} />
);

export const FullLoader = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <Spinner className="h-8 w-8 text-primary-600" />
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

export const PageLoader = () => (
  <div className="flex h-[60vh] items-center justify-center">
    <Spinner className="h-10 w-10 text-primary-600" />
  </div>
);
