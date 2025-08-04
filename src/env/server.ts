import { type } from "arktype";

import { clientEnv, ClientEnvArk } from "./client";

const ServerEnvArk = type({
  "DISCORD_WEBHOOK_URL?": "string",
  "TURNSTILE_SECRET_KEY?": "string",
}).and(ClientEnvArk);

export type ServerEnv = typeof ServerEnvArk.infer;

export const serverEnv = ServerEnvArk.assert({
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  ...clientEnv,
});
