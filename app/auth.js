import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectDB } from "@/lib/connectdb";

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
      credentials: {
        id: { label: "User ID", type: "text" },
      },

      async authorize(credentials) {
        try {
          await connectDB();
          const existUser = await User.findOne({ _id: credentials.id });
          if (!existUser) {
            return null;
          }
          if (existUser.isBlocked) {
            return null;
          }
          return {
            id: existUser._id,
            name: existUser.name,
            email: existUser.email,
            image: existUser.image,
            role: existUser.role,
            isVerified: existUser.isVerified,
            isBlocked: existUser.isBlocked,
          };
        } catch (error) {
          console.log("error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          await connectDB();

          const existUser = await User.findOne({
            googleId: account.providerAccountId,
          });

          if (!existUser) {
            const newUser = await User.create({
              name: profile.name || profile.family_name,
              email: user.email,
              image: user.image,
              role: "buyer",
              googleId: account.providerAccountId.toString(),
              isVerified: profile.email_verified || false,
              isBlocked: false,
            });

            user.id = newUser._id.toString();
            user.name = newUser.name;
            user.role = newUser.role;
            user.isVerified = newUser.isVerified;
            user.isBlocked = newUser.isBlocked;

            return false;
          }

          user.id = existUser._id.toString();
          user.name = existUser.name;
          user.role = existUser.role;
          user.isVerified = existUser.isVerified;
          user.isBlocked = existUser.isBlocked;

          if (existUser.isBlocked) {
            return "/api/auth/signin?error=OAuthCallbackError";
          }

          return true;
        } catch (error) {
          console.error("Error during signIn callback:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
        token.isVerified = Boolean(user.isVerified);
        token.isBlocked = Boolean(user.isBlocked);
      }
      if (trigger === "update" && session) {
        token.isVerified = Boolean(session.isVerified);
        token.isBlocked = Boolean(session.isBoolean);
        return token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role;
        session.user.isVerified = Boolean(token.isVerified);
        session.user.isBlocked = Boolean(token.isBlocked);
      }
      return session;
    },
  },
});
