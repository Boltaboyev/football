import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { findUserByPhone, createUser } from '../api/users';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (payload: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('auth_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login(phoneNumber: string, password: string) {
        const found = await findUserByPhone(phoneNumber);
        if (!found || found.password !== password) {
          throw new Error('INVALID_CREDENTIALS');
        }
        setUser(found);
        localStorage.setItem('auth_user', JSON.stringify(found));
      },
      async register(payload: Omit<User, 'id'>) {
        const exists = await findUserByPhone(payload.phoneNumber);
        if (exists) throw new Error('PHONE_EXISTS');
        const created = await createUser(payload);
        setUser(created);
        localStorage.setItem('auth_user', JSON.stringify(created));
      },
      logout() {
        setUser(null);
        localStorage.removeItem('auth_user');
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not found');
  return ctx;
}