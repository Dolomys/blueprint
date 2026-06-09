import { z } from "zod";

import { paginateQuerySchema } from "../../lib/pagination";

export const userOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  image: z.string().nullable(),
  role: z.enum(["user", "admin"]).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getUserByIdInputSchema = z.object({
  id: z.string().min(1),
});

export const listUsersInputSchema = paginateQuerySchema;

export const listUsersOutputSchema = z.object({
  items: z.array(userOutputSchema),
  meta: z.object({
    total: z.number().int().min(0),
    pageIndex: z.number().int().min(0),
    pageSize: z.number().int().min(1),
    pageCount: z.number().int().min(0),
  }),
});

export const updateUserInputSchema = z.object({
  id: z.string().min(1),
  data: z.object({
    name: z.string().min(1).optional(),
    image: z.string().nullable().optional(),
  }),
});

export type ListUsersInput = z.infer<typeof listUsersInputSchema>;
export type ListUsersOutput = z.infer<typeof listUsersOutputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type UserOutput = z.infer<typeof userOutputSchema>;
