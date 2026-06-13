import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { createContext, type MiddlewareFunction } from "react-router";
import { relations } from "./relations";
import * as schema from "./schema";

export const Db = createContext<ReturnType<typeof drizzle<typeof schema, typeof relations>>>();

export const db = drizzle(env.DB, {
  relations,
  schema,
});

export const dbMiddleware: MiddlewareFunction = async (args, next) => {
  args.context.set(Db, db);
  return next();
};
