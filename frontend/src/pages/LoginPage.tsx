import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';
import { Spinner } from '../components/Loader';

interface FormValues {
  email: string;
  password: string;
  role: string;
  remember: boolean;
}

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { remember: true } });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      toast('Welcome back! Login successful.', 'success');
      navigate('/dashboard');
    } catch (e) {
      toast((e as { message: string }).message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold">Facility Portal</p>
            <p className="text-sm text-primary-200">School Reporting System</p>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">Report, track and resolve school facility issues — all in one place.</h1>
          <p className="text-primary-200">Parents, teachers, and admins collaborate to keep every classroom safe and functional.</p>
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { n: '4', l: 'Status stages' },
              { n: '6', l: 'Categories' },
              { n: '3', l: 'User roles' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-bold">{s.n}</p>
                <p className="text-xs text-primary-200">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-primary-300">MERN Stack · JWT Auth · Cloudinary</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-slate-50 p-6 sm:p-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Facility Portal</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@school.edu"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Select label="Role" {...register('role')}>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </Select>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" {...register('remember')} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                Remember me
              </label>
              <button type="button" onClick={() => toast('Password reset link would be sent to your email.', 'info')} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Forgot password?
              </button>
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? <Spinner /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
