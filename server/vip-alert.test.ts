import { describe, it, expect, beforeAll } from "vitest";
import { db } from "./db.js";
import { registrations } from "../drizzle/schema.js";
import { sendVIPCheckinAlert } from "./email.js";

describe("VIP Check-In Alerts", () => {
  let testRegistrationId: number;

  beforeAll(async () => {
    // Create a test VIP registration
    const [result] = await db.insert(registrations).values({
      fullNameEnglish: "Dr. Ahmed Hassan",
      fullNameArabic: "د. أحمد حسن",
      email: "ahmed.hassan@example.com",
      phone: "+201234567890",
      affiliation: "Cairo University",
      attendeeCategory: "faculty",
      participationType: "presenter",
      wantsCertificate: false,
      isVIP: true, // Mark as VIP
    });
    testRegistrationId = result.insertId;
  });

  it("should create VIP registration with isVIP flag", async () => {
    const [registration] = await db
      .select()
      .from(registrations)
      .where((r) => r.id === testRegistrationId);

    expect(registration).toBeDefined();
    expect(registration.isVIP).toBe(true);
    expect(registration.fullNameEnglish).toBe("Dr. Ahmed Hassan");
  });

  it("should send VIP check-in alert email", async () => {
    const result = await sendVIPCheckinAlert({
      fullNameEnglish: "Dr. Ahmed Hassan",
      fullNameArabic: "د. أحمد حسن",
      email: "ahmed.hassan@example.com",
      affiliation: "Cairo University",
      attendeeCategory: "faculty",
      checkedInBy: "Staff Member",
      checkedInAt: new Date(),
    });

    // The function should return true indicating the notification was sent
    expect(result).toBe(true);
  });

  it("should detect VIP status during check-in", async () => {
    const [registration] = await db
      .select()
      .from(registrations)
      .where((r) => r.id === testRegistrationId);

    // Verify VIP flag is set
    expect(registration.isVIP).toBe(true);

    // In real check-in flow, this would trigger sendVIPCheckinAlert
    if (registration.isVIP) {
      const alertSent = await sendVIPCheckinAlert({
        fullNameEnglish: registration.fullNameEnglish,
        fullNameArabic: registration.fullNameArabic,
        email: registration.email,
        affiliation: registration.affiliation,
        attendeeCategory: registration.attendeeCategory,
        checkedInBy: "Test Staff",
        checkedInAt: new Date(),
      });

      expect(alertSent).toBe(true);
    }
  });
});
