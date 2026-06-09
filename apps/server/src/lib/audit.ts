import prisma from "@blueprint/db";

type AuditInput<T> = {
  requestId: string;
  actorType: string;
  actorId?: string | null;
  authMethod: string;
  action: string;
  resourceType?: string | null;
  resourceId?: string | null;
  diffJson?: unknown;
  metadataJson?: unknown;
  run: () => Promise<T>;
};

export async function withAudit<T>(input: AuditInput<T>) {
  try {
    const result = await input.run();

    await writeAuditLog(input, "SUCCESS");

    return result;
  } catch (error) {
    await writeAuditLog(input, "ERROR", error instanceof Error ? error.name : "UNKNOWN");
    throw error;
  }
}

async function writeAuditLog<T>(input: AuditInput<T>, status: string, errorCode?: string) {
  await prisma.auditLog.create({
    data: {
      requestId: input.requestId,
      actorType: input.actorType,
      actorId: input.actorId,
      authMethod: input.authMethod,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      status,
      errorCode,
      diffJson: input.diffJson as never,
      metadataJson: input.metadataJson as never,
    },
  });
}
