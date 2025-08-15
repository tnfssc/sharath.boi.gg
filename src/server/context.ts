import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { authServer } from "~/lib/server/auth";

export type Context = Awaited<ReturnType<typeof createContext>>;

export async function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  const auth = await authServer.api.getSession({ headers: req.headers });
  return { raw: { req, resHeaders }, user: auth?.user ?? null };
}
