import { db } from "./db.js";
import { surveys, surveyResponses, registrations } from "../drizzle/schema.js";
import { eq, and, isNull } from "drizzle-orm";

/**
 * Generate a unique survey link for a registration
 */
export function generateSurveyLink(surveyId: number, registrationId: number): string {
  const baseUrl = process.env.VITE_APP_URL || "https://sci-conference-2026.manus.space";
  // Simple encoding: base64 of surveyId-registrationId
  const token = Buffer.from(`${surveyId}-${registrationId}`).toString("base64url");
  return `${baseUrl}/survey/${token}`;
}

/**
 * Decode survey link token to get surveyId and registrationId
 */
export function decodeSurveyToken(token: string): { surveyId: number; registrationId: number } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [surveyId, registrationId] = decoded.split("-").map(Number);
    if (isNaN(surveyId) || isNaN(registrationId)) {
      return null;
    }
    return { surveyId, registrationId };
  } catch {
    return null;
  }
}

/**
 * Send survey email to a single attendee
 */
export async function sendSurveyEmail(
  surveyId: number,
  registrationId: number,
  surveyTitle: string,
  surveyDescription: string
): Promise<boolean> {
  try {
    const [registration] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, registrationId))
      .limit(1);

    if (!registration) {
      console.error(`[Survey] Registration ${registrationId} not found`);
      return false;
    }

    const surveyLink = generateSurveyLink(surveyId, registrationId);

    // TODO: Integrate with actual email service
    // For now, just log that we would send the email
    console.log(`[Survey] Would send survey email to ${registration.email}`);
    console.log(`[Survey] Survey: ${surveyTitle}`);
    console.log(`[Survey] Link: ${surveyLink}`);

    return true;
  } catch (error) {
    console.error("[Survey] Failed to send survey email:", error);
    return false;
  }
}

/**
 * Distribute survey to all attendees who haven't responded yet
 */
export async function distributeSurvey(surveyId: number): Promise<{
  sent: number;
  failed: number;
  alreadyResponded: number;
}> {
  console.log(`[Survey] Starting distribution for survey ${surveyId}`);

  const [survey] = await db
    .select()
    .from(surveys)
    .where(eq(surveys.id, surveyId))
    .limit(1);

  if (!survey) {
    throw new Error(`Survey ${surveyId} not found`);
  }

  if (survey.status === "closed") {
    throw new Error(`Survey ${surveyId} is closed`);
  }

  // Get all registrations
  const allRegistrations = await db.select().from(registrations);

  // Get existing responses
  const existingResponses = await db
    .select({ registrationId: surveyResponses.registrationId })
    .from(surveyResponses)
    .where(eq(surveyResponses.surveyId, surveyId));

  const respondedIds = new Set(existingResponses.map((r) => r.registrationId));

  let sent = 0;
  let failed = 0;
  let alreadyResponded = 0;

  for (const registration of allRegistrations) {
    if (respondedIds.has(registration.id)) {
      alreadyResponded++;
      continue;
    }

    const success = await sendSurveyEmail(
      surveyId,
      registration.id,
      survey.title,
      survey.description || ""
    );

    if (success) {
      sent++;
    } else {
      failed++;
    }

    // Add small delay to avoid overwhelming email service
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Update survey status to "sent" if not already
  if (survey.status === "scheduled" || survey.status === "draft") {
    await db
      .update(surveys)
      .set({
        status: "sent",
        sentAt: new Date(),
      })
      .where(eq(surveys.id, surveyId));
  }

  console.log(
    `[Survey] Distribution complete: ${sent} sent, ${failed} failed, ${alreadyResponded} already responded`
  );

  return { sent, failed, alreadyResponded };
}

/**
 * Check for scheduled surveys and send them
 */
export async function processScheduledSurveys(): Promise<void> {
  console.log("[Survey] Checking for scheduled surveys...");

  const now = new Date();

  const scheduledSurveys = await db
    .select()
    .from(surveys)
    .where(
      and(
        eq(surveys.status, "scheduled"),
        // scheduledSendDate is not null and is in the past
        isNull(surveys.sentAt)
      )
    );

  for (const survey of scheduledSurveys) {
    if (!survey.scheduledSendDate) continue;
    if (survey.scheduledSendDate > now) continue;

    console.log(`[Survey] Processing scheduled survey: ${survey.title}`);

    try {
      await distributeSurvey(survey.id);
    } catch (error) {
      console.error(`[Survey] Failed to distribute survey ${survey.id}:`, error);
    }
  }
}
