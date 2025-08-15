import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";

import { isOwner } from "~/lib/auth/access-control";

import { Context } from "./context";

const t = initTRPC.context<Context>().create({ transformer: SuperJSON });
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { user: ctx.user } });
});

export const ownerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!isOwner(ctx.user.email)) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next();
});
