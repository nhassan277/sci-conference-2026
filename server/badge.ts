import PDFDocument from "pdfkit";
import type PDFKit from "pdfkit";
import QRCode from "qrcode";
import { Readable } from "stream";

interface BadgeData {
  registrationId: number;
  fullNameEnglish: string;
  fullNameArabic: string;
  affiliation: string;
  attendeeCategory: string;
  participationType: string;
}

/**
 * Generate a conference badge PDF with QR code
 * Returns a readable stream that can be piped to response
 */
export async function generateBadgePDF(data: BadgeData): Promise<PDFKit.PDFDocument> {
  const doc = new PDFDocument({
    size: [4 * 72, 6 * 72], // 4x6 inches badge size
    margins: { top: 20, bottom: 20, left: 20, right: 20 },
  });

  // Generate QR code as data URL
  const qrCodeDataURL = await QRCode.toDataURL(`REG-${data.registrationId}`, {
    width: 150,
    margin: 1,
  });

  // Convert data URL to buffer
  const qrCodeBuffer = Buffer.from(qrCodeDataURL.split(",")[1], "base64");

  // Header section with conference branding
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor("#1e40af") // Primary blue color
    .text("SCI 2026", { align: "center" });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#64748b") // Muted gray
    .text("Science at the Core of Innovation", { align: "center" });

  doc.moveDown(0.5);

  // Draw a horizontal line
  doc
    .strokeColor("#e2e8f0")
    .lineWidth(1)
    .moveTo(20, doc.y)
    .lineTo(4 * 72 - 20, doc.y)
    .stroke();

  doc.moveDown(1);

  // Participant name (English)
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#0f172a") // Dark text
    .text(data.fullNameEnglish, { align: "center" });

  doc.moveDown(0.3);

  // Participant name (Arabic)
  doc
    .fontSize(14)
    .font("Helvetica")
    .fillColor("#475569")
    .text(data.fullNameArabic, { align: "center", features: ["rtla"] });

  doc.moveDown(0.8);

  // Affiliation
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#64748b")
    .text(data.affiliation, { align: "center", width: 4 * 72 - 40 });

  doc.moveDown(0.8);

  // Category and Type badges
  const badgeY = doc.y;
  const centerX = (4 * 72) / 2;

  // Category badge
  doc
    .roundedRect(centerX - 100, badgeY, 90, 22, 4)
    .fillAndStroke("#dbeafe", "#3b82f6");

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor("#1e40af")
    .text(data.attendeeCategory, centerX - 95, badgeY + 6, {
      width: 80,
      align: "center",
    });

  // Type badge
  doc
    .roundedRect(centerX + 10, badgeY, 90, 22, 4)
    .fillAndStroke("#fef3c7", "#f59e0b");

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor("#92400e")
    .text(data.participationType, centerX + 15, badgeY + 6, {
      width: 80,
      align: "center",
    });

  doc.moveDown(2);

  // QR Code section
  doc.moveDown(0.5);
  const qrX = centerX - 75;
  const qrY = doc.y;

  doc.image(qrCodeBuffer, qrX, qrY, {
    width: 150,
    height: 150,
  });

  doc.y = qrY + 160;

  // Registration ID
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#94a3b8")
    .text(`Registration #${data.registrationId}`, { align: "center" });

  // Footer
  doc.moveDown(0.5);
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#cbd5e1")
    .text("April 7-8, 2026 | Cairo University", { align: "center" });

  // Finalize the PDF
  doc.end();

  return doc;
}

/**
 * Generate badges for multiple participants
 * Returns a single PDF with multiple badges
 */
export async function generateBulkBadgesPDF(participants: BadgeData[]): Promise<PDFKit.PDFDocument> {
  const doc = new PDFDocument({
    size: [4 * 72, 6 * 72],
    margins: { top: 20, bottom: 20, left: 20, right: 20 },
  });

  for (let i = 0; i < participants.length; i++) {
    const data = participants[i];

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(`REG-${data.registrationId}`, {
      width: 150,
      margin: 1,
    });
    const qrCodeBuffer = Buffer.from(qrCodeDataURL.split(",")[1], "base64");

    // Add page break for subsequent badges
    if (i > 0) {
      doc.addPage();
    }

    // Header
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#1e40af")
      .text("SCI 2026", { align: "center" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#64748b")
      .text("Science at the Core of Innovation", { align: "center" });

    doc.moveDown(0.5);

    doc
      .strokeColor("#e2e8f0")
      .lineWidth(1)
      .moveTo(20, doc.y)
      .lineTo(4 * 72 - 20, doc.y)
      .stroke();

    doc.moveDown(1);

    // Names
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#0f172a")
      .text(data.fullNameEnglish, { align: "center" });

    doc.moveDown(0.3);

    doc
      .fontSize(14)
      .font("Helvetica")
      .fillColor("#475569")
      .text(data.fullNameArabic, { align: "center", features: ["rtla"] });

    doc.moveDown(0.8);

    // Affiliation
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#64748b")
      .text(data.affiliation, { align: "center", width: 4 * 72 - 40 });

    doc.moveDown(0.8);

    // Badges
    const badgeY = doc.y;
    const centerX = (4 * 72) / 2;

    doc
      .roundedRect(centerX - 100, badgeY, 90, 22, 4)
      .fillAndStroke("#dbeafe", "#3b82f6");

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor("#1e40af")
      .text(data.attendeeCategory, centerX - 95, badgeY + 6, {
        width: 80,
        align: "center",
      });

    doc
      .roundedRect(centerX + 10, badgeY, 90, 22, 4)
      .fillAndStroke("#fef3c7", "#f59e0b");

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor("#92400e")
      .text(data.participationType, centerX + 15, badgeY + 6, {
        width: 80,
        align: "center",
      });

    doc.moveDown(2);

    // QR Code
    doc.moveDown(0.5);
    const qrX = centerX - 75;
    const qrY = doc.y;

    doc.image(qrCodeBuffer, qrX, qrY, {
      width: 150,
      height: 150,
    });

    doc.y = qrY + 160;

    // Footer
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#94a3b8")
      .text(`Registration #${data.registrationId}`, { align: "center" });

    doc.moveDown(0.5);
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#cbd5e1")
      .text("April 7-8, 2026 | Cairo University", { align: "center" });
  }

  doc.end();

  return doc;
}
