"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "./app-header";
import { useAuth } from "@/context/auth-context";
import { LoginView } from "@/components/auth/login-view";
import { DS_TEXT, DS_BG } from "@/constants/design-system";
import {
  MasterUserPageSkeleton,
  AttendanceRecordPageSkeleton,
  AttendanceCheckInSkeleton,
  AttendanceHistoryPageSkeleton,
  LoginPageSkeleton,
} from "@/components/skeletons/page-skeletons";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const renderRouteSkeleton = () => {
    if (typeof window !== "undefined" && !localStorage.getItem("dexa_auth_token")) {
      return <LoginPageSkeleton />;
    }
    if (pathname === "/master-user") {
      return <MasterUserPageSkeleton />;
    }
    if (pathname === "/data-attendance") {
      return <AttendanceRecordPageSkeleton />;
    }
    if (pathname === "/history") {
      return <AttendanceHistoryPageSkeleton />;
    }
    return <AttendanceCheckInSkeleton />;
  };

  return (
    <div className={`min-h-screen flex flex-col ${DS_BG.app} ${DS_TEXT.primary} font-sans`}>
      <AppHeader />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8">
        {isLoading ? (
          renderRouteSkeleton()
        ) : !user ? (
          <LoginView />
        ) : (
          children
        )}
      </main>
    </div>
  );
}
