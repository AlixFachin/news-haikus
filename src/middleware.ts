import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  // TODO: Protect other routes for admin access
  if (isAdminRoute(req)) {
    auth().protect({ role: "org:admin" });
  }

  // TODO: Check if API routes can be protected as well
});

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.

    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    // "/(api|trpc)(.*)",
    // Use middleware for the admin route
    "/admin(.*)",
  ],
};
