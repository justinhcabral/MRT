import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/admin") ||
        nextUrl.pathname.startsWith("/manager");
      const isAuthPage =
        nextUrl.pathname === "/" || nextUrl.pathname === "/signUp";

      // Redirect logged-in users away from auth pages
      if (isAuthPage && isLoggedIn) {
        const userRole = auth.user.role;
        const redirectPath = userRole === "SUPER_ADMIN" ? "/admin" : "/manager";
        return Response.redirect(new URL(redirectPath, nextUrl));
      }

      // Protect admin and manager routes based on role
      if (isProtectedRoute) {
        // If not logged in, block access (NextAuth will redirect to signIn page)
        if (!isLoggedIn) {
          return false;
        }

        // Check role-based access
        const userRole = auth.user.role;
        const isAdminRoute = nextUrl.pathname.startsWith("/admin");
        const isManagerRoute = nextUrl.pathname.startsWith("/manager");

        // Allow SUPER_ADMIN to access /admin routes
        if (isAdminRoute && userRole === "SUPER_ADMIN") {
          return true;
        }

        // Allow STATION_MANAGER to access /manager routes
        if (isManagerRoute && userRole === "STATION_MANAGER") {
          return true;
        }

        // Block unauthorized access (wrong role for route)
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
