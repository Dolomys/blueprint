import { ORPCError, os } from "@orpc/server";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

export type SessionUser = NonNullable<Context["session"]>["user"] & {
  role?: string | null;
};

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);

export const adminProcedure = protectedProcedure.use(async ({ context, next }) => {
  const user = context.session.user as SessionUser;

  if (user.role !== "admin") {
    throw new ORPCError("FORBIDDEN");
  }

  return next({ context });
});

export function assertSelfOrAdmin(user: SessionUser, targetUserId: string) {
  if (user.id !== targetUserId && user.role !== "admin") {
    throw new ORPCError("FORBIDDEN");
  }
}
