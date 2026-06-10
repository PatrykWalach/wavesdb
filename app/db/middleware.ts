import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { createContext, type MiddlewareFunction } from "react-router";
import "server-only";
import { relations } from "./relations";
import * as schema from "./schema";

export const Db = createContext<ReturnType<typeof drizzle<typeof schema, typeof relations>>>();

export const dbMiddleware: MiddlewareFunction = async (args, next) => {
  const db = drizzle(env.DB, {
    relations,
    schema,
  });
  args.context.set(Db, db);
  return next();
};
