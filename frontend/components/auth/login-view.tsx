"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, KeyRound } from "lucide-react";
import { DS_TEXT, DS_BG } from "@/constants/design-system";

export function LoginView() {
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsSubmitting(true);
    await login(identifier, password);
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${DS_BG.dark} ${DS_TEXT.inverse}`}>
          <KeyRound className="h-5 w-5" />
        </div>
        <p className={`text-lg font-bold ${DS_TEXT.primary} pb-5 text-center`}>Sign In for Check-In</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="NIP"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-xs font-semibold h-10"
            isLoading={isSubmitting || isLoading}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
