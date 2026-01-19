import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers.js";
import { db } from "./db.js";
import { registrations } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

describe("VIP Management Integration Tests", () => {
  let testRegistrationId: number;

  beforeAll(async () => {
    // Create a test registration
    const [result] = await db.insert(registrations).values({
      fullNameEnglish: "Test VIP User",
      fullNameArabic: "مستخدم VIP تجريبي",
      email: "vip.test@example.com",
      phone: "+201234567890",
      affiliation: "Cairo University",
      attendeeCategory: "faculty",
      participationType: "presenter",
      wantsCertificate: true,
      isVIP: false,
    });
    testRegistrationId = result.insertId;
  });

  it("should toggle VIP status from false to true", async () => {
    const caller = appRouter.createCaller({});

    // Update VIP status to true
    const updateResult = await caller.registration.updateVIPStatus({
      id: testRegistrationId,
      isVIP: true,
    });

    expect(updateResult.success).toBe(true);

    // Verify the update in database
    const [updated] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, testRegistrationId));

    expect(updated.isVIP).toBe(true);
  });

  it("should toggle VIP status from true to false", async () => {
    const caller = appRouter.createCaller({});

    // Update VIP status to false
    const updateResult = await caller.registration.updateVIPStatus({
      id: testRegistrationId,
      isVIP: false,
    });

    expect(updateResult.success).toBe(true);

    // Verify the update in database
    const [updated] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, testRegistrationId));

    expect(updated.isVIP).toBe(false);
  });

  it("should list registrations with VIP status", async () => {
    const caller = appRouter.createCaller({});

    // Set registration as VIP
    await caller.registration.updateVIPStatus({
      id: testRegistrationId,
      isVIP: true,
    });

    // List all registrations
    const registrationsList = await caller.registration.list();

    // Find our test registration
    const testReg = registrationsList.find((r) => r.id === testRegistrationId);

    expect(testReg).toBeDefined();
    expect(testReg?.isVIP).toBe(true);
    expect(testReg?.fullNameEnglish).toBe("Test VIP User");
  });

  it("should filter VIP registrations correctly", async () => {
    const caller = appRouter.createCaller({});

    // Create another non-VIP registration
    const [result] = await db.insert(registrations).values({
      fullNameEnglish: "Non-VIP User",
      fullNameArabic: "مستخدم عادي",
      email: "nonvip.test@example.com",
      phone: "+201234567891",
      affiliation: "Cairo University",
      attendeeCategory: "student",
      participationType: "attendee",
      wantsCertificate: false,
      isVIP: false,
    });

    // List all registrations
    const allRegistrations = await caller.registration.list();

    // Filter VIP registrations (client-side filtering simulation)
    const vipRegistrations = allRegistrations.filter((r) => r.isVIP);
    const nonVipRegistrations = allRegistrations.filter((r) => !r.isVIP);

    expect(vipRegistrations.length).toBeGreaterThan(0);
    expect(nonVipRegistrations.length).toBeGreaterThan(0);

    // Verify VIP registration is in VIP list
    const vipReg = vipRegistrations.find((r) => r.id === testRegistrationId);
    expect(vipReg).toBeDefined();
    expect(vipReg?.isVIP).toBe(true);

    // Verify non-VIP registration is not in VIP list
    const nonVipInVipList = vipRegistrations.find((r) => r.id === result.insertId);
    expect(nonVipInVipList).toBeUndefined();
  });

  it("should count VIP registrations correctly", async () => {
    const caller = appRouter.createCaller({});

    // List all registrations
    const allRegistrations = await caller.registration.list();

    // Count VIP registrations
    const vipCount = allRegistrations.filter((r) => r.isVIP).length;

    expect(vipCount).toBeGreaterThan(0);
    expect(typeof vipCount).toBe("number");
  });

  it("should handle VIP check-in with email alert", async () => {
    const caller = appRouter.createCaller({});

    // Ensure registration is VIP
    await caller.registration.updateVIPStatus({
      id: testRegistrationId,
      isVIP: true,
    });

    // Perform check-in
    const checkInResult = await caller.checkin.markCheckedIn({
      registrationId: testRegistrationId,
      staffName: "Test Staff",
    });

    expect(checkInResult.success).toBe(true);

    // Verify check-in status
    const [checkedInReg] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, testRegistrationId));

    expect(checkedInReg.checkedIn).toBe(true);
    expect(checkedInReg.checkedInBy).toBe("Test Staff");
    expect(checkedInReg.checkedInAt).toBeDefined();
    expect(checkedInReg.isVIP).toBe(true);

    // Note: Email alert is sent automatically in the check-in process
    // The email notification is tested in the check-in process itself
  });
});
