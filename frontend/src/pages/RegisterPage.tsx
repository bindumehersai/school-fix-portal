import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, School, Eye, EyeOff, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';
import { Spinner } from '../components/Loader';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  schoolId: string;
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const password = watch('password');

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as 'parent' | 'teacher' | 'admin',
        schoolId: data.schoolId,
      });
      toast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (e) {
      toast((e as { message: string }).message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-accent-600 via-primary-700 to-primary-900 p-12 text-white lg:flex">
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
          <h1 className="text-4xl font-bold leading-tight">Join your school community in keeping facilities safe.</h1>
          <p className="text-primary-200">Create an account to report broken facilities, track repair progress, and get notified when issues are resolved.</p>
          <ul className="space-y-3 pt-4">
            {['Report issues with photos', 'Real-time status tracking', 'Role-based access for parents, teachers & admins'].map((f) => (
              <li key={f} className="flex items-center gap-3 text-primary-100">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-300" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-300">MERN Stack · JWT Auth · Cloudinary</p>
      </div>

      <div className="flex items-center justify-center bg-slate-50 p-6 sm:p-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Facility Portal</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-1 text-sm text-slate-500">Get started in less than a minute.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <Input
              label="Full name"
              placeholder="John Doe"
              icon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@school.edu"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
            />
            <Select label="Role" {...register('role', { required: 'Role is required' })}>
              <option value="">Select a role</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </Select>
            <Input
              label="School ID"
              placeholder="SCH-001"
              icon={<School className="h-4 w-4" />}
              error={errors.schoolId?.message}
              {...register('schoolId', { required: 'School ID is required' })}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Input
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? <Spinner /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
