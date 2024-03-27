"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <header className="w-full bg-gray-800 text-sm text-gray-200">
        Login
      </header>
      {children}
    </ClerkProvider>
  );
}
