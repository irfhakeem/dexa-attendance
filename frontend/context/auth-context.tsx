"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@/types/user";
import { AuthContextType } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { useToast } from "@/components/ui/toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await authService.getCurrentUser();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = useCallback(
    async (nip: string, password?: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        const res = await authService.login(nip, password);
        setUser(res.data);
        showToast({
          title: "Sign In Successful",
          description: `Welcome back, ${res.data.name}`,
          type: "success",
        });
        return true;
      } catch (err: unknown) {
        const error = err as { error?: { message?: string } };
        showToast({
          title: "Sign In Failed",
          description: error?.error?.message || "Invalid NIP or password",
          type: "error",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    showToast({
      title: "Sign Out Successful",
      description: "You have been signed out",
      type: "info",
    });
  }, [showToast]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isHR: !!user?.isHR,
    isPegawai: !user?.isHR,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
