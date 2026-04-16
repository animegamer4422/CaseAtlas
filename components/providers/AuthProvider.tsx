'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MOCK_USERS } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
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
    const storedUserId = localStorage.getItem('caseatlas_mock_user');
    if (storedUserId) {
      const found = MOCK_USERS.find(u => u.id === storedUserId);
      if (found) setUser(found);
    } else {
      // By default test as current_user for MVP
      const defaultUser = MOCK_USERS.find(u => u.id === 'current_user');
      if (defaultUser) setUser(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    
    // For mock MVP, any login logs into 'current_user' unless recognized
    const found = MOCK_USERS.find(u => u.email === email) || MOCK_USERS.find(u => u.id === 'current_user');
    if (found) {
      setUser(found);
      localStorage.setItem('caseatlas_mock_user', found.id);
      router.push('/');
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('caseatlas_mock_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
