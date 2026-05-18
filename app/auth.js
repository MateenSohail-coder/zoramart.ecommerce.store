import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/error",
  },

  providers: [
    Google,

    Credentials({
      name: "Credentials",
      credentials: {},

      async authorize(credentials) {},
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
      }

      return session;
    },
  },
});
