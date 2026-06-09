import prisma from "@blueprint/db";

export async function reserveIdempotencyRequest(input: {
  actorId: string;
  method: string;
  keyHash: string;
  requestHash: string;
  expiresAt: Date;
}) {
  await prisma.idempotencyRequest.upsert({
    where: {
      actorId_method_keyHash: {
        actorId: input.actorId,
        method: input.method,
        keyHash: input.keyHash,
      },
    },
    create: {
      actorId: input.actorId,
      method: input.method,
      keyHash: input.keyHash,
      requestHash: input.requestHash,
      status: "IN_PROGRESS",
      expiresAt: input.expiresAt,
    },
    update: {},
  });

  return prisma.idempotencyRequest.findUniqueOrThrow({
    where: {
      actorId_method_keyHash: {
        actorId: input.actorId,
        method: input.method,
        keyHash: input.keyHash,
      },
    },
  });
}
