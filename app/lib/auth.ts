import "server-only";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { createContext, type MiddlewareFunction } from "react-router";
import { db } from "../db/middleware";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  socialProviders: {
    discord: {
      clientId: import.meta.env.VITE_DISCORD_CLIENT_ID!,
      clientSecret: import.meta.env.VITE_DISCORD_CLIENT_SECRET!,
    },
  },
});

export const Auth = createContext<typeof auth>();

export interface Session {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
}

export const SESSION = createContext<Promise<Session | null>>();

export const sessionMiddleware: MiddlewareFunction = async (args, next) => {
  args.context.set(Auth, auth);
  const session = auth.api.getSession({
    headers: args.request.headers,
  });
  args.context.set(SESSION, session);

  return next();
};
