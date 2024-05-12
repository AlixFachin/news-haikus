// Layout component for the generate page and sub-pages
// Client component which will display the auth status icon with next.js

"use client";

import AppMenu from "@/components/AppMenu";
import UserActionsBox from "@/components/UserActions";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <SignedOut>
        <div className="left-0 top-0 h-dvh w-screen bg-transparent">
          {
            // This is to get a regular background
          }
        </div>
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/20">
          <div className="flex h-[300px] w-[300px] flex-col justify-center rounded-sm bg-gradient-to-tl from-orange-200 to-orange-300 p-2 shadow-md dark:from-blue-900 dark:to-blue-700">
            <p>This page requires to be logged in before proceeding.</p>
            <p>Please log in using the button below</p>
            <SignInButton>
              <button className="mt-4 rounded-lg bg-orange-500 p-2">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn>{children}</SignedIn>
      <AppMenu displayUserButton={true} />
    </ClerkProvider>
  );
}
