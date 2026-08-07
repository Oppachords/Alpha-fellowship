import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getClientIp } from "@/lib/security/get-client-ip";

type AuditLogInput = {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: Prisma.InputJsonValue;
};

export async function createAuditLog(input: AuditLogInput) {
  try {
    const ipAddress = await getClientIp();

    await db.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId ?? null,
        details: input.details ?? undefined,
        ipAddress,
      },
    });
  } catch {
    // Audit logging should not block primary actions.
  }
}
