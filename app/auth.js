import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectDB } from "@/lib/connectdb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

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
    if (account?.provider === "google") {
      try {
        await connectDB();

        let existingUser = await User.findOne({
          googleId: account.providerAccountId.toString(),
        });

        // If user doesn't exist by googleId, check by email
        if (!existingUser && user.email) {
          existingUser = await User.findOne({
            email: user.email,
          });

          // Link Google account to existing email account
          if (existingUser) {
            existingUser.googleId = account.providerAccountId.toString();

            if (!existingUser.image && user.image) {
              existingUser.image = user.image;
            }

            await existingUser.save();
          }
        }

        // Create new user if still not found
        if (!existingUser) {
          const newUser = await User.create({
            name:
              profile?.name ||
              user?.name ||
              profile?.given_name ||
              "Google User",
            email: user.email,
            image: user.image,
            role: "buyer",
            googleId: account.providerAccountId.toString(),
            isVerified: profile?.email_verified ?? true,
            isBlocked: false,
          });

          user.id = newUser._id.toString();
          user.name = newUser.name;
          user.role = newUser.role;
          user.isVerified = newUser.isVerified;
          user.isBlocked = newUser.isBlocked;

          return true; // Allow sign in
        }

        // Prevent blocked users from signing in
        if (existingUser.isBlocked) {
          return "/api/auth/signin?error=AccountBlocked";
        }

        // Attach DB user data to session user
        user.id = existingUser._id.toString();
        user.name = existingUser.name;
        user.role = existingUser.role;
        user.isVerified = existingUser.isVerified;
        user.isBlocked = existingUser.isBlocked;

        return true;
      } catch (error) {
        console.error("Google sign-in error:", error);
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
        if (session.name) token.name = session.name;
        if (session.image) token.image = session.image;
        token.isVerified = Boolean(session.isVerified);
        token.isBlocked = Boolean(session.isBlocked);
        return token;
      }
      if (token?.id) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.id).select("isBlocked isVerified").lean();
          if (dbUser) {
            token.isBlocked = Boolean(dbUser.isBlocked);
            token.isVerified = Boolean(dbUser.isVerified);
          }
        } catch {
          // ignore — use existing token values
        }
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
