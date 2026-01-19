import { describe, it, expect } from "vitest";
import { generateBadgePDF, generateBulkBadgesPDF } from "./badge.js";

describe("Badge Generation", () => {
  const sampleBadgeData = {
    registrationId: 1,
    fullNameEnglish: "John Doe",
    fullNameArabic: "جون دو",
    affiliation: "Cairo University",
    attendeeCategory: "Graduate Student",
    participationType: "Presenter",
  };

  it("should generate a single badge PDF successfully", async () => {
    const pdfStream = await generateBadgePDF(sampleBadgeData);

    expect(pdfStream).toBeDefined();
    expect(typeof pdfStream.pipe).toBe("function");
    expect(typeof pdfStream.on).toBe("function");
  });

  it("should generate bulk badges PDF successfully", async () => {
    const participants = [
      sampleBadgeData,
      {
        registrationId: 2,
        fullNameEnglish: "Jane Smith",
        fullNameArabic: "جين سميث",
        affiliation: "Alexandria University",
        attendeeCategory: "Faculty Member",
        participationType: "Attendee",
      },
      {
        registrationId: 3,
        fullNameEnglish: "Ahmed Hassan",
        fullNameArabic: "أحمد حسن",
        affiliation: "Ain Shams University",
        attendeeCategory: "External Researcher",
        participationType: "Presenter",
      },
    ];

    const pdfStream = await generateBulkBadgesPDF(participants);

    expect(pdfStream).toBeDefined();
    expect(typeof pdfStream.pipe).toBe("function");
    expect(typeof pdfStream.on).toBe("function");
  });

  it("should handle different attendee categories", async () => {
    const categories = [
      "Graduate Student",
      "Faculty Member",
      "External Researcher",
      "Industry Partner",
    ];

    for (const category of categories) {
      const badgeData = {
        ...sampleBadgeData,
        attendeeCategory: category,
      };

      const pdfStream = await generateBadgePDF(badgeData);
      expect(pdfStream).toBeDefined();
    }
  });

  it("should handle different participation types", async () => {
    const types = ["Presenter", "Attendee", "Poster", "Workshop Leader"];

    for (const type of types) {
      const badgeData = {
        ...sampleBadgeData,
        participationType: type,
      };

      const pdfStream = await generateBadgePDF(badgeData);
      expect(pdfStream).toBeDefined();
    }
  });

  it("should handle Arabic text in names and affiliations", async () => {
    const arabicBadgeData = {
      registrationId: 100,
      fullNameEnglish: "Mohamed Ali",
      fullNameArabic: "محمد علي",
      affiliation: "جامعة القاهرة - كلية العلوم",
      attendeeCategory: "Graduate Student",
      participationType: "Presenter",
    };

    const pdfStream = await generateBadgePDF(arabicBadgeData);
    expect(pdfStream).toBeDefined();
  });

  it("should handle long names and affiliations", async () => {
    const longNameBadgeData = {
      registrationId: 200,
      fullNameEnglish: "Dr. Alexander Christopher Wellington-Montgomery III",
      fullNameArabic: "الدكتور ألكسندر كريستوفر ويلينجتون مونتجومري الثالث",
      affiliation:
        "International Research Center for Advanced Scientific Studies and Innovation",
      attendeeCategory: "External Researcher",
      participationType: "Workshop Leader",
    };

    const pdfStream = await generateBadgePDF(longNameBadgeData);
    expect(pdfStream).toBeDefined();
  });
});
