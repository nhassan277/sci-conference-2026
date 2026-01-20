import { describe, it, expect, beforeAll } from "vitest";
import { db } from "./db.js";
import { admins, auditLogs, registrations } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { logAuditAction } from "./audit.js";
import { getAdminByOpenId, hasPermission, getRolePermissions, ensureOwnerIsSuperAdmin } from "./admin-management.js";

describe("Audit Log System", () => {
  beforeAll(async () => {
    // Ensure owner is super admin
    await ensureOwnerIsSuperAdmin();
  });

  it("should log audit actions with all required fields", async () => {
    // Create a test admin
    const [result] = await db.insert(admins).values({
      openId: "test-admin-audit-1",
      email: "audit-test@example.com",
      name: "Audit Test Admin",
      role: "super_admin",
      createdBy: null,
    });

    const adminId = result.insertId;

    // Log an audit action
    await logAuditAction({
      adminId,
      adminEmail: "audit-test@example.com",
      adminName: "Audit Test Admin",
      action: "create",
      resourceType: "registration",
      resourceId: 123,
      details: { field: "test", value: "test value" },
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0",
    });

    // Verify audit log was created
    const logs = await db.select().from(auditLogs).where(eq(auditLogs.adminId, adminId));
    expect(logs.length).toBeGreaterThan(0);

    const log = logs[0];
    expect(log.adminId).toBe(adminId);
    expect(log.adminEmail).toBe("audit-test@example.com");
    expect(log.action).toBe("create");
    expect(log.resourceType).toBe("registration");
    expect(log.resourceId).toBe(123);
    expect(log.ipAddress).toBe("192.168.1.1");

    // Cleanup
    await db.delete(auditLogs).where(eq(auditLogs.adminId, adminId));
    await db.delete(admins).where(eq(admins.id, adminId));
  });

  it("should handle system actions with null adminId", async () => {
    await logAuditAction({
      adminId: null,
      adminEmail: null,
      adminName: null,
      action: "system_cleanup",
      resourceType: "system",
      resourceId: null,
      details: { message: "Automated cleanup" },
      ipAddress: null,
      userAgent: null,
    });

    const logs = await db.select().from(auditLogs).where(eq(auditLogs.action, "system_cleanup"));
    expect(logs.length).toBeGreaterThan(0);

    // Cleanup
    await db.delete(auditLogs).where(eq(auditLogs.action, "system_cleanup"));
  });

  it("should track multiple actions by the same admin", async () => {
    const [result] = await db.insert(admins).values({
      openId: "test-admin-audit-2",
      email: "audit-multi@example.com",
      name: "Multi Action Admin",
      role: "moderator",
      createdBy: null,
    });

    const adminId = result.insertId;

    // Log multiple actions
    await logAuditAction({
      adminId,
      adminEmail: "audit-multi@example.com",
      adminName: "Multi Action Admin",
      action: "create",
      resourceType: "session",
      resourceId: 1,
      details: {},
      ipAddress: "192.168.1.2",
      userAgent: "Chrome",
    });

    await logAuditAction({
      adminId,
      adminEmail: "audit-multi@example.com",
      adminName: "Multi Action Admin",
      action: "update",
      resourceType: "session",
      resourceId: 1,
      details: {},
      ipAddress: "192.168.1.2",
      userAgent: "Chrome",
    });

    await logAuditAction({
      adminId,
      adminEmail: "audit-multi@example.com",
      adminName: "Multi Action Admin",
      action: "delete",
      resourceType: "session",
      resourceId: 1,
      details: {},
      ipAddress: "192.168.1.2",
      userAgent: "Chrome",
    });

    const logs = await db.select().from(auditLogs).where(eq(auditLogs.adminId, adminId));
    expect(logs.length).toBe(3);
    expect(logs.map((l) => l.action)).toContain("create");
    expect(logs.map((l) => l.action)).toContain("update");
    expect(logs.map((l) => l.action)).toContain("delete");

    // Cleanup
    await db.delete(auditLogs).where(eq(auditLogs.adminId, adminId));
    await db.delete(admins).where(eq(admins.id, adminId));
  });
});

describe("Multi-Admin Support", () => {
  beforeAll(async () => {
    // Ensure owner is super admin
    await ensureOwnerIsSuperAdmin();
  });

  it("should create admin with different roles", async () => {
    const roles = ["super_admin", "moderator", "viewer"] as const;

    for (const role of roles) {
      const [result] = await db.insert(admins).values({
        openId: `test-admin-${role}`,
        email: `${role}@example.com`,
        name: `${role} Admin`,
        role,
        createdBy: null,
      });

      const adminId = result.insertId;
      const admin = await getAdminByOpenId(`test-admin-${role}`);

      expect(admin).not.toBeNull();
      expect(admin?.role).toBe(role);

      // Cleanup
      await db.delete(admins).where(eq(admins.id, adminId));
    }
  });

  it("should return correct permissions for super_admin", () => {
    const permissions = getRolePermissions("super_admin");

    expect(permissions.canCreate).toBe(true);
    expect(permissions.canUpdate).toBe(true);
    expect(permissions.canDelete).toBe(true);
    expect(permissions.canExport).toBe(true);
    expect(permissions.canManageAdmins).toBe(true);
    expect(permissions.canViewAuditLog).toBe(true);
  });

  it("should return correct permissions for moderator", () => {
    const permissions = getRolePermissions("moderator");

    expect(permissions.canCreate).toBe(true);
    expect(permissions.canUpdate).toBe(true);
    expect(permissions.canDelete).toBe(false); // Moderators cannot delete
    expect(permissions.canExport).toBe(true);
    expect(permissions.canManageAdmins).toBe(false); // Cannot manage admins
    expect(permissions.canViewAuditLog).toBe(true);
  });

  it("should return correct permissions for viewer", () => {
    const permissions = getRolePermissions("viewer");

    expect(permissions.canCreate).toBe(false);
    expect(permissions.canUpdate).toBe(false);
    expect(permissions.canDelete).toBe(false);
    expect(permissions.canExport).toBe(true); // Can export for reporting
    expect(permissions.canManageAdmins).toBe(false);
    expect(permissions.canViewAuditLog).toBe(true);
  });

  it("should check specific permissions for admin", async () => {
    // Create moderator
    const [result] = await db.insert(admins).values({
      openId: "test-moderator-perm",
      email: "moderator-perm@example.com",
      name: "Moderator Permission Test",
      role: "moderator",
      createdBy: null,
    });

    const adminId = result.insertId;

    // Check permissions
    const canCreate = await hasPermission("test-moderator-perm", "canCreate");
    const canDelete = await hasPermission("test-moderator-perm", "canDelete");
    const canManageAdmins = await hasPermission("test-moderator-perm", "canManageAdmins");

    expect(canCreate).toBe(true);
    expect(canDelete).toBe(false);
    expect(canManageAdmins).toBe(false);

    // Cleanup
    await db.delete(admins).where(eq(admins.id, adminId));
  });

  it("should return null for non-existent admin", async () => {
    const admin = await getAdminByOpenId("non-existent-admin-12345");
    expect(admin).toBeNull();
  });

  it("should return false for permissions of non-existent admin", async () => {
    const canCreate = await hasPermission("non-existent-admin-12345", "canCreate");
    expect(canCreate).toBe(false);
  });

  it("should ensure owner is always super admin", async () => {
    const ownerOpenId = process.env.OWNER_OPEN_ID;
    if (!ownerOpenId) {
      console.warn("OWNER_OPEN_ID not set, skipping test");
      return;
    }

    await ensureOwnerIsSuperAdmin();

    const owner = await getAdminByOpenId(ownerOpenId);
    expect(owner).not.toBeNull();
    expect(owner?.role).toBe("super_admin");
  });

  it("should track admin creation with createdBy field", async () => {
    // Create first admin (creator)
    const [creatorResult] = await db.insert(admins).values({
      openId: "test-creator-admin",
      email: "creator@example.com",
      name: "Creator Admin",
      role: "super_admin",
      createdBy: null,
    });

    const creatorId = creatorResult.insertId;

    // Create second admin (created by first)
    const [createdResult] = await db.insert(admins).values({
      openId: "test-created-admin",
      email: "created@example.com",
      name: "Created Admin",
      role: "moderator",
      createdBy: "test-creator-admin",
    });

    const createdId = createdResult.insertId;

    const [createdAdmin] = await db.select().from(admins).where(eq(admins.id, createdId));
    expect(createdAdmin.createdBy).toBe("test-creator-admin");

    // Cleanup
    await db.delete(admins).where(eq(admins.id, createdId));
    await db.delete(admins).where(eq(admins.id, creatorId));
  });
});

describe("Audit Log + Multi-Admin Integration", () => {
  it("should log admin management actions", async () => {
    // Create super admin
    const [superAdminResult] = await db.insert(admins).values({
      openId: "test-super-admin-integration",
      email: "super-integration@example.com",
      name: "Super Admin Integration",
      role: "super_admin",
      createdBy: null,
    });

    const superAdminId = superAdminResult.insertId;

    // Log admin creation action
    await logAuditAction({
      adminId: superAdminId,
      adminEmail: "super-integration@example.com",
      adminName: "Super Admin Integration",
      action: "create",
      resourceType: "admin",
      resourceId: superAdminId,
      details: { role: "super_admin" },
      ipAddress: "192.168.1.10",
      userAgent: "Integration Test",
    });

    // Create new admin
    const [newAdminResult] = await db.insert(admins).values({
      openId: "test-new-admin-integration",
      email: "new-integration@example.com",
      name: "New Admin Integration",
      role: "viewer",
      createdBy: "test-super-admin-integration",
    });

    const newAdminId = newAdminResult.insertId;

    // Log new admin creation
    await logAuditAction({
      adminId: superAdminId,
      adminEmail: "super-integration@example.com",
      adminName: "Super Admin Integration",
      action: "create",
      resourceType: "admin",
      resourceId: newAdminId,
      details: { newAdmin: { openId: "test-new-admin-integration", role: "viewer" } },
      ipAddress: "192.168.1.10",
      userAgent: "Integration Test",
    });

    // Verify audit logs
    const logs = await db.select().from(auditLogs).where(eq(auditLogs.adminId, superAdminId));
    expect(logs.length).toBeGreaterThanOrEqual(2);

    const adminCreationLogs = logs.filter((l) => l.resourceType === "admin");
    expect(adminCreationLogs.length).toBeGreaterThanOrEqual(2);

    // Cleanup
    await db.delete(auditLogs).where(eq(auditLogs.adminId, superAdminId));
    await db.delete(admins).where(eq(admins.id, newAdminId));
    await db.delete(admins).where(eq(admins.id, superAdminId));
  });

  it("should log VIP status changes with admin info", async () => {
    // Create admin
    const [adminResult] = await db.insert(admins).values({
      openId: "test-vip-admin",
      email: "vip-admin@example.com",
      name: "VIP Admin",
      role: "moderator",
      createdBy: null,
    });

    const adminId = adminResult.insertId;

    // Create test registration
    const [regResult] = await db.insert(registrations).values({
      fullNameEnglish: "Test VIP User",
      fullNameArabic: "مستخدم VIP اختبار",
      email: "vip-user@example.com",
      phone: "+1234567890",
      affiliation: "Test University",
      attendeeCategory: "student",
      participationType: "attendee",
      isVIP: false,
    });

    const registrationId = regResult.insertId;

    // Log VIP status change
    await logAuditAction({
      adminId,
      adminEmail: "vip-admin@example.com",
      adminName: "VIP Admin",
      action: "update",
      resourceType: "registration",
      resourceId: registrationId,
      details: { field: "isVIP", newValue: true },
      ipAddress: "192.168.1.11",
      userAgent: "VIP Test",
    });

    // Update VIP status
    await db.update(registrations).set({ isVIP: true }).where(eq(registrations.id, registrationId));

    // Verify audit log
    const logs = await db.select().from(auditLogs).where(eq(auditLogs.adminId, adminId));
    expect(logs.length).toBeGreaterThan(0);

    const vipLog = logs.find((l) => l.resourceType === "registration" && l.resourceId === registrationId);
    expect(vipLog).not.toBeUndefined();
    expect(vipLog?.action).toBe("update");

    // Cleanup
    await db.delete(auditLogs).where(eq(auditLogs.adminId, adminId));
    await db.delete(registrations).where(eq(registrations.id, registrationId));
    await db.delete(admins).where(eq(admins.id, adminId));
  });
});
