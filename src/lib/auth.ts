import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

// Temporary passwords for first-time login (constants)
export const TEMP_VEC_STORE = "VEC@Krishna2024";
export const TEMP_STORE = "Store@Krishna2024";
export const TEMP_CAPTAIN = "Captain@Krishna2024";
export const TEMP_DISTRIBUTOR = "Dist@Krishna2024";

/**
 * NextAuth configuration using Credentials provider.
 * - Allows login with one-time temp passwords (for first login)
 * - Falls back to bcrypt compare with stored hashed password
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase().trim();

        // find user in your primary users table (userz)
        const user = await prisma.cordinatorUser?.findUnique({ where: { email } });
        if (!user) return null;

        const pw = credentials.password;

        // If password matches any temporary password, allow first-login
        if ([TEMP_VEC_STORE, TEMP_STORE, TEMP_CAPTAIN, TEMP_DISTRIBUTOR].includes(pw)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: (user as any).role || (user as any).userType || null,
            storeType: (user as any).storeTypeAccess || (user as any).storeType || null,
            captainId: (user as any).captainId || null,
            isFirstLogin: true,
            rememberMe: false,
          } as any;
        }

        // Otherwise verify bcrypt hashed password
        const hashed = (user as any).password_hash || (user as any).password;
        if (!hashed) return null;
        const ok = await bcrypt.compare(pw, hashed).catch(() => false);
        if (!ok) return null;

        // successful login
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: (user as any).role || (user as any).userType || null,
          storeType: (user as any).storeTypeAccess || (user as any).storeType || null,
          captainId: (user as any).captainId || null,
          isFirstLogin: !!((user as any).isFirstLogin || (user as any).is_first_login),
          rememberMe: !!((user as any).rememberMeToken && (user as any).rememberMeExpiry && new Date((user as any).rememberMeExpiry) > new Date()),
        } as any;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    // default maxAge handled by NextAuth; we will override expires in callbacks when rememberMe
  },

  callbacks: {
    async jwt({ token, user }) {
      // on sign in, user will be available
      if (user) {
        token.userId = (user as any).id;
        token.userType = (user as any).userType;
        token.storeType = (user as any).storeType;
        token.captainId = (user as any).captainId;
        token.isFirstLogin = (user as any).isFirstLogin || false;
        token.rememberMe = (user as any).rememberMe || false;

        // if DB has remember token & expiry, extend session to 30 minutes
        try {
          const dbUser = await prisma.cordinatorUser?.findUnique({ where: { id: (user as any).id } });
          const remExpiry = (dbUser as any)?.rememberMeExpiry;
          const remToken = (dbUser as any)?.rememberMeToken;
          if (remToken && remExpiry && new Date(remExpiry) > new Date()) {
            token.rememberMe = true;
            token.expiration = Date.now() + 30 * 60 * 1000; // 30 minutes
          }
        } catch (e) {
          // best-effort only
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.userId as string,
        userType: token.userType as string | null,
        storeType: token.storeType as string | null,
        captainId: token.captainId as string | null,
        isFirstLogin: token.isFirstLogin as boolean,
        rememberMe: token.rememberMe as boolean,
      };

      // if token.expiration is set (ms) override session expiry
      if ((token as any).expiration) {
        session.expires = new Date((token as any).expiration).toISOString();
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

// Define a custom type for session.user
interface CustomSessionUser {
  id: string;
  userType: string | null;
  storeType: string | null;
  captainId: string | null;
  isFirstLogin: boolean;
  rememberMe: boolean;
}

declare module "next-auth" {
  interface Session {
    user: CustomSessionUser;
  }
}
