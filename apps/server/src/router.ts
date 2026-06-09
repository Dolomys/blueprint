import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "./lib/orpc";
import { userRouter } from "./features/user/user.router";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  user: userRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
