import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "./db.js";
import { sci2027MediaRequests, sci2027SponsorRequests } from "../drizzle/schema.js";
import type { MediaRequestInput, SponsorRequestInput, RequestKind, RequestStatus } from "../shared/sci2027Requests.js";

// mysql2 errors may be wrapped by DrizzleQueryError. Do not treat an arbitrary
// persistence error as a successful retry or overwrite the original request.
function isDuplicateKey(error: unknown): boolean {
  let current = error;
  for (let depth = 0; depth < 5 && current && typeof current === "object"; depth++) {
    const candidate = current as { code?: string; errno?: number; cause?: unknown };
    if (candidate.code === "ER_DUP_ENTRY" || candidate.errno === 1062) return true;
    current = candidate.cause;
  }
  return false;
}

export async function submitMediaRequest(input: MediaRequestInput): Promise<string> {
  const submissionKey = input.submissionKey.toLowerCase();
  const [existing] = await db.select().from(sci2027MediaRequests).where(eq(sci2027MediaRequests.submissionKey, submissionKey)).limit(1);
  if (existing) return existing.reference;
  const { contactWebsite: _honeypot, ...fields } = input;
  const reference = `SCI2027-M-${randomUUID()}`;
  try {
    await db.insert(sci2027MediaRequests).values({
      ...fields, submissionKey, reference, year: 2027, status: "pending", consent: true,
      website: input.website || null, notes: input.notes || null,
    });
    return reference;
  } catch (error) {
    if (isDuplicateKey(error)) {
      // Unique submission_key serializes racing inserts. Read the committed
      // winner after duplicate rejection; no transaction snapshot hides it.
      const [winner] = await db.select().from(sci2027MediaRequests).where(eq(sci2027MediaRequests.submissionKey, submissionKey)).limit(1);
      if (winner) return winner.reference;
    }
    throw error;
  }
}

export async function submitSponsorRequest(input: SponsorRequestInput): Promise<string> {
  const submissionKey = input.submissionKey.toLowerCase();
  const [existing] = await db.select().from(sci2027SponsorRequests).where(eq(sci2027SponsorRequests.submissionKey, submissionKey)).limit(1);
  if (existing) return existing.reference;
  const { contactWebsite: _honeypot, ...fields } = input;
  const reference = `SCI2027-S-${randomUUID()}`;
  try {
    await db.insert(sci2027SponsorRequests).values({
      ...fields, submissionKey, reference, year: 2027, status: "pending", consent: true,
      website: input.website || null, notes: input.notes || null,
    });
    return reference;
  } catch (error) {
    if (isDuplicateKey(error)) {
      const [winner] = await db.select().from(sci2027SponsorRequests).where(eq(sci2027SponsorRequests.submissionKey, submissionKey)).limit(1);
      if (winner) return winner.reference;
    }
    throw error;
  }
}

export async function listRequests(kind: RequestKind) {
  if (kind === "media") {
    const rows = await db.select().from(sci2027MediaRequests).orderBy(desc(sci2027MediaRequests.createdAt), desc(sci2027MediaRequests.id));
    return rows.map(row => ({ ...row, kind: "media" as const }));
  }
  const rows = await db.select().from(sci2027SponsorRequests).orderBy(desc(sci2027SponsorRequests.createdAt), desc(sci2027SponsorRequests.id));
  return rows.map(row => ({ ...row, kind: "sponsor" as const }));
}
export type Sci2027RequestRow = Awaited<ReturnType<typeof listRequests>>[number];

export async function updateRequest(input: { kind: RequestKind; id: number; status: RequestStatus; adminNotes?: string }): Promise<boolean> {
  const table = input.kind === "media" ? sci2027MediaRequests : sci2027SponsorRequests;
  const [existing] = await db.select().from(table).where(eq(table.id, input.id)).limit(1);
  if (!existing) return false;
  // Only these two administrative fields may be changed. No delete endpoint.
  await db.update(table).set({ status: input.status, adminNotes: input.adminNotes || null, updatedAt: new Date() }).where(eq(table.id, input.id));
  return true;
}
