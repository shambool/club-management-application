// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { loginUser, logoutUser, AuthUser } from "@/api/auth";
import { getMeUser, MeUser } from "@/api/me";

type AuthStateUser = MeUser | AuthUser | null;

type AuthContextValue = {
  user: AuthStateUser;
  initializing: boolean;     // first time "am I logged in" check
  authLoading: boolean;      // specifically during login/logout
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthStateUser>(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // 🔍 On app start: check if there's an existing session (cookie)
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const me = await getMeUser(); // calls /api/me/user
        setUser(me);
      } catch (err: any) {
        // if 401 or any error, we treat as "not logged in"
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const authUser = await loginUser({ email, password });
      // after login, cookie is set. Option 1: use returned user:
      setUser(authUser);
      // Option 2 (safer if /me/user has extra fields): await refreshUser();
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const me = await getMeUser();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  const value: AuthContextValue = {
    user,
    initializing,
    authLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
