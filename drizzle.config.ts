import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    authToken: process.env.LIBSQL_SECRET,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url: process.env.LIBSQL_URL!,
  },
  dialect: "turso",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
});
