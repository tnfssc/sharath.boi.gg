import { init as CUID2 } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { type } from "arktype";

import { serverEnv } from "~/env/server";
import { isOwner } from "~/lib/auth/access-control";
import { S3 } from "~/lib/s3";

import { ownerProcedure, publicProcedure, router } from "./trpc";

const createId = CUID2({ length: 5 });

export const appRouter = router({
  auth: {
    isOwner: publicProcedure.query(({ ctx }) => {
      const emailAddress = ctx.user?.email;
      if (!emailAddress) return false;
      if (isOwner(emailAddress)) return true;
      return false;
    }),
  },
  owner: {
    uploadToCDN: ownerProcedure.input(type.instanceOf(FormData)).mutation(async ({ input }) => {
      const file = input.get("file");
      if (!file || !(file instanceof File)) throw new TRPCError({ code: "BAD_REQUEST" });

      const ext = file.name.split(".").pop() ?? "unknown";

      const today = new Date();
      const key = today.getFullYear().toString() + (today.getMonth() + 1).toString() + `-${createId()}.${ext}`;

      await S3.put(key, file);

      return { url: new URL(key, serverEnv.CDN_BASE_URL).toString() };
    }),
  },
});

export type AppRouter = typeof appRouter;
