import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "~/db"; // your drizzle instance
import * as schema from "~/db/schema";
import { serverEnv } from "~/env/server";

export const authServer = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  plugins: [tanstackStartCookies()],
  socialProviders: {
    google: {
      clientId: serverEnv.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.AUTH_GOOGLE_CLIENT_SECRET,
    },
  },
});
