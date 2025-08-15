import { authRouter } from "./rpcs/auth";
import { ownerRouter } from "./rpcs/owner";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  owner: ownerRouter,
});

export type AppRouter = typeof appRouter;
