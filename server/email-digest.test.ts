import { describe, it, expect, beforeAll } from "vitest";
import { db } from "./db.js";
import { registrations, admins, digestPreferences } from "../drizzle/schema.js";
import { calculateDigestMetrics, generateDigestEmail } from "./email-digest.js";

describe("Email Digest System", () => {
  let testAdminId: number;

  beforeAll(async () => {
    // Create a test admin
    const [admin] = await db
      .insert(admins)
      .values({
        openId: "test-digest-admin",
        email: "digest-admin@test.com",
        name: "Digest Test Admin",
        role: "super_admin",
        createdBy: "system",
      })
      .returning();

    testAdminId = admin.id;

    // Create test registrations
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    await db.insert(registrations).values([
      {
        fullName: "Recent Attendee 1",
        email: "recent1@test.com",
        affiliation: "Test University",
        category: "Graduate & Postgraduate Students",
        researchInterests: "AI",
        createdAt: now,
      },
      {
        fullName: "Recent Attendee 2",
        email: "recent2@test.com",
        affiliation: "Test Institute",
        category: "Faculty Members (Internal)",
        researchInterests: "ML",
        createdAt: yesterday,
      },
      {
        fullName: "Old Attendee",
        email: "old@test.com",
        affiliation: "Old University",
        category: "External Researchers",
        researchInterests: "Data Science",
        createdAt: lastWeek,
      },
    ]);
  });

  describe("Digest Data Generation", () => {
    it("should generate daily digest data correctly", async () => {
      const data = await calculateDigestMetrics("daily");

      expect(data).toHaveProperty("period");
      expect(data.period).toBe("daily");
      expect(data).toHaveProperty("totalRegistrations");
      expect(data).toHaveProperty("newRegistrations");
      expect(data).toHaveProperty("totalCheckIns");
      expect(data).toHaveProperty("newCheckIns");
      expect(data).toHaveProperty("vipCount");
      expect(data).toHaveProperty("categoryBreakdown");
      expect(data).toHaveProperty("recentRegistrations");
      expect(data).toHaveProperty("recentCheckIns");
      expect(data).toHaveProperty("insights");

      // Daily should include registrations from last 24 hours
      expect(data.newRegistrations).toBeGreaterThanOrEqual(1);
    });

    it("should generate weekly digest data correctly", async () => {
      const data = await calculateDigestMetrics("weekly");

      expect(data.period).toBe("weekly");
      expect(data).toHaveProperty("totalRegistrations");
      expect(data).toHaveProperty("newRegistrations");

      // Weekly should include registrations from last 7 days
      expect(data.newRegistrations).toBeGreaterThanOrEqual(2);
    });

    it("should calculate category breakdown correctly", async () => {
      const data = await calculateDigestMetrics("daily");

      expect(data.categoryBreakdown).toBeInstanceOf(Array);
      expect(data.categoryBreakdown.length).toBeGreaterThan(0);

      const totalCount = data.categoryBreakdown.reduce((sum, cat) => sum + cat.count, 0);
      expect(totalCount).toBe(data.totalRegistrations);
    });

    it("should limit recent registrations to 10", async () => {
      const data = await calculateDigestMetrics("daily");

      expect(data.recentRegistrations.length).toBeLessThanOrEqual(10);
    });

    it("should generate actionable insights", async () => {
      const data = await calculateDigestMetrics("daily");

      expect(data.insights).toBeInstanceOf(Array);
      expect(data.insights.length).toBeGreaterThan(0);

      // Should have at least registration trend insight
      const hasTrendInsight = data.insights.some((insight) =>
        insight.toLowerCase().includes("registration")
      );
      expect(hasTrendInsight).toBe(true);
    });
  });

  describe("Digest HTML Generation", () => {
    it("should generate valid HTML for daily digest", async () => {
      const data = await calculateDigestMetrics("daily");
      const html = generateDigestEmail(data);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html");
      expect(html).toContain("</html>");
      expect(html).toContain("Daily Conference Digest");
      expect(html).toContain(data.totalRegistrations.toString());
    });

    it("should generate valid HTML for weekly digest", async () => {
      const data = await calculateDigestMetrics("weekly");
      const html = generateDigestEmail(data);

      expect(html).toContain("Weekly Conference Digest");
      expect(html).toContain(data.totalRegistrations.toString());
    });

    it("should include all key sections in HTML", async () => {
      const data = await calculateDigestMetrics("daily");
      const html = generateDigestEmail(data);

      // Check for key sections
      expect(html).toContain("Key Metrics");
      expect(html).toContain("Category Breakdown");
      expect(html).toContain("Recent Registrations");
      expect(html).toContain("Actionable Insights");
    });

    it("should properly escape HTML in user data", async () => {
      // Create a registration with HTML-like content
      await db.insert(registrations).values({
        fullName: "<script>alert('xss')</script>",
        email: "xss@test.com",
        affiliation: "Test <b>University</b>",
        category: "Graduate & Postgraduate Students",
        researchInterests: "AI",
      });

      const data = await calculateDigestMetrics("daily");
      const html = generateDigestEmail(data);

      // Should not contain unescaped script tags
      expect(html).not.toContain("<script>alert");
      // Should contain escaped version
      expect(html).toContain("&lt;script&gt;");
    });
  });

  describe("Digest Preferences", () => {
    it("should create digest preferences", async () => {
      await db.insert(digestPreferences).values({
        adminId: testAdminId,
        email: "digest-admin@test.com",
        frequency: "daily",
        enabled: true,
      });

      const [pref] = await db
        .select()
        .from(digestPreferences)
        .where((t) => t.adminId === testAdminId)
        .limit(1);

      expect(pref).toBeDefined();
      expect(pref.frequency).toBe("daily");
      expect(pref.enabled).toBe(true);
    });

    it("should update digest preferences", async () => {
      const { eq } = await import("drizzle-orm");

      await db
        .update(digestPreferences)
        .set({ frequency: "weekly", enabled: false })
        .where(eq(digestPreferences.adminId, testAdminId));

      const [pref] = await db
        .select()
        .from(digestPreferences)
        .where(eq(digestPreferences.adminId, testAdminId))
        .limit(1);

      expect(pref.frequency).toBe("weekly");
      expect(pref.enabled).toBe(false);
    });
  });

  describe("Digest Metrics Accuracy", () => {
    it("should correctly count VIP attendees", async () => {
      // Create a VIP registration
      await db.insert(registrations).values({
        fullName: "VIP Attendee",
        email: "vip@test.com",
        affiliation: "VIP Organization",
        category: "Industry Partners",
        researchInterests: "Innovation",
        isVIP: true,
      });

      const data = await calculateDigestMetrics("daily");
      expect(data.vipCount).toBeGreaterThan(0);
    });

    it("should calculate check-in rate correctly", async () => {
      const data = await calculateDigestMetrics("daily");

      if (data.totalRegistrations > 0) {
        const expectedRate = (data.totalCheckIns / data.totalRegistrations) * 100;
        expect(Math.abs(data.checkInRate - expectedRate)).toBeLessThan(0.01);
      }
    });

    it("should track new vs total correctly", async () => {
      const data = await calculateDigestMetrics("daily");

      expect(data.newRegistrations).toBeLessThanOrEqual(data.totalRegistrations);
      expect(data.newCheckIns).toBeLessThanOrEqual(data.totalCheckIns);
    });
  });
});
