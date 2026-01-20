import { db } from "./db.js";
import { registrations, auditLogs, admins, digestPreferences } from "../drizzle/schema.js";
import { sql, eq, and, gte } from "drizzle-orm";

export interface DigestMetrics {
  period: "daily" | "weekly";
  startDate: Date;
  endDate: Date;
  totalRegistrations: number;
  newRegistrations: number;
  totalCheckIns: number;
  newCheckIns: number;
  vipCount: number;
  categoryBreakdown: Record<string, number>;
  recentRegistrations: Array<{
    name: string;
    email: string;
    category: string;
    createdAt: Date;
  }>;
  recentCheckIns: Array<{
    name: string;
    email: string;
    checkedInAt: Date;
    isVIP: boolean;
  }>;
  adminActions: number;
  insights: string[];
}

/**
 * Calculate digest metrics for a given time period
 */
export async function calculateDigestMetrics(
  period: "daily" | "weekly"
): Promise<DigestMetrics> {
  const now = new Date();
  const startDate = new Date(now);
  
  if (period === "daily") {
    // Last 24 hours
    startDate.setDate(startDate.getDate() - 1);
  } else {
    // Last 7 days
    startDate.setDate(startDate.getDate() - 7);
  }

  // Get total registrations
  const [totalResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(registrations);
  const totalRegistrations = Number(totalResult.count);

  // Get new registrations in period
  const [newRegResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(registrations)
    .where(gte(registrations.createdAt, startDate));
  const newRegistrations = Number(newRegResult.count);

  // Get total check-ins
  const [totalCheckInsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(registrations)
    .where(eq(registrations.checkedIn, true));
  const totalCheckIns = Number(totalCheckInsResult.count);

  // Get new check-ins in period
  const [newCheckInsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(registrations)
    .where(
      and(
        eq(registrations.checkedIn, true),
        gte(registrations.checkedInAt!, startDate)
      )
    );
  const newCheckIns = Number(newCheckInsResult.count);

  // Get VIP count
  const [vipResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(registrations)
    .where(eq(registrations.isVIP, true));
  const vipCount = Number(vipResult.count);

  // Get category breakdown
  const categoryResults = await db
    .select({
      category: registrations.attendeeCategory,
      count: sql<number>`count(*)`,
    })
    .from(registrations)
    .groupBy(registrations.attendeeCategory);

  const categoryBreakdown: Record<string, number> = {};
  for (const row of categoryResults) {
    categoryBreakdown[row.category] = Number(row.count);
  }

  // Get recent registrations (last 10)
  const recentRegResults = await db
    .select({
      name: registrations.fullNameEnglish,
      email: registrations.email,
      category: registrations.attendeeCategory,
      createdAt: registrations.createdAt,
    })
    .from(registrations)
    .where(gte(registrations.createdAt, startDate))
    .orderBy(sql`${registrations.createdAt} DESC`)
    .limit(10);

  const recentRegistrations = recentRegResults.map((r) => ({
    name: r.name,
    email: r.email,
    category: r.category,
    createdAt: r.createdAt,
  }));

  // Get recent check-ins (last 10)
  const recentCheckInResults = await db
    .select({
      name: registrations.fullNameEnglish,
      email: registrations.email,
      checkedInAt: registrations.checkedInAt,
      isVIP: registrations.isVIP,
    })
    .from(registrations)
    .where(
      and(
        eq(registrations.checkedIn, true),
        gte(registrations.checkedInAt!, startDate)
      )
    )
    .orderBy(sql`${registrations.checkedInAt} DESC`)
    .limit(10);

  const recentCheckIns = recentCheckInResults.map((r) => ({
    name: r.name,
    email: r.email,
    checkedInAt: r.checkedInAt!,
    isVIP: r.isVIP,
  }));

  // Get admin actions count
  const [adminActionsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(auditLogs)
    .where(gte(auditLogs.timestamp, startDate));
  const adminActions = Number(adminActionsResult.count);

  // Generate insights
  const insights: string[] = [];

  // Check-in rate insight
  const checkInRate = totalRegistrations > 0 
    ? (totalCheckIns / totalRegistrations) * 100 
    : 0;
  if (checkInRate < 50) {
    insights.push(
      `Check-in rate is ${checkInRate.toFixed(1)}%. Consider sending reminder emails to attendees.`
    );
  }

  // New registrations trend
  if (newRegistrations === 0 && period === "daily") {
    insights.push("No new registrations today. Consider promoting the event on social media.");
  } else if (newRegistrations > 10 && period === "daily") {
    insights.push(`Strong registration activity with ${newRegistrations} new sign-ups today!`);
  }

  // Category balance insight
  const categories = Object.entries(categoryBreakdown);
  if (categories.length > 0) {
    const sortedCategories = categories.sort((a, b) => b[1] - a[1]);
    const lowestCategory = sortedCategories[sortedCategories.length - 1];
    if (lowestCategory[1] < totalRegistrations * 0.1) {
      insights.push(
        `Low registration in "${lowestCategory[0]}" category (${lowestCategory[1]} attendees). Consider targeted outreach.`
      );
    }
  }

  // VIP insight
  if (vipCount > 0) {
    insights.push(`${vipCount} VIP attendees registered. Ensure special arrangements are in place.`);
  }

  return {
    period,
    startDate,
    endDate: now,
    totalRegistrations,
    newRegistrations,
    totalCheckIns,
    newCheckIns,
    vipCount,
    categoryBreakdown,
    recentRegistrations,
    recentCheckIns,
    adminActions,
    insights,
  };
}

/**
 * Generate HTML email template from metrics
 */
export function generateDigestEmail(metrics: DigestMetrics): string {
  const periodLabel = metrics.period === "daily" ? "Daily" : "Weekly";
  const dateRange = `${metrics.startDate.toLocaleDateString()} - ${metrics.endDate.toLocaleDateString()}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SCI 2026 ${periodLabel} Digest</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #1e40af;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e40af;
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .header p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .metric-card {
      background-color: #f8fafc;
      border-radius: 6px;
      padding: 15px;
      border-left: 4px solid #1e40af;
    }
    .metric-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #1e40af;
    }
    .metric-change {
      font-size: 12px;
      color: #059669;
      margin-top: 5px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .category-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #f8fafc;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .category-name {
      font-weight: 500;
      text-transform: capitalize;
    }
    .category-count {
      font-weight: bold;
      color: #1e40af;
    }
    .activity-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .activity-item {
      padding: 12px;
      background-color: #f8fafc;
      border-radius: 4px;
      margin-bottom: 8px;
      border-left: 3px solid #1e40af;
    }
    .activity-name {
      font-weight: 500;
      color: #333;
    }
    .activity-details {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .vip-badge {
      display: inline-block;
      background-color: #fbbf24;
      color: #78350f;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 3px;
      margin-left: 8px;
    }
    .insights {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 30px;
    }
    .insights-title {
      font-weight: bold;
      color: #92400e;
      margin-bottom: 10px;
    }
    .insights-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .insights-item {
      color: #78350f;
      padding: 5px 0;
      padding-left: 20px;
      position: relative;
    }
    .insights-item:before {
      content: "💡";
      position: absolute;
      left: 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SCI 2026 ${periodLabel} Digest</h1>
      <p>${dateRange}</p>
    </div>

    <div class="metrics">
      <div class="metric-card">
        <div class="metric-label">Total Registrations</div>
        <div class="metric-value">${metrics.totalRegistrations}</div>
        ${metrics.newRegistrations > 0 ? `<div class="metric-change">+${metrics.newRegistrations} new</div>` : ''}
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Check-Ins</div>
        <div class="metric-value">${metrics.totalCheckIns}</div>
        ${metrics.newCheckIns > 0 ? `<div class="metric-change">+${metrics.newCheckIns} new</div>` : ''}
      </div>
      <div class="metric-card">
        <div class="metric-label">VIP Attendees</div>
        <div class="metric-value">${metrics.vipCount}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Admin Actions</div>
        <div class="metric-value">${metrics.adminActions}</div>
      </div>
    </div>

    ${metrics.insights.length > 0 ? `
    <div class="insights">
      <div class="insights-title">Actionable Insights</div>
      <ul class="insights-list">
        ${metrics.insights.map(insight => `<li class="insights-item">${insight}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <div class="section">
      <div class="section-title">Category Breakdown</div>
      <ul class="category-list">
        ${Object.entries(metrics.categoryBreakdown)
          .sort((a, b) => b[1] - a[1])
          .map(([category, count]) => `
            <li class="category-item">
              <span class="category-name">${category}</span>
              <span class="category-count">${count}</span>
            </li>
          `).join('')}
      </ul>
    </div>

    ${metrics.recentRegistrations.length > 0 ? `
    <div class="section">
      <div class="section-title">Recent Registrations</div>
      <ul class="activity-list">
        ${metrics.recentRegistrations.map(reg => `
          <li class="activity-item">
            <div class="activity-name">${reg.name}</div>
            <div class="activity-details">
              ${reg.email} • ${reg.category} • ${reg.createdAt.toLocaleString()}
            </div>
          </li>
        `).join('')}
      </ul>
    </div>
    ` : ''}

    ${metrics.recentCheckIns.length > 0 ? `
    <div class="section">
      <div class="section-title">Recent Check-Ins</div>
      <ul class="activity-list">
        ${metrics.recentCheckIns.map(checkin => `
          <li class="activity-item">
            <div class="activity-name">
              ${checkin.name}
              ${checkin.isVIP ? '<span class="vip-badge">VIP</span>' : ''}
            </div>
            <div class="activity-details">
              ${checkin.email} • ${checkin.checkedInAt.toLocaleString()}
            </div>
          </li>
        `).join('')}
      </ul>
    </div>
    ` : ''}

    <div class="footer">
      <p>This is an automated digest from SCI 2026 Conference Management System</p>
      <p>Science at the Core of Innovation • Faculty of Science, Cairo University</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send digest email to an admin
 */
export async function sendDigestEmail(
  email: string,
  metrics: DigestMetrics
): Promise<boolean> {
  const htmlContent = generateDigestEmail(metrics);
  const periodLabel = metrics.period === "daily" ? "Daily" : "Weekly";
  
  try {
    // TODO: Use the built-in notification system to send email
    // For now, just log that we would send the digest
    console.log(`[Email Digest] Would send ${periodLabel} digest to ${recipient.email}`);
    console.log(`[Email Digest] Digest contains ${data.totalRegistrations} total registrations, ${data.newRegistrations} new`);
    
    return true;
  } catch (error) {
    console.error("[Email Digest] Failed to send email:", error);
    return false;
  }
}

/**
 * Send digests to all enabled admins based on their preferences
 */
export async function sendScheduledDigests(frequency: "daily" | "weekly"): Promise<void> {
  console.log(`[Email Digest] Sending ${frequency} digests...`);
  
  // Get all enabled preferences for this frequency
  const preferences = await db
    .select()
    .from(digestPreferences)
    .where(
      and(
        eq(digestPreferences.enabled, true),
        eq(digestPreferences.frequency, frequency)
      )
    );

  if (preferences.length === 0) {
    console.log(`[Email Digest] No enabled ${frequency} digest preferences found`);
    return;
  }

  // Calculate metrics
  const metrics = await calculateDigestMetrics(frequency);

  // Send to each admin
  for (const pref of preferences) {
    try {
      const success = await sendDigestEmail(pref.email, metrics);
      
      if (success) {
        // Update last sent timestamp
        await db
          .update(digestPreferences)
          .set({ lastSentAt: new Date() })
          .where(eq(digestPreferences.id, pref.id));
        
        console.log(`[Email Digest] Sent ${frequency} digest to ${pref.email}`);
      } else {
        console.error(`[Email Digest] Failed to send ${frequency} digest to ${pref.email}`);
      }
    } catch (error) {
      console.error(`[Email Digest] Error sending digest to ${pref.email}:`, error);
    }
  }
  
  console.log(`[Email Digest] Finished sending ${frequency} digests`);
}
