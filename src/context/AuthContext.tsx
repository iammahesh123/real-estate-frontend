import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSummary } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: UserSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserSummary>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    agencyName?: string;
    licenseNumber?: string;
    city?: string;
  }) => Promise<UserSummary>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isAgent: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSummary | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authApi.getMe()
        .then((profile) => {
          const summary: UserSummary = {
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            fullName: profile.fullName,
            phone: profile.phone,
            profileImage: profile.profileImage,
            roles: profile.roles,
            agentId: profile.agentId,
          };
          setUser(summary);
          localStorage.setItem('user', JSON.stringify(summary));
        })
        .catch(() => {
          // invalid token
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await authApi.login({ email, password });
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
    setUser(authData.user);
    return authData.user;
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    agencyName?: string;
    licenseNumber?: string;
    city?: string;
  }) => {
    const authData = await authApi.register(data);
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
    setUser(authData.user);
    return authData.user;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (role: string) => {
    if (!user || !user.roles) return false;
    const formatted = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
    return user.roles.includes(formatted);
  };

  const isAdmin = hasRole('ROLE_ADMIN') || hasRole('ROLE_SUPER_ADMIN');
  const isAgent = hasRole('ROLE_AGENT');
  const isCustomer = hasRole('ROLE_CUSTOMER') || (!isAdmin && !isAgent);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasRole,
        isAdmin,
        isAgent,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
