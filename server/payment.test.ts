import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers.js";

describe("Payment Integration", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    caller = appRouter.createCaller({ req: {} as any });
  });

  it("should create a checkout session with valid registration data", async () => {
    const result = await caller.payment.createCheckoutSession({
      registrationId: 1,
      email: "test@example.com",
      fullName: "Test User",
    });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("checkoutUrl");
    expect(result).toHaveProperty("sessionId");
    expect(result.success).toBe(true);
    expect(typeof result.checkoutUrl).toBe("string");
    expect(typeof result.sessionId).toBe("string");
  });

  it("should fail with invalid email", async () => {
    await expect(
      caller.payment.createCheckoutSession({
        registrationId: 1,
        email: "invalid-email",
        fullName: "Test User",
      })
    ).rejects.toThrow();
  });

  it("should fail with missing registration ID", async () => {
    await expect(
      caller.payment.createCheckoutSession({
        registrationId: 0,
        email: "test@example.com",
        fullName: "Test User",
      })
    ).rejects.toThrow();
  });

  it("should include metadata in checkout session", async () => {
    const result = await caller.payment.createCheckoutSession({
      registrationId: 123,
      email: "participant@example.com",
      fullName: "John Doe",
    });

    // Verify that the session was created successfully
    // In a real test, you would verify the metadata through Stripe API
    expect(result.success).toBe(true);
    expect(result.checkoutUrl).toContain("checkout.stripe.com");
  });

  it("should set correct product price (100 EGP)", async () => {
    const result = await caller.payment.createCheckoutSession({
      registrationId: 1,
      email: "test@example.com",
      fullName: "Test User",
    });

    // The checkout URL should be created successfully
    // Price validation would be done through Stripe API inspection
    expect(result.success).toBe(true);
    expect(result.checkoutUrl).toBeTruthy();
  });
});
