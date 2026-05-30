'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'gerente';
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

  // Cargar sesión al montar el componente
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
    // Simulación de autenticación con credenciales válidas
    const validCredentials: Record<string, { password: string; user: User }> = {
      admin: {
        password: 'admin',
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@techsolutions.com',
          role: 'admin',
          name: 'Administrador',
        },
      },
      user: {
        password: 'user',
        user: {
          id: '2',
          username: 'user',
          email: 'user@techsolutions.com',
          role: 'user',
          name: 'Usuario Regular',
        },
      },
      gerente: {
        password: 'gerente',
        user: {
          id: '3',
          username: 'gerente',
          email: 'gerente@techsolutions.com',
          role: 'gerente',
          name: 'Gerente de Compras',
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
