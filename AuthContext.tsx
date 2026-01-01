import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'ADMIN' | 'EDITOR';

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize default passwords if not present
  useEffect(() => {
    if (!localStorage.getItem('lasa_pwd_admin')) {
      localStorage.setItem('lasa_pwd_admin', 'admin123');
    }
    if (!localStorage.getItem('lasa_pwd_editor')) {
      localStorage.setItem('lasa_pwd_editor', 'editor123');
    }

    const storedAuth = localStorage.getItem('lasa_auth');
    const storedRole = localStorage.getItem('lasa_role');
    
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      if (storedRole === 'ADMIN' || storedRole === 'EDITOR') {
        setRole(storedRole as UserRole);
      } else {
        setRole('EDITOR');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (password: string) => {
    const adminPwd = localStorage.getItem('lasa_pwd_admin');
    const editorPwd = localStorage.getItem('lasa_pwd_editor');

    if (password === adminPwd) {
      setIsAuthenticated(true);
      setRole('ADMIN');
      localStorage.setItem('lasa_auth', 'true');
      localStorage.setItem('lasa_role', 'ADMIN');
      return true;
    } else if (password === editorPwd) {
      setIsAuthenticated(true);
      setRole('EDITOR');
      localStorage.setItem('lasa_auth', 'true');
      localStorage.setItem('lasa_role', 'EDITOR');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('lasa_auth');
    localStorage.removeItem('lasa_role');
  };

  const changePassword = (newPassword: string): boolean => {
    if (!isAuthenticated || !role) return false;
    
    // Only Admin can change password (currently changing their own)
    // In a real app, you might want logic to change Editor password too
    if (role === 'ADMIN') {
      localStorage.setItem('lasa_pwd_admin', newPassword);
      return true;
    }
    
    return false;
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};