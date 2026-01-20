import cron from "node-cron";
import { sendScheduledDigests } from "./email-digest.js";

/**
 * Initialize digest scheduling
 * - Daily digests: Every day at 8:00 AM
 * - Weekly digests: Every Monday at 8:00 AM
 */
export function initializeDigestScheduler() {
  console.log("[Digest Scheduler] Initializing email digest scheduler...");

  // Daily digest: Every day at 8:00 AM
  // Cron format: second minute hour day month weekday
  // 0 0 8 * * * = At 8:00 AM every day
  cron.schedule("0 0 8 * * *", async () => {
    console.log("[Digest Scheduler] Running daily digest job...");
    try {
      await sendScheduledDigests("daily");
    } catch (error) {
      console.error("[Digest Scheduler] Error in daily digest job:", error);
    }
  }, {
    timezone: "Africa/Cairo" // Cairo timezone for the conference
  });

  console.log("[Digest Scheduler] Daily digest scheduled for 8:00 AM (Africa/Cairo)");

  // Weekly digest: Every Monday at 8:00 AM
  // 0 0 8 * * 1 = At 8:00 AM on Monday
  cron.schedule("0 0 8 * * 1", async () => {
    console.log("[Digest Scheduler] Running weekly digest job...");
    try {
      await sendScheduledDigests("weekly");
    } catch (error) {
      console.error("[Digest Scheduler] Error in weekly digest job:", error);
    }
  }, {
    timezone: "Africa/Cairo"
  });

  console.log("[Digest Scheduler] Weekly digest scheduled for Mondays at 8:00 AM (Africa/Cairo)");
  console.log("[Digest Scheduler] Email digest scheduler initialized successfully");
}

/**
 * Manually trigger a digest send (for testing or manual sends)
 */
export async function triggerManualDigest(frequency: "daily" | "weekly"): Promise<void> {
  console.log(`[Digest Scheduler] Manually triggering ${frequency} digest...`);
  try {
    await sendScheduledDigests(frequency);
    console.log(`[Digest Scheduler] Manual ${frequency} digest completed`);
  } catch (error) {
    console.error(`[Digest Scheduler] Error in manual ${frequency} digest:`, error);
    throw error;
  }
}
