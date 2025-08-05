import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "~/db"; // your drizzle instance
import * as schema from "~/db/schema";

export const authServer = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  socialProviders: {
    google: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
    },
  },
});
