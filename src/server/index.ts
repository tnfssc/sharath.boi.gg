import { authRouter } from "./rpcs/auth";
import { blogRouter } from "./rpcs/blog";
import { ownerRouter } from "./rpcs/owner";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  blog: blogRouter,
  owner: ownerRouter,
});

export type AppRouter = typeof appRouter;
