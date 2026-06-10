'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'solicitante' | 'analista' | 'aprobador' | 'auditor';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.log('[v0] Error parsing stored user:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const validCredentials: Record<string, { password: string; user: User }> = {
      solicitante: {
        password: 'solicitante',
        user: {
          id: '1',
          username: 'solicitante',
          email: 'solicitante@mpprijp.gob.ve',
          role: 'solicitante',
          name: 'Carlos Méndez',
        },
      },
      analista: {
        password: 'analista',
        user: {
          id: '2',
          username: 'analista',
          email: 'analista@mpprijp.gob.ve',
          role: 'analista',
          name: 'María López',
        },
      },
      aprobador: {
        password: 'aprobador',
        user: {
          id: '3',
          username: 'aprobador',
          email: 'aprobador@mpprijp.gob.ve',
          role: 'aprobador',
          name: 'José Rodríguez',
        },
      },
      auditor: {
        password: 'control-posterior',
        user: {
          id: '5',
          username: 'control-posterior',
          email: 'auditor@mpprijp.gob.ve',
          role: 'auditor',
          name: 'Luis García',
        },
      },
    };

    const credentials = validCredentials[username];
    if (credentials && credentials.password === password) {
      setUser(credentials.user);
      localStorage.setItem('auth_user', JSON.stringify(credentials.user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
