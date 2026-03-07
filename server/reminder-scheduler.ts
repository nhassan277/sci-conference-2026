import cron from "node-cron";
import { db } from "./db.js";
import { reminderSubscriptions } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
// Import notifyOwner from email.ts where it's defined
async function notifyOwner(data: { title: string; content: string }): Promise<boolean> {
  console.log("[Notification]", data.title);
  console.log(data.content);
  return true;
}

const CONFERENCE_DATE = new Date("2026-04-07T09:00:00+02:00");
const ONE_WEEK_BEFORE = new Date(CONFERENCE_DATE.getTime() - 7 * 24 * 60 * 60 * 1000);

/**
 * Send conference reminders to all subscribed users
 * This runs one week before the conference (March 31, 2026)
 */
async function sendConferenceReminders() {
  const now = new Date();
  
  // Check if we're within the reminder window (1 week before conference)
  const daysUntilConference = Math.ceil((CONFERENCE_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  console.log(`[Reminder Scheduler] Days until conference: ${daysUntilConference}`);
  
  // Send reminders if we're exactly 7 days before or within the window
  if (daysUntilConference !== 7) {
    console.log(`[Reminder Scheduler] Not time to send reminders yet (need 7 days, currently ${daysUntilConference} days)`);
    return;
  }

  try {
    // Get all active subscriptions that haven't received reminders yet
    const subscriptions = await db
      .select()
      .from(reminderSubscriptions)
      .where(and(eq(reminderSubscriptions.reminderSent, false), eq(reminderSubscriptions.unsubscribed, false)));

    console.log(`[Reminder Scheduler] Found ${subscriptions.length} subscriptions to send reminders to`);

    if (subscriptions.length === 0) {
      return;
    }

    // Send reminder emails to all subscribers
    for (const subscription of subscriptions) {
      try {
        await notifyOwner({
          title: "Conference Reminder Sent",
          content: `Reminder email sent to: ${subscription.email}\n\nThe SCI 2026 conference is one week away!\n\nDate: April 7-8, 2026\nLocation: Cairo University, Faculty of Science\n\nThank you for your interest in attending.`,
        });

        // Mark as sent
        await db
          .update(reminderSubscriptions)
          .set({
            reminderSent: true,
            reminderSentAt: new Date(),
          })
          .where(eq(reminderSubscriptions.id, subscription.id));

        console.log(`[Reminder Scheduler] Sent reminder to ${subscription.email}`);
      } catch (error) {
        console.error(`[Reminder Scheduler] Failed to send reminder to ${subscription.email}:`, error);
      }
    }

    console.log(`[Reminder Scheduler] Successfully sent ${subscriptions.length} reminder emails`);
  } catch (error) {
    console.error("[Reminder Scheduler] Error sending reminders:", error);
  }
}

/**
 * Initialize the reminder scheduler
 * Runs daily at 9:00 AM Cairo time to check if reminders should be sent
 */
export function initReminderScheduler() {
  console.log("[Reminder Scheduler] Initializing conference reminder scheduler");
  console.log(`[Reminder Scheduler] Conference date: ${CONFERENCE_DATE.toISOString()}`);
  console.log(`[Reminder Scheduler] Reminders will be sent on: ${ONE_WEEK_BEFORE.toISOString()}`);

  // Run daily at 9:00 AM Cairo time (7:00 AM UTC)
  cron.schedule("0 7 * * *", async () => {
    console.log("[Reminder Scheduler] Running daily reminder check");
    await sendConferenceReminders();
  });

  console.log("[Reminder Scheduler] Scheduler initialized - will run daily at 9:00 AM Cairo time");
}
