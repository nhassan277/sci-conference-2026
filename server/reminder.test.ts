import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers.js";
import { db } from "./db.js";
import { reminderSubscriptions } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

describe("Conference Reminder Subscription System", () => {
  const testEmail = `test-reminder-${Date.now()}@example.com`;
  const testEmail2 = `test-reminder2-${Date.now()}@example.com`;

  // Create a caller without authentication (public procedures)
  const caller = appRouter.createCaller({
    user: undefined,
    req: undefined,
  });

  beforeAll(async () => {
    // Clean up any existing test subscriptions
    await db
      .delete(reminderSubscriptions)
      .where(eq(reminderSubscriptions.email, testEmail));
    await db
      .delete(reminderSubscriptions)
      .where(eq(reminderSubscriptions.email, testEmail2));
  });

  it("should allow users to subscribe to conference reminders", async () => {
    const result = await caller.reminder.subscribe({
      email: testEmail,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("subscribed");

    // Verify subscription was created in database
    const [subscription] = await db
      .select()
      .from(reminderSubscriptions)
      .where(eq(reminderSubscriptions.email, testEmail));

    expect(subscription).toBeDefined();
    expect(subscription.email).toBe(testEmail);
    expect(subscription.reminderSent).toBe(false);
    expect(subscription.unsubscribed).toBe(false);
  });

  it("should handle duplicate subscriptions gracefully", async () => {
    // First subscription
    await caller.reminder.subscribe({
      email: testEmail2,
    });

    // Try to subscribe again
    const result = await caller.reminder.subscribe({
      email: testEmail2,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("already subscribed");
  });

  it("should allow resubscription after unsubscribing", async () => {
    const resubEmail = `test-resub-${Date.now()}@example.com`;

    // Subscribe
    await caller.reminder.subscribe({
      email: resubEmail,
    });

    // Unsubscribe
    await caller.reminder.unsubscribe({
      email: resubEmail,
    });

    // Verify unsubscribed
    const [unsubbed] = await db
      .select()
      .from(reminderSubscriptions)
      .where(eq(reminderSubscriptions.email, resubEmail));

    expect(unsubbed.unsubscribed).toBe(true);

    // Resubscribe
    const result = await caller.reminder.subscribe({
      email: resubEmail,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("resubscribed");

    // Verify resubscribed
    const [resubbed] = await db
      .select()
      .from(reminderSubscriptions)
      .where(eq(reminderSubscriptions.email, resubEmail));

    expect(resubbed.unsubscribed).toBe(false);
    expect(resubbed.unsubscribedAt).toBeNull();
  });

  it("should allow users to unsubscribe from reminders", async () => {
    const unsubEmail = `test-unsub-${Date.now()}@example.com`;

    // Subscribe first
    await caller.reminder.subscribe({
      email: unsubEmail,
    });

    // Unsubscribe
    const result = await caller.reminder.unsubscribe({
      email: unsubEmail,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("unsubscribed");

    // Verify unsubscription in database
    const [subscription] = await db
      .select()
      .from(reminderSubscriptions)
      .where(eq(reminderSubscriptions.email, unsubEmail));

    expect(subscription.unsubscribed).toBe(true);
    expect(subscription.unsubscribedAt).toBeDefined();
  });

  it("should validate email format", async () => {
    try {
      await caller.reminder.subscribe({
        email: "invalid-email",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid email");
    }
  });

  it("should track subscription timestamps", async () => {
    const timestampEmail = `test-timestamp-${Date.now()}@example.com`;

    await caller.reminder.subscribe({
      email: timestampEmail,
    });

    const [subscription] = await db
      .select()
      .from(reminderSubscriptions)
      .where(eq(reminderSubscriptions.email, timestampEmail));

    expect(subscription.subscribedAt).toBeDefined();
    expect(subscription.subscribedAt).toBeInstanceOf(Date);
    expect(subscription.reminderSent).toBe(false);
    expect(subscription.reminderSentAt).toBeNull();
  });
});
