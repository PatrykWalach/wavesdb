import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema.ts",
  dialect: "sqlite",
  // driver: "d1-http",
  dbCredentials: {
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/4669aa96667ef51a53d58e4bd157e61770311e049c662dfb890b38807c8d9cd0.sqlite",
    // accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    // databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    // token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
