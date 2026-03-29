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
import sharp from "sharp";

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

/** Download a remote image URL into a Buffer, following redirects */
function fetchImageBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doRequest = (reqUrl: string, redirects: number) => {
      if (redirects > 5) return reject(new Error("Too many redirects"));
      const client = reqUrl.startsWith("https") ? https : http;
      client
        .get(reqUrl, (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            return doRequest(res.headers.location, redirects + 1);
          }
          if (res.statusCode && res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        })
        .on("error", reject);
    };
    doRequest(url, 0);
  });
}

/**
 * Resolve a photo URL to a validated image Buffer using Sharp.
 * Returns null if the URL is missing, the fetch fails, or the bytes are not a
 * valid image (e.g. an HTML error page returned by ResearchGate).
 */
async function resolvePhoto(photoUrl: string | null): Promise<Buffer | null> {
  if (!photoUrl) return null;
  try {
    let rawBuffer: Buffer;
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      rawBuffer = await fetchImageBuffer(photoUrl);
    } else if (photoUrl.startsWith("data:")) {
      // base64 data URI
      const base64Data = photoUrl.split(",")[1];
      if (!base64Data) return null;
      rawBuffer = Buffer.from(base64Data, "base64");
    } else {
      // Local path — resolve relative to the project's client/public directory
      const localPath = path.join(
        __dirname,
        "..",
        "client",
        "public",
        photoUrl.startsWith("/") ? photoUrl.slice(1) : photoUrl
      );
      if (!fs.existsSync(localPath)) return null;
      rawBuffer = fs.readFileSync(localPath);
    }

    // Validate and convert to JPEG using Sharp — this rejects HTML/non-image bytes
    const jpegBuffer = await sharp(rawBuffer)
      .resize(120, 120, { fit: "cover", position: "centre" })
      .jpeg({ quality: 85 })
      .toBuffer();
    return jpegBuffer;
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

  // Pre-fetch all photos in parallel (with a 8 s timeout per image)
  const photoBuffers: (Buffer | null)[] = await Promise.all(
    visibleSpeakers.map(async (spk) => {
      try {
        const result = await Promise.race([
          resolvePhoto(spk.photoUrl),
          new Promise<null>((res) => setTimeout(() => res(null), 8000)),
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
  doc.rect(margin + 60, titleY + 70, contentWidth - 120, 2).fill(COLORS.secondary);
  doc
    .fontSize(36)
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .text("Book of Abstracts", margin, titleY + 90, {
      width: contentWidth,
      align: "center",
    });

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

  // ── ABSTRACTS PAGES ─────────────────────────────────────────────────────
  const photoSize = 100; // square photo width/height in points
  const photoX = pageWidth - margin - photoSize; // right-aligned

  for (let i = 0; i < visibleSpeakers.length; i++) {
    const spk = visibleSpeakers[i];
    doc.addPage();
    let y = margin;

    // ── Speaker header bar ──
    doc.rect(margin, y, contentWidth, 4).fill(COLORS.secondary);
    y += 8;

    // ── Photo (right side) ──
    const photo = photoBuffers[i];
    const photoTopY = y;
    if (photo) {
      // Draw photo with circular clip — fully isolated in save/restore
      const cx = photoX + photoSize / 2;
      const cy = photoTopY + photoSize / 2;
      const r = photoSize / 2;
      try {
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
        // Ensure graphics state is restored even if image() throws
        try { doc.restore(); } catch { /* already restored */ }
        // Draw fallback placeholder circle
        doc
          .circle(cx, cy, r)
          .fillColor(COLORS.lightGray)
          .fill();
      }
    } else {
      // No photo — draw a subtle placeholder
      const cx = photoX + photoSize / 2;
      const cy = photoTopY + photoSize / 2;
      const r = photoSize / 2;
      doc.circle(cx, cy, r).fillColor(COLORS.lightGray).fill();
      // Draw initials
      const initial = spk.fullName ? spk.fullName.charAt(0).toUpperCase() : "?";
      doc
        .fontSize(28)
        .fillColor(COLORS.midGray)
        .font("Helvetica-Bold")
        .text(initial, photoX, photoTopY + photoSize / 2 - 16, {
          width: photoSize,
          align: "center",
          lineBreak: false,
        });
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
        lineBreak: false,
      });

    // Sector badge
    const sectorColors: Record<string, string> = {
      academia: "#1d4ed8",
      industry: "#b45309",
      government: "#15803d",
      international: "#7c3aed",
    };
    const sector = (spk.speakerSector || "academia").toLowerCase();
    const sectorLabel = sector.charAt(0).toUpperCase() + sector.slice(1);
    doc.rect(margin + 38, y + 2, 68, 14).fill(sectorColors[sector] || sectorColors.academia);
    doc
      .fontSize(7)
      .fillColor(COLORS.white)
      .font("Helvetica-Bold")
      .text(sectorLabel, margin + 38, y + 5, { width: 68, align: "center", lineBreak: false });

    // Speaker name
    doc
      .fontSize(14)
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .text(spk.fullName, margin + 38, y + 20, { width: infoWidth - 38, lineBreak: false });

    y += 38;

    // Title
    if (spk.title) {
      doc
        .fontSize(8.5)
        .fillColor(COLORS.midGray)
        .font("Helvetica")
        .text(spk.title, margin, y, { width: infoWidth, lineBreak: false });
      y += 12;
    }
    // Affiliation
    if (spk.affiliation) {
      doc
        .fontSize(9)
        .fillColor(COLORS.accent)
        .font("Helvetica-Bold")
        .text(spk.affiliation, margin, y, { width: infoWidth, lineBreak: false });
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

    // Abstract section header
    y += 4;
    doc.rect(margin, y, contentWidth, 20).fill(COLORS.primary);
    doc
      .fontSize(10)
      .fillColor(COLORS.lightGold)
      .font("Helvetica-Bold")
      .text("Abstract", margin + 8, y + 5, { lineBreak: false });
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
        .text("Speaker Biography", margin + 8, y + 5, { lineBreak: false });
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
    if (i === 0) continue; // skip cover page
    doc.rect(0, pageHeight - 30, pageWidth, 30).fill(COLORS.primary);
    doc
      .fontSize(7)
      .fillColor(COLORS.white)
      .font("Helvetica")
      .text(
        `SCI 2026 · Faculty of Science, Cairo University · April 7–8, 2026  |  Page ${i} of ${totalPages - 1}`,
        margin,
        pageHeight - 18,
        { width: contentWidth, align: "center" }
      );
  }

  doc.end();
}
