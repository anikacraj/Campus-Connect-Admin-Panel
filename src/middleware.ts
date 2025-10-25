// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This function only runs if the user is authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If no token (not logged in), return false
        // This will trigger the redirect to the 404 page
        return !!token;
      },
    },
    pages: {
      signIn: "/404", // Redirect unauthorized users to 404 page
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*", // protect all admin routes
  ],
};