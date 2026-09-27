"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { formatDateTimeHeader } from "@/lib/date-utils";
import { LogOut, Menu } from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER } from "@/constants/design-system";

export function AppHeader() {
  const pathname = usePathname();
  const { user, isHR, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerClock, setHeaderClock] = useState<string>("");

  useEffect(() => {
    function updateClock() {
      setHeaderClock(formatDateTimeHeader(new Date()));
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-30 flex items-center justify-between h-14 min-h-[3.5rem] max-h-14 shrink-0 px-4 md:px-6 ${DS_BG.surface} border-b ${DS_BORDER.default}`}>
        <div className="flex items-center gap-4">
          <Link href="/" className={`text-base font-bold ${DS_TEXT.primary} tracking-tight flex items-center h-8`}>
            Dexa
          </Link>

          {user && isHR && (
            <div className="hidden lg:flex items-center gap-4">
              <div className={`h-4 w-px ${DS_BG.subtle}`} aria-hidden="true" />
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link
                      href="/"
                      className={`inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium transition-colors ${
                        pathname === "/"
                          ? `${DS_BG.dark} ${DS_TEXT.inverse}`
                          : `${DS_TEXT.secondary} ${DS_TEXT.primaryHover} ${DS_BG.mutedHover}`
                      }`}
                    >
                      Attendance
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      href="/data-attendance"
                      className={`inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium transition-colors ${
                        pathname === "/data-attendance"
                          ? `${DS_BG.dark} ${DS_TEXT.inverse}`
                          : `${DS_TEXT.secondary} ${DS_TEXT.primaryHover} ${DS_BG.mutedHover}`
                      }`}
                    >
                      Attendance Records
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      href="/master-user"
                      className={`inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium transition-colors ${
                        pathname === "/master-user"
                          ? `${DS_BG.dark} ${DS_TEXT.inverse}`
                          : `${DS_TEXT.secondary} ${DS_TEXT.primaryHover} ${DS_BG.mutedHover}`
                      }`}
                    >
                      User Management
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`hidden sm:flex items-center h-8 text-xs font-medium ${DS_TEXT.secondary} tabular-nums select-none mr-1`}>
            {headerClock || <Skeleton className="h-4 w-28" />}
          </div>

          {user && isHR && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(true)}
              title="Open navigation menu"
              aria-label="Open navigation menu"
              className={`lg:hidden h-10 w-10 p-2 rounded-lg hover:${DS_BG.muted} transition-colors`}
            >
              <Menu className={`w-6 h-6 ${DS_TEXT.primary}`} />
            </Button>
          )}

          {user ? (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded-full ${DS_BG.muted} flex items-center justify-center ${DS_TEXT.primary} font-bold text-xs uppercase`}>
                    {user.name.charAt(0)}
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className={`font-semibold ${DS_TEXT.primary}`}>{user.name}</div>
                  <div className={`text-[11px] ${DS_TEXT.secondary} font-normal mt-0.5`}>
                    {user.nip}
                  </div>
                  {user.department && (
                    <div className={`text-[11px] ${DS_TEXT.secondary} font-normal`}>
                      {user.department.name}
                    </div>
                  )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className={DS_BG.mutedHover}
                >
                  <LogOut className={`w-3.5 h-3.5 ${DS_TEXT.secondary}`} />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <></>
          )}
        </div>
      </header>

      {user && isHR && (
        <Sheet
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          title="Attendance Menu"
          description="HR Features"
        >
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-1.5">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center h-10 px-3 rounded-lg text-xs font-medium transition-colors ${
                  pathname === "/"
                    ? `${DS_BG.dark} ${DS_TEXT.inverse}`
                    : `${DS_TEXT.primary} ${DS_BG.mutedHover}`
                }`}
              >
                Attendance
              </Link>

              <Link
                href="/data-attendance"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center h-10 px-3 rounded-lg text-xs font-medium transition-colors ${
                  pathname === "/data-attendance"
                    ? `${DS_BG.dark} ${DS_TEXT.inverse}`
                    : `${DS_TEXT.primary} ${DS_BG.mutedHover}`
                }`}
              >
                Attendance Records
              </Link>

              <Link
                href="/master-user"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center h-10 px-3 rounded-lg text-xs font-medium transition-colors ${
                  pathname === "/master-user"
                    ? `${DS_BG.dark} ${DS_TEXT.inverse}`
                    : `${DS_TEXT.primary} ${DS_BG.mutedHover}`
                }`}
              >
                User Management
              </Link>
            </div>

            <div className={`pt-4 border-t ${DS_BORDER.default} space-y-2`}>
              <div className={`text-[11px] ${DS_TEXT.secondary} uppercase font-semibold tracking-wider`}>
                System Time
              </div>
              <div className={`text-xs font-medium ${DS_TEXT.primary} tabular-nums`}>
                {headerClock || <Skeleton className="h-4 w-28" />}
              </div>
            </div>
          </div>
        </Sheet>
      )}
    </>
  );
}
