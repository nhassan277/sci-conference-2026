import { db } from "./db.js";
import { auditLogs } from "../drizzle/schema.js";

export interface AuditLogParams {
  adminId?: number;
  adminEmail?: string;
  adminName?: string;
  action: string; // create, update, delete, export, login, logout, etc.
  resourceType: string; // registration, session, sponsorship, admin, etc.
  resourceId?: number;
  details?: Record<string, any>; // Additional context
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an admin action to the audit log
 */
export async function logAuditAction(params: AuditLogParams): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      adminName: params.adminName,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      details: params.details ? JSON.stringify(params.details) : null,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  } catch (error) {
    console.error("Failed to log audit action:", error);
    // Don't throw - audit logging should not break the main operation
  }
}

/**
 * Extract IP address from request
 */
export function getIpAddress(req: any): string | undefined {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress
  );
}

/**
 * Extract user agent from request
 */
export function getUserAgent(req: any): string | undefined {
  return req.headers["user-agent"];
}
