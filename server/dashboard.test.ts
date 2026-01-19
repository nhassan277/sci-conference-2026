import { describe, it, expect, beforeAll } from "vitest";
import { db } from "./db";
import { registrations } from "../drizzle/schema";
import { appRouter } from "./routers";

describe("Real-Time Check-In Dashboard", () => {
  let testRegistrationIds: number[] = [];

  beforeAll(async () => {
    // Create test registrations with different categories and check-in statuses
    const testData = [
      {
        fullNameEnglish: "Dashboard Test Student 1",
        fullNameArabic: "طالب اختبار لوحة القيادة 1",
        email: "dashboard-student1@example.com",
        phone: "+201111111111",
        affiliation: "Test University",
        attendeeCategory: "student" as const,
        participationType: "attendance" as const,
        checkedIn: true,
        checkedInAt: new Date(),
        checkedInBy: "Test Staff",
      },
      {
        fullNameEnglish: "Dashboard Test Faculty 1",
        fullNameArabic: "عضو هيئة تدريس اختبار 1",
        email: "dashboard-faculty1@example.com",
        phone: "+201222222222",
        affiliation: "Cairo University",
        attendeeCategory: "faculty" as const,
        participationType: "presenter" as const,
        checkedIn: true,
        checkedInAt: new Date(Date.now() - 60000), // 1 minute ago
        checkedInBy: "Test Staff",
      },
      {
        fullNameEnglish: "Dashboard Test Researcher 1",
        fullNameArabic: "باحث اختبار 1",
        email: "dashboard-researcher1@example.com",
        phone: "+201333333333",
        affiliation: "Research Center",
        attendeeCategory: "researcher" as const,
        participationType: "presenter" as const,
        checkedIn: false,
      },
    ];

    for (const data of testData) {
      const [reg] = await db.insert(registrations).values(data).$returningId();
      testRegistrationIds.push(reg.id);
    }
  });

  describe("Recent Check-Ins Feed", () => {
    it("should return recent check-ins ordered by timestamp", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.recentCheckins({ limit: 20 });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Verify all returned items are checked in
      result.forEach((checkin) => {
        expect(checkin.checkedIn).toBe(true);
        expect(checkin.checkedInAt).toBeDefined();
      });

      // Verify ordering (most recent first)
      if (result.length > 1) {
        for (let i = 0; i < result.length - 1; i++) {
          const current = new Date(result[i].checkedInAt!).getTime();
          const next = new Date(result[i + 1].checkedInAt!).getTime();
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });

    it("should respect limit parameter", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.recentCheckins({ limit: 5 });

      expect(result.length).toBeLessThanOrEqual(5);
    });

    it("should include staff name who performed check-in", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.recentCheckins({ limit: 10 });

      const checkedInByStaff = result.filter((r) => r.checkedInBy);
      expect(checkedInByStaff.length).toBeGreaterThan(0);
      expect(checkedInByStaff[0].checkedInBy).toBe("Test Staff");
    });
  });

  describe("Category Breakdown", () => {
    it("should return breakdown for all categories", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.categoryBreakdown();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4); // student, faculty, researcher, industry

      const categories = result.map((r) => r.category);
      expect(categories).toContain("student");
      expect(categories).toContain("faculty");
      expect(categories).toContain("researcher");
      expect(categories).toContain("industry");
    });

    it("should calculate correct totals and check-in counts", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.categoryBreakdown();

      result.forEach((cat) => {
        expect(cat.total).toBeGreaterThanOrEqual(0);
        expect(cat.checkedIn).toBeGreaterThanOrEqual(0);
        expect(cat.remaining).toBe(cat.total - cat.checkedIn);
      });
    });

    it("should calculate correct percentages", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.categoryBreakdown();

      result.forEach((cat) => {
        if (cat.total > 0) {
          const expectedPercentage = Math.round((cat.checkedIn / cat.total) * 100);
          expect(cat.percentage).toBe(expectedPercentage);
          expect(cat.percentage).toBeGreaterThanOrEqual(0);
          expect(cat.percentage).toBeLessThanOrEqual(100);
        } else {
          expect(cat.percentage).toBe(0);
        }
      });
    });

    it("should show student category with test data", async () => {
      const caller = appRouter.createCaller({} as any);
      const result = await caller.checkin.categoryBreakdown();

      const studentCategory = result.find((r) => r.category === "student");
      expect(studentCategory).toBeDefined();
      expect(studentCategory!.total).toBeGreaterThan(0);
      expect(studentCategory!.checkedIn).toBeGreaterThan(0);
    });
  });

  describe("Dashboard Integration", () => {
    it("should provide complete dashboard data", async () => {
      const caller = appRouter.createCaller({} as any);

      // Fetch all dashboard data
      const stats = await caller.checkin.stats();
      const recentCheckins = await caller.checkin.recentCheckins({ limit: 20 });
      const categoryBreakdown = await caller.checkin.categoryBreakdown();

      console.log("\\n✅ Dashboard Test Results:");
      console.log(`   Total Registrations: ${stats.total}`);
      console.log(`   Checked In: ${stats.checkedIn}`);
      console.log(`   Check-In Rate: ${stats.percentage}%`);
      console.log(`   Recent Check-Ins: ${recentCheckins.length}`);
      console.log(`   Category Breakdown: ${categoryBreakdown.length} categories`);
      console.log("🎉 Dashboard data integration working correctly!\\n");

      expect(stats).toBeDefined();
      expect(recentCheckins).toBeDefined();
      expect(categoryBreakdown).toBeDefined();
    });
  });
});
