
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Types
export type UserRole = 'admin' | 'candidate' | 'voter';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isCandidate: () => boolean;
  isVoter: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Mock auth check - replace with Supabase auth check after integration
        const savedUser = localStorage.getItem('ballot_box_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - replace with Supabase auth after integration
      // This is temporary until Supabase integration
      const mockUsers = [
        { id: '1', email: 'admin@example.com', password: 'password', name: 'Admin User', role: 'admin' as UserRole },
        { id: '2', email: 'candidate@example.com', password: 'password', name: 'Candidate User', role: 'candidate' as UserRole },
        { id: '3', email: 'voter@example.com', password: 'password', name: 'Voter User', role: 'voter' as UserRole },
      ];
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('ballot_box_user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      
      navigate('/app');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Mock registration - replace with Supabase auth after integration
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
      };
      
      setUser(newUser);
      localStorage.setItem('ballot_box_user', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
      
      navigate('/app');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem('ballot_box_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  // Helper functions for role checks
  const isAdmin = () => user?.role === 'admin';
  const isCandidate = () => user?.role === 'candidate';
  const isVoter = () => user?.role === 'voter';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isAdmin,
        isCandidate,
        isVoter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
