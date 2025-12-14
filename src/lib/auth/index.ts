import { Exception } from "@boi.gg/exception";
import { queryOptions, type QueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerOnlyFn } from "@tanstack/react-start";
import { createAuthClient, ErrorContext } from "better-auth/react";

export class BetterAuthException extends Exception.kind<ErrorContext>("BetterAuthException") {}

export const auth = createAuthClient({
  fetchOptions: {
    onError: (ctx) => {
      throw new BetterAuthException(ctx.error.message, ctx, ctx.error);
    },
  },
});

const getServerSession = createServerOnlyFn(async () => {
  const { authServer } = await import("~/lib/server/auth");
  const { getRequestHeaders } = await import("@tanstack/react-start/server");
  const response = await authServer.api.getSession({ headers: getRequestHeaders() }).catch(() => null);
  if (!response) return { session: null, user: null };
  return response;
});

const getClientSession = async () => {
  const session = await auth.getSession();
  return {
    session: session.data?.session ?? null,
    user: session.data?.user ?? null,
  };
};

type SessionQueryFnData = Awaited<ReturnType<typeof getClientSession>>;

export const sessionQueryOptions = (options?: QueryOptions<SessionQueryFnData>) => {
  const { queryKey, ...restOptions } = options ?? {};
  return queryOptions({
    ...restOptions,
    queryFn: async () => {
      if (import.meta.env.SSR) {
        return getServerSession();
      } else {
        return getClientSession();
      }
    },
    queryKey: ["session", ...(queryKey ?? [])],
  });
};

const useSession = () => useSuspenseQuery(sessionQueryOptions()).data;

export const useUser = () => useSession().user;
