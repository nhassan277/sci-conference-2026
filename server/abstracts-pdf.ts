import PDFDocument from "pdfkit";
import { Response } from "express";
import { db } from "./db.js";
import { keynoteSpeakers } from "../drizzle/schema.js";
import { asc } from "drizzle-orm";

const COLORS = {
  primary: "#41081A",       // Deep maroon
  secondary: "#D4AF37",     // Gold
  accent: "#8B1A2F",        // Medium maroon
  lightGold: "#F0D264",     // Light gold
  white: "#FFFFFF",
  cream: "#FCF8EE",
  darkText: "#1a1a1a",
  midGray: "#555555",
  lightGray: "#e8e8e8",
  comingSoon: "#888888",
};

export async function generateAbstractsPDF(res: Response) {
  // Fetch all visible speakers ordered by displayOrder
  const speakers = await db
    .select()
    .from(keynoteSpeakers)
    .where(undefined)
    .orderBy(asc(keynoteSpeakers.displayOrder));

  const visibleSpeakers = speakers.filter((s) => s.isVisible);

  const pageWidth = 595.28;   // A4 width in points
  const pageHeight = 841.89;  // A4 height in points
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: margin, bottom: margin, left: margin, right: margin },
    bufferPages: true,
    info: {
      Title: "SCI 2026 — Book of Abstracts",
      Author: "Faculty of Science, Cairo University",
      Subject: "Science at the Core of Innovation — April 7–8, 2026",
    },
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="SCI2026_Book_of_Abstracts.pdf"'
  );
  doc.pipe(res);

  // ── COVER PAGE ──────────────────────────────────────────────────────────
  // Background
  doc.rect(0, 0, pageWidth, pageHeight).fill(COLORS.primary);

  // Gold top bar
  doc.rect(0, 0, pageWidth, 8).fill(COLORS.secondary);
  doc.rect(0, pageHeight - 8, pageWidth, 8).fill(COLORS.secondary);

  // Decorative circle
  doc.circle(pageWidth / 2, pageHeight / 2, 200)
    .lineWidth(1)
    .strokeColor(COLORS.secondary)
    .fillOpacity(0.05)
    .fillAndStroke(COLORS.secondary, COLORS.secondary);

  doc.fillOpacity(1);

  // Conference title
  const titleY = 180;
  doc
    .fontSize(28)
    .fillColor(COLORS.lightGold)
    .font("Helvetica-Bold")
    .text("Science at the Core of Innovation", margin, titleY, {
      width: contentWidth,
      align: "center",
    });

  doc
    .fontSize(16)
    .fillColor(COLORS.white)
    .font("Helvetica")
    .text("العلوم في قلب الابتكار", margin, titleY + 38, {
      width: contentWidth,
      align: "center",
    });

  // Gold divider
  doc
    .rect(margin + 60, titleY + 70, contentWidth - 120, 2)
    .fill(COLORS.secondary);

  // Book of Abstracts label
  doc
    .fontSize(36)
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .text("Book of Abstracts", margin, titleY + 90, {
      width: contentWidth,
      align: "center",
    });

  doc
    .fontSize(14)
    .fillColor(COLORS.lightGold)
    .font("Helvetica")
    .text("كتاب الملخصات", margin, titleY + 135, {
      width: contentWidth,
      align: "center",
    });

  // Conference details box
  const boxY = titleY + 175;
  doc.rect(margin + 40, boxY, contentWidth - 80, 90).fill(COLORS.accent);
  doc
    .fontSize(13)
    .fillColor(COLORS.lightGold)
    .font("Helvetica-Bold")
    .text("SCI 2026", margin + 40, boxY + 12, {
      width: contentWidth - 80,
      align: "center",
    });
  doc
    .fontSize(11)
    .fillColor(COLORS.white)
    .font("Helvetica")
    .text("April 7–8, 2026  |  7–8 أبريل 2026", margin + 40, boxY + 32, {
      width: contentWidth - 80,
      align: "center",
    });
  doc
    .fontSize(10)
    .fillColor(COLORS.white)
    .font("Helvetica")
    .text(
      "Faculty of Science, Cairo University",
      margin + 40,
      boxY + 52,
      { width: contentWidth - 80, align: "center" }
    );
  doc
    .fontSize(9)
    .fillColor(COLORS.lightGold)
    .font("Helvetica")
    .text(
      "Building Effective Partnerships between Universities and Industry",
      margin + 40,
      boxY + 68,
      { width: contentWidth - 80, align: "center" }
    );

  // Speaker count badge
  const withAbstracts = visibleSpeakers.filter(
    (s) => s.presentationAbstract && s.presentationAbstract.trim().length > 0
  );
  doc
    .fontSize(10)
    .fillColor(COLORS.midGray)
    .font("Helvetica")
    .text(
      `${visibleSpeakers.length} Invited Speakers  ·  ${withAbstracts.length} Abstracts`,
      margin,
      boxY + 110,
      { width: contentWidth, align: "center" }
    );

  doc
    .fontSize(9)
    .fillColor(COLORS.white)
    .font("Helvetica")
    .text("sciconf26.website", margin, pageHeight - 60, {
      width: contentWidth,
      align: "center",
    });

  // ── TABLE OF CONTENTS ───────────────────────────────────────────────────
  doc.addPage();
  let y = margin;

  // TOC header
  doc.rect(margin, y, contentWidth, 32).fill(COLORS.primary);
  doc
    .fontSize(16)
    .fillColor(COLORS.lightGold)
    .font("Helvetica-Bold")
    .text("Table of Contents", margin, y + 9, {
      width: contentWidth,
      align: "center",
    });
  y += 44;

  doc
    .fontSize(9)
    .fillColor(COLORS.midGray)
    .font("Helvetica")
    .text(
      `${visibleSpeakers.length} invited speakers  ·  ${withAbstracts.length} abstracts available`,
      margin,
      y,
      { width: contentWidth, align: "center" }
    );
  y += 20;

  // TOC entries
  let pageCounter = 3; // abstracts start on page 3
  for (let i = 0; i < visibleSpeakers.length; i++) {
    const spk = visibleSpeakers[i];
    if (y > pageHeight - 60) {
      doc.addPage();
      y = margin;
    }
    // Alternating row background
    if (i % 2 === 0) {
      doc.rect(margin, y - 2, contentWidth, 22).fill("#f5f0e8");
    }
    // Index number
    doc
      .fontSize(8)
      .fillColor(COLORS.secondary)
      .font("Helvetica-Bold")
      .text(`${String(i + 1).padStart(2, "0")}`, margin + 2, y + 3);
    // Speaker name
    doc
      .fontSize(9)
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .text(spk.fullName, margin + 22, y + 3, { width: 200 });
    // Presentation title (truncated)
    const ptitle = spk.presentationTitle
      ? spk.presentationTitle.length > 55
        ? spk.presentationTitle.slice(0, 55) + "…"
        : spk.presentationTitle
      : "Title TBA";
    doc
      .fontSize(8)
      .fillColor(COLORS.midGray)
      .font("Helvetica")
      .text(ptitle, margin + 228, y + 3, { width: 240 });
    // Has abstract indicator
    const hasAbs =
      spk.presentationAbstract && spk.presentationAbstract.trim().length > 0;
    doc
      .fontSize(7)
      .fillColor(hasAbs ? "#16a34a" : COLORS.comingSoon)
      .font("Helvetica")
      .text(hasAbs ? "✓" : "—", margin + contentWidth - 10, y + 4);
    y += 22;
    pageCounter++;
  }

  // ── ABSTRACTS PAGES ─────────────────────────────────────────────────────
  for (let i = 0; i < visibleSpeakers.length; i++) {
    const spk = visibleSpeakers[i];
    doc.addPage();
    y = margin;

    // Speaker number badge
    doc.rect(margin, y, 36, 36).fill(COLORS.primary);
    doc
      .fontSize(14)
      .fillColor(COLORS.lightGold)
      .font("Helvetica-Bold")
      .text(`${String(i + 1).padStart(2, "0")}`, margin, y + 11, {
        width: 36,
        align: "center",
      });

    // Sector badge
    const sectorColors: Record<string, string> = {
      academia: "#1d4ed8",
      industry: "#b45309",
      government: "#15803d",
      international: "#7c3aed",
    };
    const sector = spk.speakerSector || "academia";
    const sectorLabel =
      sector.charAt(0).toUpperCase() + sector.slice(1);
    doc
      .rect(margin + 42, y + 2, 70, 16)
      .fill(sectorColors[sector] || sectorColors.academia);
    doc
      .fontSize(7)
      .fillColor(COLORS.white)
      .font("Helvetica-Bold")
      .text(sectorLabel, margin + 42, y + 5, { width: 70, align: "center" });

    // Speaker name
    doc
      .fontSize(15)
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .text(spk.fullName, margin + 42, y + 22, { width: contentWidth - 42 });

    y += 44;

    // Title & affiliation
    if (spk.title) {
      doc
        .fontSize(9)
        .fillColor(COLORS.midGray)
        .font("Helvetica")
        .text(spk.title, margin, y, { width: contentWidth });
      y += 13;
    }
    if (spk.affiliation) {
      doc
        .fontSize(9)
        .fillColor(COLORS.accent)
        .font("Helvetica-Bold")
        .text(spk.affiliation, margin, y, { width: contentWidth });
      y += 14;
    }

    // Gold divider
    doc.rect(margin, y, contentWidth, 1.5).fill(COLORS.secondary);
    y += 10;

    // Presentation title
    const presTitle = spk.presentationTitle || "Title to be announced";
    doc
      .fontSize(12)
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .text(presTitle, margin, y, { width: contentWidth });
    y += doc.heightOfString(presTitle, { width: contentWidth }) + 6;

    // Arabic title if available
    if (spk.presentationTitleAr) {
      doc
        .fontSize(10)
        .fillColor(COLORS.accent)
        .font("Helvetica")
        .text(spk.presentationTitleAr, margin, y, { width: contentWidth });
      y += doc.heightOfString(spk.presentationTitleAr, { width: contentWidth }) + 8;
    }

    // Abstract section
    y += 4;
    doc.rect(margin, y, contentWidth, 20).fill(COLORS.primary);
    doc
      .fontSize(10)
      .fillColor(COLORS.lightGold)
      .font("Helvetica-Bold")
      .text("Abstract", margin + 8, y + 5);
    y += 26;

    if (
      spk.presentationAbstract &&
      spk.presentationAbstract.trim().length > 0
    ) {
      const abstractText = spk.presentationAbstract.trim();
      doc
        .fontSize(9.5)
        .fillColor(COLORS.darkText)
        .font("Helvetica")
        .text(abstractText, margin, y, {
          width: contentWidth,
          align: "justify",
          lineGap: 2,
        });
      y +=
        doc.heightOfString(abstractText, {
          width: contentWidth,
          lineGap: 2,
        }) + 10;
    } else {
      doc
        .fontSize(9.5)
        .fillColor(COLORS.comingSoon)
        .font("Helvetica")
        .text("Abstract coming soon — الملخص قيد الإعداد", margin, y, {
          width: contentWidth,
          align: "center",
        });
      y += 20;
    }

    // Bio section (if available)
    if (spk.bio && spk.bio.trim().length > 0) {
      y += 6;
      doc.rect(margin, y, contentWidth, 18).fill(COLORS.lightGray);
      doc
        .fontSize(9)
        .fillColor(COLORS.primary)
        .font("Helvetica-Bold")
        .text("Speaker Biography", margin + 8, y + 5);
      y += 24;
      const bioText = spk.bio.trim();
      doc
        .fontSize(8.5)
        .fillColor(COLORS.midGray)
        .font("Helvetica")
        .text(bioText, margin, y, {
          width: contentWidth,
          align: "justify",
          lineGap: 1.5,
        });
    }
  }

  // ── PAGE FOOTERS ────────────────────────────────────────────────────────
  const totalPages = (doc as any).bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    if (i === 0) continue; // Skip cover page footer
    doc.rect(0, pageHeight - 30, pageWidth, 30).fill(COLORS.primary);
    doc
      .fontSize(7)
      .fillColor(COLORS.white)
      .font("Helvetica")
      .text(
        `SCI 2026 · Faculty of Science, Cairo University · April 7–8, 2026  |  Page ${i + 1} of ${totalPages}`,
        margin,
        pageHeight - 18,
        { width: contentWidth, align: "center" }
      );
  }

  doc.end();
}
