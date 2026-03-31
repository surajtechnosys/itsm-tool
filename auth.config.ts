import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],

  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      const isProtected = pathname.startsWith("/admin");

      if (isProtected && !auth) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
