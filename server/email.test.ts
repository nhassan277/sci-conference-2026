import { describe, it, expect } from "vitest";
import {
  sendRegistrationNotification,
  sendPaymentConfirmationNotification,
  sendSupportTicketNotification,
  sendSponsorshipNotification,
} from "./email.js";

describe("Email Notifications", () => {
  it("should send registration notification successfully", async () => {
    const result = await sendRegistrationNotification({
      fullNameEnglish: "John Doe",
      fullNameArabic: "جون دو",
      email: "john@example.com",
      phone: "+201234567890",
      affiliation: "Cairo University",
      attendeeCategory: "Graduate Student",
      participationType: "Presenter",
      wantsCertificate: true,
      registrationId: 1,
    });

    expect(result).toBe(true);
  });

  it("should send payment confirmation notification successfully", async () => {
    const result = await sendPaymentConfirmationNotification({
      fullNameEnglish: "John Doe",
      email: "john@example.com",
      registrationId: 1,
      amount: 100,
      currency: "EGP",
    });

    expect(result).toBe(true);
  });

  it("should send support ticket notification successfully", async () => {
    const result = await sendSupportTicketNotification({
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Technical Issue",
      message: "I need help with registration",
      priority: "high",
      ticketId: 1,
    });

    expect(result).toBe(true);
  });

  it("should send sponsorship notification successfully", async () => {
    const result = await sendSponsorshipNotification({
      companyName: "Tech Corp",
      contactPerson: "Alice Johnson",
      email: "alice@techcorp.com",
      phone: "+201234567890",
      packageType: "platinum",
      sponsorshipId: 1,
    });

    expect(result).toBe(true);
  });

  it("should handle registration without certificate", async () => {
    const result = await sendRegistrationNotification({
      fullNameEnglish: "Bob Wilson",
      fullNameArabic: "بوب ويلسون",
      email: "bob@example.com",
      phone: "+201234567890",
      affiliation: "Alexandria University",
      attendeeCategory: "Faculty Member",
      participationType: "Attendee",
      wantsCertificate: false,
      registrationId: 2,
    });

    expect(result).toBe(true);
  });

  it("should handle low priority support tickets", async () => {
    const result = await sendSupportTicketNotification({
      name: "Test User",
      email: "test@example.com",
      subject: "General Question",
      message: "When is the conference?",
      priority: "low",
      ticketId: 2,
    });

    expect(result).toBe(true);
  });
});
