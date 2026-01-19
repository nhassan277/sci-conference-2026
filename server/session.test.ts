import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers.js";
import { db } from "./db.js";
import { sessions } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

describe("Session Management API", () => {
  const caller = appRouter.createCaller({});
  let createdSessionId: number;

  // Clean up test data after all tests
  afterAll(async () => {
    if (createdSessionId) {
      await db.delete(sessions).where(eq(sessions.id, createdSessionId));
    }
  });

  it("should create a new session", async () => {
    const result = await caller.session.create({
      title: "Test Keynote Session",
      titleAr: "جلسة رئيسية تجريبية",
      description: "This is a test session for automated testing",
      sessionType: "keynote",
      track: "life-sciences",
      day: 1,
      startTime: "09:00",
      endTime: "10:00",
      location: "Main Hall",
      speakerName: "Dr. Test Speaker",
      speakerTitle: "Professor",
      speakerAffiliation: "Test University",
      speakerBio: "Test bio for speaker",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.message).toBe("Session created successfully");
    
    createdSessionId = result.id;
  });

  it("should list all sessions", async () => {
    const sessions = await caller.session.list();
    
    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBeGreaterThan(0);
    
    const testSession = sessions.find((s) => s.id === createdSessionId);
    expect(testSession).toBeDefined();
    expect(testSession?.title).toBe("Test Keynote Session");
  });

  it("should get a session by ID", async () => {
    const session = await caller.session.getById({ id: createdSessionId });
    
    expect(session).toBeDefined();
    expect(session.id).toBe(createdSessionId);
    expect(session.title).toBe("Test Keynote Session");
    expect(session.titleAr).toBe("جلسة رئيسية تجريبية");
    expect(session.sessionType).toBe("keynote");
    expect(session.day).toBe(1);
  });

  it("should update a session", async () => {
    const result = await caller.session.update({
      id: createdSessionId,
      title: "Updated Test Session",
      location: "Hall B",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Session updated successfully");

    const updatedSession = await caller.session.getById({ id: createdSessionId });
    expect(updatedSession.title).toBe("Updated Test Session");
    expect(updatedSession.location).toBe("Hall B");
  });

  it("should validate time format", async () => {
    await expect(
      caller.session.create({
        title: "Invalid Time Session",
        titleAr: "جلسة وقت غير صالح",
        sessionType: "research",
        day: 1,
        startTime: "9:00", // Invalid format (should be 09:00)
        endTime: "10:00",
      })
    ).rejects.toThrow();
  });

  it("should validate day range", async () => {
    await expect(
      caller.session.create({
        title: "Invalid Day Session",
        titleAr: "جلسة يوم غير صالح",
        sessionType: "research",
        day: 3, // Invalid (should be 1 or 2)
        startTime: "09:00",
        endTime: "10:00",
      })
    ).rejects.toThrow();
  });

  it("should delete a session", async () => {
    const result = await caller.session.delete({ id: createdSessionId });
    
    expect(result.success).toBe(true);
    expect(result.message).toBe("Session deleted successfully");

    const deletedSession = await caller.session.getById({ id: createdSessionId });
    expect(deletedSession).toBeUndefined();
    
    // Clear the ID so afterAll doesn't try to delete again
    createdSessionId = 0;
  });
});
