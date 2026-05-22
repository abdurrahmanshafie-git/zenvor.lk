import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase';

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshProfile: (authUser?: User | null) => Promise<UserProfile | null>;
  login: (email: string, password: string) => Promise<{ user: User; profile: UserProfile | null; role: UserRole | null }>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuthProfile = () => {
    setProfile(null);
    setRole(null);
  };

  const storeProfile = (nextProfile: UserProfile | null) => {
    setProfile(nextProfile);
    setRole(nextProfile?.role ?? null);
  };

  const refreshProfile = async (authUser?: User | null): Promise<UserProfile | null> => {
    const supabase = getSupabase();
    try {
      if (!supabase || !authUser) {
        clearAuthProfile();
        return null;
      }

      const { data: profile, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error(error);
        clearAuthProfile();
        return null;
      }

      storeProfile(profile as UserProfile);
      return profile as UserProfile;
    } catch (error) {
      console.error(error);
      clearAuthProfile();
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    const restoreAuth = async (incomingSession?: Session | null) => {
      try {
        setLoading(true);

        let nextSession = incomingSession ?? null;
        if (typeof incomingSession === 'undefined') {
          try {
            const { data, error } = await supabase.auth.getSession();
            if (error) console.error(error);
            nextSession = data.session;
          } catch (error) {
            console.error(error);
          }
        }

        let nextUser = nextSession?.user ?? null;
        if (nextSession) {
          try {
            const { data, error } = await supabase.auth.getUser();
            if (error) console.error(error);
            nextUser = data.user ?? nextUser;
          } catch (error) {
            console.error(error);
          }
        }

        if (!active) return;
        setSession(nextSession);
        setUser(nextUser);

        if (nextUser) {
          await refreshProfile(nextUser);
        } else {
          clearAuthProfile();
        }
      } catch (error) {
        console.error(error);
        if (active) {
          setSession(null);
          setUser(null);
          clearAuthProfile();
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      restoreAuth(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading) return;

    const timeout = window.setTimeout(() => {
      console.error('Auth loading exceeded 5 seconds. Forcing fallback state.');
      setLoading(false);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [loading]);

  const login = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase is not configured.');

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('Login succeeded but no user session was returned.');

      setSession(data.session);
      setUser(data.user);

      const nextProfile = await refreshProfile(data.user);

      return {
        user: data.user,
        profile: nextProfile,
        role: nextProfile?.role ?? null,
      };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase is not configured.');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    setLoading(true);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      setSession(null);
      setUser(null);
      clearAuthProfile();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading,
        isAuthenticated: !!user,
        isAdmin: profile?.role === 'admin',
        refreshProfile,
        login,
        signup,
        signOut,
        logout: signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
