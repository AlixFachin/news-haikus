"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function UserActionsBox() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <button>Log In</button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
