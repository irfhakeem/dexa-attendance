"use client";

import React from "react";
import { AppHeader } from "./app-header";
import { useAuth } from "@/context/auth-context";
import { LoginView } from "@/components/auth/login-view";
import { DS_TEXT, DS_BG } from "@/constants/design-system";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, isLoading } = useAuth();

  return (
    <div className={`min-h-screen flex flex-col ${DS_BG.app} ${DS_TEXT.primary} font-sans`}>
      <AppHeader />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8">
        {isLoading ? (
          <div className={`p-12 text-center ${DS_TEXT.secondary} text-sm`}>Loading application...</div>
        ) : !user ? (
          <LoginView />
        ) : (
          children
        )}
      </main>
    </div>
  );
}
