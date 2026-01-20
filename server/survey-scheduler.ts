import cron from "node-cron";
import { processScheduledSurveys } from "./survey-distribution.js";

/**
 * Initialize survey scheduling
 * - Check for scheduled surveys every hour
 */
export function initializeSurveyScheduler() {
  console.log("[Survey Scheduler] Initializing survey scheduler...");

  // Check for scheduled surveys every hour
  // Cron format: second minute hour day month weekday
  // 0 0 * * * * = At the start of every hour
  cron.schedule("0 0 * * * *", async () => {
    console.log("[Survey Scheduler] Checking for scheduled surveys...");
    try {
      await processScheduledSurveys();
    } catch (error) {
      console.error("[Survey Scheduler] Error processing scheduled surveys:", error);
    }
  }, {
    timezone: "Africa/Cairo" // Cairo timezone for the conference
  });

  console.log("[Survey Scheduler] Survey scheduler initialized (checks every hour)");
}

/**
 * Manually trigger survey processing (for testing or manual sends)
 */
export async function triggerManualSurveyCheck(): Promise<void> {
  console.log("[Survey Scheduler] Manually triggering survey check...");
  try {
    await processScheduledSurveys();
    console.log("[Survey Scheduler] Manual survey check completed");
  } catch (error) {
    console.error("[Survey Scheduler] Error in manual survey check:", error);
    throw error;
  }
}
