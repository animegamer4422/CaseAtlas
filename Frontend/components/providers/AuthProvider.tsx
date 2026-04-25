'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// Matches the backend User schema (or roughly corresponds)
export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatarInitials?: string;
  avatarColor?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on mount
    const checkUser = async () => {
      const token = localStorage.getItem('caseatlas_jwt');
      if (token) {
        try {
          const userData = await api.get('/auth/me');
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('caseatlas_jwt'); // Token invalid or expired
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('caseatlas_jwt', data.token);
      router.push('/');
    } catch (error: any) {
      setIsLoading(false);
      throw error; // Re-throw to be caught by the component
    }
    setIsLoading(false);
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/register', { username, email, password });
      setUser(data);
      localStorage.setItem('caseatlas_jwt', data.token);
      router.push('/');
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('caseatlas_jwt');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
