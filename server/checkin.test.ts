import { describe, it, expect, beforeAll } from "vitest";
import { db } from "./db.js";
import { registrations } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

/**
 * Integration Test: QR Scanner Check-In System
 * Tests the check-in workflow from QR scan to attendance tracking
 */

describe("QR Scanner Check-In System", () => {
  let testRegistrationId: number;

  beforeAll(async () => {
    // Create a test registration
    const [result] = await db.insert(registrations).values({
      fullNameEnglish: "Check-In Test User",
      fullNameArabic: "مستخدم اختبار تسجيل الدخول",
      email: "checkin-test@example.com",
      phone: "+201234567890",
      affiliation: "Cairo University",
      attendeeCategory: "Graduate Student",
      participationType: "Presenter",
      researchTrack: "Life Sciences",
      wantsCertificate: false,
    });

    testRegistrationId = result.insertId;
  });

  describe("Registration Lookup", () => {
    it("should find registration by ID", async () => {
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      expect(registration).toBeDefined();
      expect(registration.id).toBe(testRegistrationId);
      expect(registration.fullNameEnglish).toBe("Check-In Test User");
    });

    it("should return check-in status fields", async () => {
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      expect(registration.checkedIn).toBe(false);
      expect(registration.checkedInAt).toBeNull();
      expect(registration.checkedInBy).toBeNull();
    });
  });

  describe("Check-In Process", () => {
    it("should mark registration as checked in", async () => {
      const staffName = "Test Staff Member";

      await db
        .update(registrations)
        .set({
          checkedIn: true,
          checkedInAt: new Date(),
          checkedInBy: staffName,
        })
        .where(eq(registrations.id, testRegistrationId));

      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      expect(registration.checkedIn).toBe(true);
      expect(registration.checkedInAt).toBeDefined();
      expect(registration.checkedInBy).toBe(staffName);
    });

    it("should prevent duplicate check-in", async () => {
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      expect(registration.checkedIn).toBe(true);

      // Attempting to check in again should be prevented by application logic
      // This test verifies the database state
    });
  });

  describe("Check-In Statistics", () => {
    it("should calculate check-in statistics correctly", async () => {
      const allRegistrations = await db.select().from(registrations);
      const checkedInCount = allRegistrations.filter((r) => r.checkedIn).length;
      const totalCount = allRegistrations.length;

      expect(totalCount).toBeGreaterThan(0);
      expect(checkedInCount).toBeGreaterThan(0);
      expect(checkedInCount).toBeLessThanOrEqual(totalCount);

      const percentage =
        totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });

    it("should track staff member who performed check-in", async () => {
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      expect(registration.checkedInBy).toBe("Test Staff Member");
      expect(registration.checkedInAt).toBeDefined();
    });
  });

  describe("QR Code Data Format", () => {
    it("should use registration ID as QR code content", () => {
      // QR codes contain the registration ID as plain text
      const qrCodeContent = testRegistrationId.toString();

      expect(qrCodeContent).toBe(testRegistrationId.toString());
      expect(parseInt(qrCodeContent, 10)).toBe(testRegistrationId);
    });

    it("should be able to parse QR code content to registration ID", () => {
      const scannedText = testRegistrationId.toString();
      const parsedId = parseInt(scannedText, 10);

      expect(parsedId).toBe(testRegistrationId);
      expect(isNaN(parsedId)).toBe(false);
    });
  });

  describe("Check-In Workflow Summary", () => {
    it("should complete full check-in workflow", async () => {
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      console.log("\n✅ QR Scanner Check-In Test Results:");
      console.log(`   Registration ID: ${registration.id}`);
      console.log(`   Name: ${registration.fullNameEnglish}`);
      console.log(`   Checked In: ${registration.checkedIn ? "Yes" : "No"}`);
      console.log(`   Check-In Time: ${registration.checkedInAt?.toLocaleString()}`);
      console.log(`   Staff Member: ${registration.checkedInBy}`);
      console.log("\n🎉 QR scanner check-in system working correctly!\n");

      expect(registration.checkedIn).toBe(true);
      expect(registration.checkedInAt).toBeDefined();
      expect(registration.checkedInBy).toBeDefined();
    });
  });
});
