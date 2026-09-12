'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  phone: string | null;
  jobTitle: string | null;
  timezone: string | null;
  language: string | null;
  hasPassword: boolean;
  twoFactorEnabled: boolean;
  providers: string[];
}

export interface Workspace {
  id: string;
  name: string;
  niche: string | null;
  businessType: string | null;
  settings: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
}

interface UserContextType {
  user: User | null;
  workspace: Workspace | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setWorkspace(data.workspace);
        } else {
          setUser(null);
          setWorkspace(null);
        }
      } else {
        setUser(null);
        setWorkspace(null);
      }
    } catch (err) {
      console.error('Failed to fetch user context:', err);
      setUser(null);
      setWorkspace(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, workspace, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
