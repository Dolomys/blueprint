import {
  adminProcedure,
  assertSelfOrAdmin,
  protectedProcedure,
  type SessionUser,
} from "../../lib/orpc";

import {
  getUserByIdInputSchema,
  listUsersInputSchema,
  listUsersOutputSchema,
  updateUserInputSchema,
  userOutputSchema,
} from "./user.schema";
import * as userService from "./user.service";

export const userRouter = {
  me: protectedProcedure
    .output(userOutputSchema)
    .handler(({ context }) => userService.getMe(context.session.user)),

  getById: protectedProcedure
    .input(getUserByIdInputSchema)
    .output(userOutputSchema)
    .handler(({ context, input }) => {
      assertSelfOrAdmin(context.session.user as SessionUser, input.id);
      return userService.getUserById(input.id);
    }),

  list: adminProcedure
    .input(listUsersInputSchema)
    .output(listUsersOutputSchema)
    .handler(({ input }) => userService.listUsers(input)),

  update: protectedProcedure
    .input(updateUserInputSchema)
    .output(userOutputSchema)
    .handler(({ context, input }) => {
      assertSelfOrAdmin(context.session.user as SessionUser, input.id);
      return userService.updateUser(input.id, input.data);
    }),
};
