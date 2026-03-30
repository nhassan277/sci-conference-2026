import { describe, it, expect } from "vitest";
import { db } from "./db.js";
import { workshopRegistrations } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

describe("workshopRegistrations table", () => {
  it("can insert and retrieve a workshop registration", async () => {
    const [result] = await db.insert(workshopRegistrations).values({
      workshopKey: "gee_remote_sensing",
      fullName: "Test User",
      email: "test_gee@example.com",
      phone: "01000000000",
      affiliation: "Cairo University",
      academicLevel: "postgraduate",
      hasLaptop: true,
      amount: "200.00",
      currency: "EGP",
      paymentStatus: "unpaid",
    });
    const newId = (result as any).insertId as number;
    expect(newId).toBeGreaterThan(0);

    const [row] = await db
      .select()
      .from(workshopRegistrations)
      .where(eq(workshopRegistrations.id, newId));

    expect(row.fullName).toBe("Test User");
    expect(row.workshopKey).toBe("gee_remote_sensing");
    expect(row.paymentStatus).toBe("unpaid");
    expect(row.hasLaptop).toBe(true);

    // cleanup
    await db.delete(workshopRegistrations).where(eq(workshopRegistrations.id, newId));
  });
});
