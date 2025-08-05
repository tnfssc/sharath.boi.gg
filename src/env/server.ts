import { type } from "arktype";

const ServerEnvArk = type({
  AUTH_GOOGLE_CLIENT_ID: "string",
  AUTH_GOOGLE_CLIENT_SECRET: "string",
  "DISCORD_WEBHOOK_URL?": "string | undefined",
  LIBSQL_SECRET: "string",
  LIBSQL_URL: "string",
  "TURNSTILE_SECRET_KEY?": "string | undefined",
});

export type ServerEnv = typeof ServerEnvArk.infer;

export const serverEnv = ServerEnvArk.assert({
  AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
  AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  LIBSQL_SECRET: process.env.LIBSQL_SECRET,
  LIBSQL_URL: process.env.LIBSQL_URL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
});
