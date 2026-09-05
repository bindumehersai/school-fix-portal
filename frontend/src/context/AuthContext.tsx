import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { User, Role } from '../types';
import { authService } from '../api/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    email: string,
    password: string,
    role: Role
  ) => Promise<void>;

  register: (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    schoolId: string;
  }) => Promise<void>;

  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getProfile()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // LOGIN
  const login = async (
    email: string,
    password: string,
    role: Role
  ) => {
    const res = await authService.login(
      email,
      password,
      role
    );

    localStorage.setItem('token', res.token);

    setToken(res.token);

    setUser({
      _id: res._id,
      name: res.name,
      email: res.email,
      role: res.role,
      schoolId: res.schoolId,
    });
  };

  // REGISTER
  // Registration does NOT automatically log the user in.
  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    schoolId: string;
  }) => {
    await authService.register(data);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // REFRESH PROFILE
  const refreshProfile = async () => {
    const u = await authService.getProfile();
    setUser(u);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return ctx;
};