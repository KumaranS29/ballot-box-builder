
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthError } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

// Types
export type UserRole = 'admin' | 'candidate' | 'voter';

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  profileImage?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isCandidate: () => boolean;
  isVoter: () => boolean;
  session: Session | null;
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
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    console.log("Setting up auth state listener");
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);

        if (currentSession?.user) {
          // Fetch user profile from our users table
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('user_id', currentSession.user.id)
              .single();

            if (userError || !userData) {
              console.error('Error fetching user data:', userError);
              setUser(null);
              setIsLoading(false);
            } else {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: userData.name,
                role: userData.role as UserRole,
                profileImage: null  // Since the database doesn't have a profile_image field
              });
              setIsLoading(false);
              
              if (event === 'SIGNED_IN') {
                console.log("User signed in, navigating to /app");
                setTimeout(() => navigate('/app'), 0);
              }
            }
          } catch (error) {
            console.error("Error in auth state change handler:", error);
            setUser(null);
            setIsLoading(false);
          }
        } else {
          setUser(null);
          setIsLoading(false);
          
          if (event === 'SIGNED_OUT') {
            console.log("User signed out, navigating to /");
            navigate('/');
          }
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          // Fetch user profile from our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', initialSession.user.id)
            .single();

          if (userError || !userData) {
            console.error('Error fetching user data:', userError);
            setUser(null);
          } else {
            setUser({
              id: initialSession.user.id,
              email: initialSession.user.email || '',
              name: userData.name,
              role: userData.role as UserRole,
              profileImage: null  // Since the database doesn't have a profile_image field
            });
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigation is now handled in the auth state change listener
      console.log("Login successful, auth state change will handle navigation");
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Login failed",
        description: authError.message || "An error occurred during login",
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
      console.log("Attempting registration for:", email, "with role:", role);
      // 1. Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
      
      // Navigation is now handled in the auth state change listener
      console.log("Registration successful, auth state change will handle navigation");
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Registration failed",
        description: authError.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("Attempting logout");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Navigation is now handled in the auth state change listener
      console.log("Logout successful, auth state change will handle navigation");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper functions for role checks
  const isAdmin = () => user?.role === 'admin';
  const isCandidate = () => user?.role === 'candidate';
  const isVoter = () => user?.role === 'voter';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
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
