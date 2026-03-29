import PDFDocument from "pdfkit";
import { Response } from "express";
import { db } from "./db.js";
import { keynoteSpeakers } from "../drizzle/schema.js";
import { asc } from "drizzle-orm";
import https from "https";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLORS = {
  primary: "#41081A",
  secondary: "#D4AF37",
  accent: "#8B1A2F",
  lightGold: "#F0D264",
  white: "#FFFFFF",
  cream: "#FCF8EE",
  darkText: "#1a1a1a",
  midGray: "#555555",
  lightGray: "#e8e8e8",
  comingSoon: "#888888",
};

/** Download a remote image URL into a Buffer */
function fetchImageBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

/** Resolve a photo URL to a Buffer (handles both remote URLs and local paths) */
async function resolvePhoto(photoUrl: string | null): Promise<Buffer | null> {
  if (!photoUrl) return null;
  try {
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      return await fetchImageBuffer(photoUrl);
    }
    // Local path — resolve relative to the project's client/public directory
    const localPath = path.join(
      __dirname,
      "..",
      "client",
      "public",
      photoUrl.startsWith("/") ? photoUrl.slice(1) : photoUrl
    );
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
    return null;
  } catch {
    return null;
  }
}

export async function generateAbstractsPDF(res: Response) {
  const speakers = await db
    .select()
    .from(keynoteSpeakers)
    .where(undefined)
    .orderBy(asc(keynoteSpeakers.displayOrder));

  const visibleSpeakers = speakers.filter((s) => s.isVisible);

  // Pre-fetch all photos in parallel (with a 5 s timeout per image)
  const photoBuffers: (Buffer | null)[] = await Promise.all(
    visibleSpeakers.map(async (spk) => {
      try {
        const result = await Promise.race([
          resolvePhoto(spk.photoUrl),
          new Promise<null>((res) => setTimeout(() => res(null), 5000)),
        ]);
        return result as Buffer | null;
      } catch {
        return null;
      }
    })
  );

  const pageWidth = 595.28;
  const pageHeight = 841.89;
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
  doc.rect(0, 0, pageWidth, pageHeight).fill(COLORS.primary);
  doc.rect(0, 0, pageWidth, 8).fill(COLORS.secondary);
  doc.rect(0, pageHeight - 8, pageWidth, 8).fill(COLORS.secondary);

  doc
    .circle(pageWidth / 2, pageHeight / 2, 200)
    .lineWidth(1)
    .strokeColor(COLORS.secondary)
    .fillOpacity(0.05)
    .fillAndStroke(COLORS.secondary, COLORS.secondary);
  doc.fillOpacity(1);

  const titleY = 180;
  doc
    .fontSize(28)
    .fillColor(COLORS.lightGold)
    .font("Helvetica-Bold")
    .text("Science at the Core of Innovation", margin, titleY, {
      width: contentWidth,
      align: "center",
    });
  // Arabic subtitle removed (not supported by Helvetica font)
  doc.rect(margin + 60, titleY + 70, contentWidth - 120, 2).fill(COLORS.secondary);
  doc
    .fontSize(36)
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .text("Book of Abstracts", margin, titleY + 90, {
      width: contentWidth,
      align: "center",
    });
  // Arabic booklet subtitle removed (not supported by Helvetica font)

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
    .text("April 7–8, 2026", margin + 40, boxY + 32, {
      width: contentWidth - 80,
      align: "center",
    });
  doc
    .fontSize(10)
    .fillColor(COLORS.white)
    .font("Helvetica")
    .text("Faculty of Science, Cairo University", margin + 40, boxY + 52, {
      width: contentWidth - 80,
      align: "center",
    });
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

  for (let i = 0; i < visibleSpeakers.length; i++) {
    const spk = visibleSpeakers[i];
    if (y > pageHeight - 60) {
      doc.addPage();
      y = margin;
    }
    const rowH = 28;
    if (i % 2 === 0) {
      doc.rect(margin, y - 2, contentWidth, rowH).fill("#f5f0e8");
    }

    // Tiny photo thumbnail in TOC — use fillColor after restore to avoid clip state leaking
    const photo = photoBuffers[i];
    const thumbSize = 22;
    const thumbCx = margin + 12;
    const thumbCy = y + rowH / 2 - 2;
    if (photo) {
      try {
        // Draw circular clip mask then image, fully isolated
        doc.save();
        doc.circle(thumbCx, thumbCy, thumbSize / 2).clip();
        doc.image(photo, margin + 1, y + 1, { width: thumbSize, height: thumbSize });
        doc.restore();
        // Draw a thin ring over the photo for polish
        doc.circle(thumbCx, thumbCy, thumbSize / 2).lineWidth(0.5).stroke(COLORS.accent);
      } catch {
        doc.circle(thumbCx, thumbCy, thumbSize / 2).fill(COLORS.accent);
      }
    } else {
      doc.circle(thumbCx, thumbCy, thumbSize / 2).fill(COLORS.accent);
      // Draw initial letter
      const initial = spk.fullName ? spk.fullName.charAt(0).toUpperCase() : "?";
      doc.fontSize(9).fillColor("#ffffff").font("Helvetica-Bold")
        .text(initial, thumbCx - 5, thumbCy - 5, { width: 10, align: "center", lineBreak: false });
    }

    // All text uses lineBreak:false to prevent PDFKit cursor from advancing
    doc
      .fontSize(8)
      .fillColor(COLORS.secondary)
      .font("Helvetica-Bold")
      .text(`${String(i + 1).padStart(2, "0")}`, margin + 26, y + 8, { lineBreak: false });

    // Truncate name to fit in column
    const displayName = spk.fullName && spk.fullName.length > 28
      ? spk.fullName.slice(0, 28) + "…"
      : (spk.fullName || "Unknown");
    doc
      .fontSize(9)
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .text(displayName, margin + 42, y + 7, { width: 185, lineBreak: false });

    const ptitle = spk.presentationTitle
      ? spk.presentationTitle.length > 52
        ? spk.presentationTitle.slice(0, 52) + "…"
        : spk.presentationTitle
      : "Title TBA";
    doc
      .fontSize(8)
      .fillColor(COLORS.midGray)
      .font("Helvetica")
      .text(ptitle, margin + 233, y + 8, { width: 230, lineBreak: false });

    const hasAbs =
      spk.presentationAbstract && spk.presentationAbstract.trim().length > 0;
    doc
      .fontSize(7)
      .fillColor(hasAbs ? "#16a34a" : COLORS.comingSoon)
      .font("Helvetica")
      .text(hasAbs ? "✓" : "—", margin + contentWidth - 10, y + 9, { lineBreak: false });

    y += rowH;
  }

  // ── ABSTRACTS PAGES ─────────────────────────────────────────────────────
  const photoSize = 100; // square photo width/height in points
  const photoX = pageWidth - margin - photoSize; // right-aligned

  for (let i = 0; i < visibleSpeakers.length; i++) {
    const spk = visibleSpeakers[i];
    doc.addPage();
    y = margin;

    // ── Speaker header bar ──
    doc.rect(margin, y, contentWidth, 4).fill(COLORS.secondary);
    y += 8;

    // ── Photo (right side) ──
    const photo = photoBuffers[i];
    const photoTopY = y;
    if (photo) {
      try {
        // Circular clip for photo
        const cx = photoX + photoSize / 2;
        const cy = photoTopY + photoSize / 2;
        const r = photoSize / 2;
        doc.save();
        doc.circle(cx, cy, r).clip();
        doc.image(photo, photoX, photoTopY, { width: photoSize, height: photoSize });
        doc.restore();
        // Gold ring around photo
        doc
          .circle(cx, cy, r + 2)
          .lineWidth(2)
          .strokeColor(COLORS.secondary)
          .stroke();
      } catch {
        // Fallback placeholder
        doc.circle(photoX + photoSize / 2, photoTopY + photoSize / 2, photoSize / 2)
          .fill(COLORS.accent);
        doc
          .fontSize(8)
          .fillColor(COLORS.white)
          .font("Helvetica")
          .text("Photo", photoX, photoTopY + photoSize / 2 - 5, {
            width: photoSize,
            align: "center",
          });
      }
    } else {
      // Placeholder circle
      doc.circle(photoX + photoSize / 2, photoTopY + photoSize / 2, photoSize / 2)
        .fill(COLORS.lightGray);
    }

    // ── Speaker info (left side, next to photo) ──
    const infoWidth = contentWidth - photoSize - 16;

    // Number badge
    doc.rect(margin, y, 32, 32).fill(COLORS.primary);
    doc
      .fontSize(13)
      .fillColor(COLORS.lightGold)
      .font("Helvetica-Bold")
      .text(`${String(i + 1).padStart(2, "0")}`, margin, y + 10, {
        width: 32,
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
    const sectorLabel = sector.charAt(0).toUpperCase() + sector.slice(1);
    doc.rect(margin + 38, y + 2, 68, 14).fill(sectorColors[sector] || sectorColors.academia);
    doc
      .fontSize(7)
      .fillColor(COLORS.white)
      .font("Helvetica-Bold")
      .text(sectorLabel, margin + 38, y + 5, { width: 68, align: "center" });

    // Speaker name
    doc
      .fontSize(14)
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .text(spk.fullName, margin + 38, y + 20, { width: infoWidth - 38 });

    y += 38;

    // Title
    if (spk.title) {
      doc
        .fontSize(8.5)
        .fillColor(COLORS.midGray)
        .font("Helvetica")
        .text(spk.title, margin, y, { width: infoWidth });
      y += 12;
    }
    // Affiliation
    if (spk.affiliation) {
      doc
        .fontSize(9)
        .fillColor(COLORS.accent)
        .font("Helvetica-Bold")
        .text(spk.affiliation, margin, y, { width: infoWidth });
      y += 13;
    }

    // Ensure y is at least below the photo before continuing
    y = Math.max(y, photoTopY + photoSize + 10);

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

    // Arabic title
    if (spk.presentationTitleAr) {
      doc
        .fontSize(10)
        .fillColor(COLORS.accent)
        .font("Helvetica")
        .text(spk.presentationTitleAr, margin, y, { width: contentWidth });
      y += doc.heightOfString(spk.presentationTitleAr, { width: contentWidth }) + 8;
    }

    // Abstract section header
    y += 4;
    doc.rect(margin, y, contentWidth, 20).fill(COLORS.primary);
    doc
      .fontSize(10)
      .fillColor(COLORS.lightGold)
      .font("Helvetica-Bold")
      .text("Abstract", margin + 8, y + 5);
    y += 26;

    if (spk.presentationAbstract && spk.presentationAbstract.trim().length > 0) {
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
      y += doc.heightOfString(abstractText, { width: contentWidth, lineGap: 2 }) + 10;
    } else {
      doc
        .fontSize(9.5)
        .fillColor(COLORS.comingSoon)
        .font("Helvetica")
        .text("Abstract coming soon", margin, y, {
          width: contentWidth,
          align: "center",
        });
      y += 20;
    }

    // Bio section
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
    if (i === 0) continue;
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
