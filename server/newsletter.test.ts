import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers.js";
import { db } from "./db.js";
import { newsletterSubscriptions } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

describe("Newsletter Subscription", () => {
  const caller = appRouter.createCaller({ req: {} });

  const testEmail = `test-${Date.now()}@example.com`;
  const testName = "Test User";

  it("should subscribe a new email", async () => {
    const result = await caller.newsletter.subscribe({
      email: testEmail,
      name: testName,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("Successfully subscribed");

    // Verify in database
    const subscription = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, testEmail))
      .limit(1);

    expect(subscription.length).toBe(1);
    expect(subscription[0].email).toBe(testEmail);
    expect(subscription[0].name).toBe(testName);
    expect(subscription[0].isActive).toBe(true);
  });

  it("should return success message for already subscribed email", async () => {
    const result = await caller.newsletter.subscribe({
      email: testEmail,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("already subscribed");
  });

  it("should unsubscribe an email", async () => {
    const result = await caller.newsletter.unsubscribe({
      email: testEmail,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("unsubscribed");

    // Verify in database
    const subscription = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, testEmail))
      .limit(1);

    expect(subscription.length).toBe(1);
    expect(subscription[0].isActive).toBe(false);
    expect(subscription[0].unsubscribedAt).not.toBeNull();
  });

  it("should resubscribe a previously unsubscribed email", async () => {
    const result = await caller.newsletter.subscribe({
      email: testEmail,
      name: "Updated Name",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("resubscribed");

    // Verify in database
    const subscription = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, testEmail))
      .limit(1);

    expect(subscription.length).toBe(1);
    expect(subscription[0].isActive).toBe(true);
    expect(subscription[0].name).toBe("Updated Name");
  });

  it("should reject invalid email format", async () => {
    await expect(
      caller.newsletter.subscribe({
        email: "invalid-email",
      })
    ).rejects.toThrow();
  });
});
