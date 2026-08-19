import { useState } from 'react';
import { User as UserIcon, Mail, Shield, School, Lock, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../api/auth';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Spinner } from '../components/Loader';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [schoolId, setSchoolId] = useState(user?.schoolId || '');
  const [password, setPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await authService.updateProfile({ name, schoolId });
      await refreshProfile();
      toast('Profile updated', 'success');
    } catch (e) {
      toast((e as { message: string }).message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (password.length < 6) {
      toast('Password must be at least 6 characters', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.updateProfile({ password });
      setPassword('');
      toast('Password changed', 'success');
    } catch (e) {
      toast((e as { message: string }).message, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500">Manage your account details and password.</p>
      </div>

      {/* Profile header */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-2xl font-bold text-primary-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="mt-1 inline-flex badge bg-primary-100 text-primary-700 capitalize">{user?.role}</span>
          </div>
        </div>
      </Card>

      {/* Account details */}
      <Card className="p-6">
        <h3 className="mb-4 text-base font-semibold text-slate-800">Account Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <Mail className="h-4 w-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Email</p><p className="text-sm font-medium text-slate-700">{user?.email}</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <Shield className="h-4 w-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Role</p><p className="text-sm font-medium text-slate-700 capitalize">{user?.role}</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <School className="h-4 w-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">School ID</p><p className="text-sm font-medium text-slate-700">{user?.schoolId || '—'}</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <UserIcon className="h-4 w-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Member since</p><p className="text-sm font-medium text-slate-700">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p></div>
          </div>
        </div>
      </Card>

      {/* Edit profile */}
      <Card className="p-6">
        <h3 className="mb-4 text-base font-semibold text-slate-800">Edit Profile</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="School ID" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={saveProfile} disabled={savingProfile}>{savingProfile ? <Spinner /> : <><Save className="h-4 w-4" /> Save Changes</>}</Button>
        </div>
      </Card>

      {/* Change password */}
      <Card className="p-6">
        <h3 className="mb-4 text-base font-semibold text-slate-800">Change Password</h3>
        <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" icon={<Lock className="h-4 w-4" />} />
        <div className="mt-4 flex justify-end">
          <Button onClick={changePassword} disabled={savingPassword}>{savingPassword ? <Spinner /> : 'Update Password'}</Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="danger" onClick={handleLogout}><LogOut className="h-4 w-4" /> Logout</Button>
      </div>
    </div>
  );
}
