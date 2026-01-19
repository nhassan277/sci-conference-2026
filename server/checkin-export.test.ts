import { describe, it, expect, beforeAll } from "vitest";
import { db } from "./db";
import { registrations } from "../drizzle/schema";
import { appRouter } from "./routers";

describe("Check-In Export Functionality", () => {
  let testRegistrationId: number;

  beforeAll(async () => {
    // Create a test registration and mark it as checked in
    const [registration] = await db
      .insert(registrations)
      .values({
        fullNameEnglish: "Export Test User",
        fullNameArabic: "مستخدم اختبار التصدير",
        email: "export-test@example.com",
        phone: "+201234567890",
        affiliation: "Test University",
        attendeeCategory: "student",
        participationType: "attendance",
        checkedIn: true,
        checkedInAt: new Date(),
        checkedInBy: "Test Staff",
      })
      .$returningId();

    testRegistrationId = registration.id;
  });

  describe("Export Check-Ins API", () => {
    it("should export checked-in registrations as CSV", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.exportCheckins();

      expect(result).toBeDefined();
      expect(result.csv).toBeDefined();
      expect(result.filename).toBeDefined();
      expect(result.count).toBeGreaterThan(0);

      // Verify CSV format
      const lines = result.csv.split("\n");
      expect(lines.length).toBeGreaterThan(1); // At least header + 1 data row

      // Verify headers
      const headers = lines[0];
      expect(headers).toContain("ID");
      expect(headers).toContain("Full Name (English)");
      expect(headers).toContain("Email");
      expect(headers).toContain("Checked In At");
      expect(headers).toContain("Checked In By");

      // Verify data row contains test user
      const dataRows = lines.slice(1).join("\n");
      expect(dataRows).toContain("Export Test User");
      expect(dataRows).toContain("export-test@example.com");
      expect(dataRows).toContain("Test Staff");
    });

    it("should include proper CSV formatting with quotes", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.exportCheckins();

      // Check that fields are quoted
      const lines = result.csv.split("\n");
      if (lines.length > 1) {
        const dataRow = lines[1]; // First data row
        expect(dataRow).toBeDefined();
        // Verify that data row has quoted fields
        expect(dataRow).toMatch(/^"/); // Starts with quote
        expect(dataRow).toContain('","'); // Contains comma-separated quoted fields
      }
    });

    it("should generate filename with current date", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.exportCheckins();

      const today = new Date().toISOString().split("T")[0];
      expect(result.filename).toContain(today);
      expect(result.filename).toContain("checkins");
      expect(result.filename.endsWith(".csv")).toBe(true);
    });

    it("should return correct count of checked-in registrations", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.exportCheckins();

      // Count actual checked-in registrations
      const allRegs = await db.select().from(registrations);
      const checkedInCount = allRegs.filter((r) => r.checkedIn).length;

      expect(result.count).toBe(checkedInCount);
    });
  });

  describe("CSV Export Summary", () => {
    it("should complete full export workflow", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.exportCheckins();

      console.log("\\n✅ Check-In Export Test Results:");
      console.log(`   Total Check-Ins Exported: ${result.count}`);
      console.log(`   Filename: ${result.filename}`);
      console.log(`   CSV Lines: ${result.csv.split("\n").length}`);
      console.log(`   Test Registration ID: ${testRegistrationId}`);
      console.log("🎉 Check-in export functionality working correctly!\\n");

      expect(result.count).toBeGreaterThan(0);
    });
  });
});
