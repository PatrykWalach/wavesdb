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
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
});

export const Auth = createContext<typeof auth>();
export const Session = createContext();

export const sessionMiddleware: MiddlewareFunction = async (args, next) => {
  args.context.set(Auth, auth);
  const session = await auth.api.getSession({
    headers: args.request.headers,
  });
  args.context.set(Session, session);

  session?.user.id;

  return next();
};
