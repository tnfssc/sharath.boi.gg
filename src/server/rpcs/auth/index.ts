import { isOwner } from "~/lib/auth/access-control";
import { publicProcedure, router } from "~/server/trpc";

export const authRouter = router({
  isOwner: publicProcedure.query(({ ctx }) => {
    const emailAddress = ctx.user?.email;
    if (!emailAddress) return false;
    if (isOwner(emailAddress)) return true;
    return false;
  }),
});
