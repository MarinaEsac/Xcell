import prisma from "@/app/utils/prisma";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

const secret =
  process.env.NEXTAUTH_SECRET ?? process.env.SECRET_KEY ?? undefined;

// Provider env sanity checks (runtime, not compile-time).
// If these are missing, OAuth providers will throw errors like "client_id is required".
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

// eslint-disable-next-line no-console
console.log("[NextAuth env] GOOGLE_CLIENT_ID defined:", !!GOOGLE_CLIENT_ID);
// eslint-disable-next-line no-console
console.log("[NextAuth env] GOOGLE_CLIENT_SECRET defined:", !!GOOGLE_CLIENT_SECRET);
// eslint-disable-next-line no-console
console.log("[NextAuth env] GITHUB_CLIENT_ID defined:", !!GITHUB_CLIENT_ID);
// eslint-disable-next-line no-console
console.log("[NextAuth env] FACEBOOK_CLIENT_ID defined:", !!FACEBOOK_CLIENT_ID);

export const authOptions: NextAuthOptions = {
  secret,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          include_granted_scopes: true,
        },
      },
    }),

    FacebookProvider({
      clientId: FACEBOOK_CLIENT_ID!,
      clientSecret: FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          include_granted_scopes: true,
        },
      },
    }),

    GitHubProvider({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          include_granted_scopes: true,
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        if (!user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) return null;
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (
        account?.provider === "google" ||
        account?.provider === "facebook" ||
        account?.provider === "github"
      ) {
        if (!profile?.email) return false;

        const userExists = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!userExists) {
          await prisma.user.create({
            data: {
              email: profile.email,
              username: profile.name || "",
            },
          });
        }
        return true;
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // `account`/`user` are only present on initial sign-in.
      if (account) {
        token.provider = account.provider;
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at =
          Math.floor(Date.now() / 1000) + (account.expires_at || 0);
      }

      if (user) {
        const u = user as unknown as {
          id?: string;
          email?: string;
          name?: string;
          username?: string;
        };
        token.id = u.id ?? token.id;
        token.email = u.email ?? token.email;
        token.name = u.name ?? u.username ?? token.name;
      }

      // Ensure our token uses DB username/id for both credentials and OAuth.
      if ((account || user) && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.username;
        }
      }

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          provider: token.provider,
          accessToken: token.access_token,
        },
      };
    },

    async redirect({ url, baseUrl }) {
      // Always land on the sheets page after a successful login.
      // This avoids redirects back to whatever page initiated OAuth (e.g. /register).
      return `${baseUrl}/sheets`;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV !== "production",
};

