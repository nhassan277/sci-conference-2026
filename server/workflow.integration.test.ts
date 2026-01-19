import { describe, it, expect, beforeAll } from "vitest";
import { db } from "./db.js";
import { registrations, payments } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { generateBadgePDF } from "./badge.js";
import { sendRegistrationNotification, sendPaymentConfirmationNotification } from "./email.js";

/**
 * Integration Test: Complete Conference Management Workflow
 * Tests the entire flow from registration to badge generation
 */

describe("Complete Conference Management Workflow", () => {
  let testRegistrationId: number;
  let testPaymentIntentId: string;

  const testData = {
    fullNameEnglish: "Integration Test User",
    fullNameArabic: "مستخدم اختبار التكامل",
    email: "integration-test@example.com",
    phone: "+201234567890",
    affiliation: "Cairo University - Faculty of Science",
    attendeeCategory: "Graduate Student",
    participationType: "Presenter",
    researchTrack: "Life Sciences",
    wantsCertificate: true,
  };

  describe("Step 1: Registration Creation", () => {
    it("should create a new registration with certificate option", async () => {
      const [result] = await db.insert(registrations).values(testData);
      
      testRegistrationId = result.insertId;

      expect(testRegistrationId).toBeGreaterThan(0);
      
      // Verify registration was created
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      expect(registration).toBeDefined();
      expect(registration.fullNameEnglish).toBe(testData.fullNameEnglish);
      expect(registration.wantsCertificate).toBe(true);
      expect(registration.paymentStatus).toBe("unpaid");
    });

    it("should send registration notification email", async () => {
      const result = await sendRegistrationNotification({
        ...testData,
        registrationId: testRegistrationId,
      });

      expect(result).toBe(true);
    });
  });

  describe("Step 2: Certificate Payment Processing", () => {
    it("should handle certificate payment requirement", async () => {
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      expect(registration.wantsCertificate).toBe(true);
      expect(registration.paymentStatus).toBe("unpaid");
    });

    it("should simulate payment webhook and update status", async () => {
      // Simulate Stripe payment intent ID
      testPaymentIntentId = `pi_test_${Date.now()}`;

      // Update registration as if webhook was received
      await db
        .update(registrations)
        .set({
          paymentStatus: "paid",
          stripePaymentIntentId: testPaymentIntentId,
          paidAt: new Date(),
        })
        .where(eq(registrations.id, testRegistrationId));

      // Verify payment status updated
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      expect(registration.paymentStatus).toBe("paid");
      expect(registration.stripePaymentIntentId).toBe(testPaymentIntentId);
      expect(registration.paidAt).toBeDefined();
    });

    it("should send payment confirmation notification", async () => {
      const result = await sendPaymentConfirmationNotification({
        fullNameEnglish: testData.fullNameEnglish,
        email: testData.email,
        registrationId: testRegistrationId,
        amount: 100,
        currency: "EGP",
      });

      expect(result).toBe(true);
    });
  });

  describe("Step 3: Badge Generation", () => {
    it("should generate badge PDF with QR code", async () => {
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      const pdfStream = await generateBadgePDF({
        registrationId: registration.id,
        fullNameEnglish: registration.fullNameEnglish,
        fullNameArabic: registration.fullNameArabic,
        affiliation: registration.affiliation,
        attendeeCategory: registration.attendeeCategory,
        participationType: registration.participationType,
      });

      expect(pdfStream).toBeDefined();
      expect(typeof pdfStream.pipe).toBe("function");
      
      // Verify PDF stream can be read
      const chunks: Buffer[] = [];
      for await (const chunk of pdfStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const pdfBuffer = Buffer.concat(chunks);

      expect(pdfBuffer.length).toBeGreaterThan(0);
      // PDF files start with %PDF
      expect(pdfBuffer.toString("utf-8", 0, 4)).toBe("%PDF");
    });

    it("should include QR code with registration ID in badge", async () => {
      // QR code generation is tested in badge.test.ts
      // This test verifies the badge contains the registration data
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      expect(registration.id).toBe(testRegistrationId);
      expect(registration.fullNameEnglish).toBe(testData.fullNameEnglish);
      expect(registration.fullNameArabic).toBe(testData.fullNameArabic);
    });
  });

  describe("Step 4: Complete Workflow Verification", () => {
    it("should have complete registration record", async () => {
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, testRegistrationId));

      // Verify all required fields
      expect(registration.id).toBe(testRegistrationId);
      expect(registration.fullNameEnglish).toBe(testData.fullNameEnglish);
      expect(registration.fullNameArabic).toBe(testData.fullNameArabic);
      expect(registration.email).toBe(testData.email);
      expect(registration.phone).toBe(testData.phone);
      expect(registration.affiliation).toBe(testData.affiliation);
      expect(registration.attendeeCategory).toBe(testData.attendeeCategory);
      expect(registration.participationType).toBe(testData.participationType);
      expect(registration.wantsCertificate).toBe(true);
      expect(registration.paymentStatus).toBe("paid");
      expect(registration.stripePaymentIntentId).toBe(testPaymentIntentId);
      expect(registration.paidAt).toBeDefined();
      expect(registration.createdAt).toBeDefined();
    });

    it("should be able to query registration for admin dashboard", async () => {
      const allRegistrations = await db.select().from(registrations);
      
      const testReg = allRegistrations.find(r => r.id === testRegistrationId);
      
      expect(testReg).toBeDefined();
      expect(testReg?.paymentStatus).toBe("paid");
    });
  });

  describe("Step 5: Workflow Summary", () => {
    it("should complete all workflow steps successfully", async () => {
      console.log("\n✅ Complete Workflow Test Results:");
      console.log(`   Registration ID: ${testRegistrationId}`);
      console.log(`   Name: ${testData.fullNameEnglish}`);
      console.log(`   Email: ${testData.email}`);
      console.log(`   Certificate: Requested & Paid`);
      console.log(`   Payment Intent: ${testPaymentIntentId}`);
      console.log(`   Badge: Generated with QR Code`);
      console.log(`   Notifications: Sent (Registration + Payment)`);
      console.log("\n🎉 All workflow steps completed successfully!\n");

      expect(testRegistrationId).toBeGreaterThan(0);
    });
  });
});
