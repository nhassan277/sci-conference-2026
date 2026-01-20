import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers.js";
import { db } from "./db.js";
import { registrations } from "../drizzle/schema.js";
import { generateToken } from "./auth.js";

describe("Admin Access Control Integration Tests", () => {
  let testRegistrationId: number;
  const ownerOpenId = process.env.OWNER_OPEN_ID || "Btow8urowKxdc3eQC9KNxc";
  const nonOwnerOpenId = "non-owner-open-id-123";

  // Create admin context (owner)
  const createAdminContext = () => {
    const token = generateToken({
      openId: ownerOpenId,
      name: "Admin User",
      email: "admin@test.com",
    });

    return {
      user: {
        openId: ownerOpenId,
        name: "Admin User",
        email: "admin@test.com",
      },
      req: {
        cookies: {
          auth_token: token,
        },
      },
    };
  };

  // Create non-admin context (regular user)
  const createNonAdminContext = () => {
    const token = generateToken({
      openId: nonOwnerOpenId,
      name: "Regular User",
      email: "user@test.com",
    });

    return {
      user: {
        openId: nonOwnerOpenId,
        name: "Regular User",
        email: "user@test.com",
      },
      req: {
        cookies: {
          auth_token: token,
        },
      },
    };
  };

  // Create unauthenticated context
  const createUnauthenticatedContext = () => {
    return {
      user: null,
      req: {
        cookies: {},
      },
    };
  };

  beforeAll(async () => {
    // Create a test registration
    const [result] = await db.insert(registrations).values({
      fullNameEnglish: "Test Admin Access",
      fullNameArabic: "اختبار الوصول للمسؤول",
      email: "admin-test@test.com",
      phone: "+201234567890",
      affiliation: "Test University",
      attendeeCategory: "student",
      participationType: "attendee",
      wantsCertificate: false,
    });

    testRegistrationId = result.insertId;
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(registrations).where({ id: testRegistrationId } as any);
  });

  describe("Admin Endpoints - Authorized Access", () => {
    it("should allow admin to list registrations", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.registration.list();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should allow admin to get registration by ID", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.registration.getById({ id: testRegistrationId });

      expect(result).toBeDefined();
      expect(result.id).toBe(testRegistrationId);
      expect(result.email).toBe("admin-test@test.com");
    });

    it("should allow admin to update VIP status", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.registration.updateVIPStatus({
        id: testRegistrationId,
        isVIP: true,
      });

      expect(result.success).toBe(true);

      // Verify the update
      const updated = await caller.registration.getById({ id: testRegistrationId });
      expect(updated.isVIP).toBe(true);
    });

    it("should allow admin to access check-in stats", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.checkin.stats();

      expect(result).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.checkedIn).toBeGreaterThanOrEqual(0);
    });

    it("should allow admin to list sponsorships", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.sponsorship.list();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow admin to list sessions", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.session.list();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow admin to list support tickets", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.supportTicket.list();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Admin Endpoints - Unauthorized Access (Non-Admin User)", () => {
    it("should deny non-admin access to list registrations", async () => {
      const caller = appRouter.createCaller(createNonAdminContext());

      await expect(caller.registration.list()).rejects.toThrow("Admin access required");
    });

    it("should deny non-admin access to get registration by ID", async () => {
      const caller = appRouter.createCaller(createNonAdminContext());

      await expect(
        caller.registration.getById({ id: testRegistrationId })
      ).rejects.toThrow("Admin access required");
    });

    it("should deny non-admin access to update VIP status", async () => {
      const caller = appRouter.createCaller(createNonAdminContext());

      await expect(
        caller.registration.updateVIPStatus({
          id: testRegistrationId,
          isVIP: true,
        })
      ).rejects.toThrow("Admin access required");
    });

    it("should deny non-admin access to check-in stats", async () => {
      const caller = appRouter.createCaller(createNonAdminContext());

      await expect(caller.checkin.stats()).rejects.toThrow("Admin access required");
    });

    it("should deny non-admin access to list sponsorships", async () => {
      const caller = appRouter.createCaller(createNonAdminContext());

      await expect(caller.sponsorship.list()).rejects.toThrow("Admin access required");
    });

    it("should deny non-admin access to list support tickets", async () => {
      const caller = appRouter.createCaller(createNonAdminContext());

      await expect(caller.supportTicket.list()).rejects.toThrow("Admin access required");
    });
  });

  describe("Admin Endpoints - Unauthenticated Access", () => {
    it("should deny unauthenticated access to list registrations", async () => {
      const caller = appRouter.createCaller(createUnauthenticatedContext());

      await expect(caller.registration.list()).rejects.toThrow("Authentication required");
    });

    it("should deny unauthenticated access to get registration by ID", async () => {
      const caller = appRouter.createCaller(createUnauthenticatedContext());

      await expect(
        caller.registration.getById({ id: testRegistrationId })
      ).rejects.toThrow("Authentication required");
    });

    it("should deny unauthenticated access to update VIP status", async () => {
      const caller = appRouter.createCaller(createUnauthenticatedContext());

      await expect(
        caller.registration.updateVIPStatus({
          id: testRegistrationId,
          isVIP: true,
        })
      ).rejects.toThrow("Authentication required");
    });

    it("should deny unauthenticated access to check-in stats", async () => {
      const caller = appRouter.createCaller(createUnauthenticatedContext());

      await expect(caller.checkin.stats()).rejects.toThrow("Authentication required");
    });
  });

  describe("Public Endpoints - Should Remain Accessible", () => {
    it("should allow anyone to create a registration", async () => {
      const caller = appRouter.createCaller(createUnauthenticatedContext());

      const result = await caller.registration.create({
        fullNameEnglish: "Public Test User",
        fullNameArabic: "مستخدم اختبار عام",
        email: "public@test.com",
        phone: "+201234567899",
        affiliation: "Public University",
        attendeeCategory: "student",
        participationType: "attendee",
        wantsCertificate: false,
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();

      // Clean up
      await db.delete(registrations).where({ id: result.id } as any);
    });

    it("should allow anyone to create a sponsorship inquiry", async () => {
      const caller = appRouter.createCaller(createUnauthenticatedContext());

      const result = await caller.sponsorship.create({
        companyName: "Test Company",
        contactPerson: "Test Contact",
        email: "sponsor@test.com",
        phone: "+201234567899",
        packageType: "gold",
        companyWebsite: "https://test.com",
        message: "Test message",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });

    it("should allow anyone to list sessions", async () => {
      const caller = appRouter.createCaller(createUnauthenticatedContext());
      const result = await caller.session.list();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow anyone to create a support ticket", async () => {
      const caller = appRouter.createCaller(createUnauthenticatedContext());

      const result = await caller.supportTicket.create({
        name: "Test User",
        email: "support@test.com",
        subject: "Test Subject",
        message: "Test message",
        priority: "normal",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });
});
