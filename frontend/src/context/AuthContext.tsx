import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'recruiter' | 'candidate';
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('talentlens_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Basic JWT sanity check (should have 3 parts separated by dots)
        if (parsed.token && parsed.token.split('.').length === 3) {
          setUser(parsed);
        } else {
          console.warn('Invalid token format detected, clearing storage.');
          localStorage.removeItem('talentlens_user');
        }
      }
    } catch (err) {
      console.error('Auth sync error:', err);
      localStorage.removeItem('talentlens_user');
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('talentlens_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('talentlens_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
