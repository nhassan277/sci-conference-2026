import { db } from "./db.js";
import { admins } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

export type AdminRole = "super_admin" | "moderator" | "viewer";

export interface AdminPermissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canExport: boolean;
  canManageAdmins: boolean;
  canViewAuditLog: boolean;
}

/**
 * Get permissions for a given role
 */
export function getRolePermissions(role: AdminRole): AdminPermissions {
  switch (role) {
    case "super_admin":
      return {
        canCreate: true,
        canUpdate: true,
        canDelete: true,
        canExport: true,
        canManageAdmins: true,
        canViewAuditLog: true,
      };
    case "moderator":
      return {
        canCreate: true,
        canUpdate: true,
        canDelete: false, // Moderators cannot delete
        canExport: true,
        canManageAdmins: false, // Cannot manage other admins
        canViewAuditLog: true,
      };
    case "viewer":
      return {
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        canExport: true, // Can export for reporting
        canManageAdmins: false,
        canViewAuditLog: true,
      };
    default:
      // Default to most restrictive
      return {
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        canExport: false,
        canManageAdmins: false,
        canViewAuditLog: false,
      };
  }
}

/**
 * Check if a user is an admin and get their role
 */
export async function getAdminByOpenId(openId: string): Promise<{ id: number; email: string; name: string; role: AdminRole } | null> {
  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.openId, openId));

  if (!admin) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role as AdminRole,
  };
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(
  openId: string,
  permission: keyof AdminPermissions
): Promise<boolean> {
  const admin = await getAdminByOpenId(openId);
  if (!admin) {
    return false;
  }

  const permissions = getRolePermissions(admin.role);
  return permissions[permission];
}

/**
 * Ensure owner (OWNER_OPEN_ID) always has super_admin role
 */
export async function ensureOwnerIsSuperAdmin(): Promise<void> {
  const ownerOpenId = process.env.OWNER_OPEN_ID;
  if (!ownerOpenId) {
    console.warn("OWNER_OPEN_ID not set in environment");
    return;
  }

  const [existingOwner] = await db
    .select()
    .from(admins)
    .where(eq(admins.openId, ownerOpenId));

  if (!existingOwner) {
    // Create owner as super admin
    await db.insert(admins).values({
      openId: ownerOpenId,
      email: process.env.OWNER_EMAIL || "owner@example.com",
      name: process.env.OWNER_NAME || "Owner",
      role: "super_admin",
      createdBy: null,
    });
    console.log("Owner added as super admin");
  } else if (existingOwner.role !== "super_admin") {
    // Ensure owner is super admin
    await db
      .update(admins)
      .set({ role: "super_admin" })
      .where(eq(admins.openId, ownerOpenId));
    console.log("Owner role updated to super admin");
  }
}
