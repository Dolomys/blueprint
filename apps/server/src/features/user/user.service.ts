import prisma from "@blueprint/db";

import { buildPaginatedResponse, buildPaginationQuery } from "../../lib/pagination";
import { notFound } from "../../lib/errors";
import type { ListUsersInput, ListUsersOutput, UpdateUserInput, UserOutput } from "./user.schema";

const userSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

type UserRecord = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function toUserOutput(user: UserRecord): UserOutput {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: user.role === "admin" ? "admin" : user.role === "user" ? "user" : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function getMe(user: UserRecord): UserOutput {
  return toUserOutput(user);
}

export async function getUserById(id: string): Promise<UserOutput> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!user) {
    throw notFound("User not found");
  }

  return toUserOutput(user);
}

export async function listUsers(input: ListUsersInput): Promise<ListUsersOutput> {
  const pagination = buildPaginationQuery(input);
  const where = input.search
    ? {
        OR: [
          { name: { contains: input.search, mode: "insensitive" as const } },
          { email: { contains: input.search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      ...pagination,
      where,
      select: userSelect,
      orderBy: input.sortBy
        ? { [input.sortBy]: input.sortDirection }
        : { createdAt: input.sortDirection },
    }),
    prisma.user.count({ where }),
  ]);

  return buildPaginatedResponse(items.map(toUserOutput), total, input);
}

export async function updateUser(id: string, data: UpdateUserInput["data"]): Promise<UserOutput> {
  await getUserById(id);

  const user = await prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });

  return toUserOutput(user);
}
