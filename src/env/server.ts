import { type } from "arktype";

const ServerEnvArk = type({
  AUTH_GOOGLE_CLIENT_ID: "string",
  AUTH_GOOGLE_CLIENT_SECRET: "string",
  CDN_BASE_URL: "string.url",
  "DISCORD_WEBHOOK_URL?": "string | undefined",
  LIBSQL_SECRET: "string",
  LIBSQL_URL: "string",
  OWNER_EMAIL_ADDRESSES: "string",
  R2_ACCESS_KEY_ID: "string",
  R2_ACCOUNT_ID: "string",
  R2_BUCKET_NAME: "string",
  R2_SECRET_ACCESS_KEY: "string",
  "TURNSTILE_SECRET_KEY?": "string | undefined",
});

export type ServerEnv = typeof ServerEnvArk.infer;

export const serverEnv = ServerEnvArk.assert({
  AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
  AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  CDN_BASE_URL: process.env.CDN_BASE_URL,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  LIBSQL_SECRET: process.env.LIBSQL_SECRET,
  LIBSQL_URL: process.env.LIBSQL_URL,
  OWNER_EMAIL_ADDRESSES: process.env.OWNER_EMAIL_ADDRESSES,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
});
