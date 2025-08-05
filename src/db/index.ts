import { createClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql/http";

const client = createClient({
  authToken: process.env.LIBSQL_SECRET,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  url: process.env.LIBSQL_URL!,
});

export const db = drizzle({ client });
