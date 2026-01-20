import { mysqlTable, varchar, text, timestamp, int, boolean, decimal, json } from "drizzle-orm/mysql-core";

export const registrations = mysqlTable("registrations", {
  id: int("id").primaryKey().autoincrement(),
  fullNameEnglish: varchar("full_name_english", { length: 255 }).notNull(),
  fullNameArabic: varchar("full_name_arabic", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  affiliation: varchar("affiliation", { length: 255 }).notNull(),
  attendeeCategory: varchar("attendee_category", { length: 50 }).notNull(), // student, faculty, researcher, industry
  participationType: varchar("participation_type", { length: 50 }).notNull(), // attendee, presenter, workshop
  researchTitle: text("research_title"), // optional, for presenters
  researchAbstract: text("research_abstract"), // optional, for presenters
  wantsCertificate: boolean("wants_certificate").default(false).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).default("unpaid").notNull(), // unpaid, pending, paid
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeCheckoutSessionId: varchar("stripe_checkout_session_id", { length: 255 }),
  paidAt: timestamp("paid_at"),
  checkedIn: boolean("checked_in").default(false).notNull(),
  checkedInAt: timestamp("checked_in_at"),
  checkedInBy: varchar("checked_in_by", { length: 255 }), // staff member who checked them in
  isVIP: boolean("is_vip").default(false).notNull(), // VIP status for priority alerts
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;

export const sponsorships = mysqlTable("sponsorships", {
  id: int("id").primaryKey().autoincrement(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  packageType: varchar("package_type", { length: 50 }).notNull(), // platinum, gold, silver, bronze
  companyWebsite: varchar("company_website", { length: 255 }),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Sponsorship = typeof sponsorships.$inferSelect;
export type NewSponsorship = typeof sponsorships.$inferInsert;

// Sessions and Workshops
export const sessions = mysqlTable("sessions", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  titleAr: varchar("title_ar", { length: 255 }).notNull(),
  description: text("description"),
  sessionType: varchar("session_type", { length: 50 }).notNull(), // keynote, research, workshop, panel, break, opening, closing
  track: varchar("track", { length: 100 }), // life-sciences, physical-sciences, etc.
  day: int("day").notNull(), // 1 or 2
  startTime: varchar("start_time", { length: 10 }).notNull(), // HH:MM format
  endTime: varchar("end_time", { length: 10 }).notNull(),
  location: varchar("location", { length: 255 }),
  speakerName: varchar("speaker_name", { length: 255 }),
  speakerTitle: varchar("speaker_title", { length: 255 }),
  speakerAffiliation: varchar("speaker_affiliation", { length: 255 }),
  speakerBio: text("speaker_bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

// Support Tickets
export const supportTickets = mysqlTable("support_tickets", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("open"), // open, in-progress, resolved
  priority: varchar("priority", { length: 50 }).notNull().default("normal"), // low, normal, high
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type NewSupportTicket = typeof supportTickets.$inferInsert;

// Payment tracking for certificate purchases
export const payments = mysqlTable("payments", {
  id: int("id").primaryKey().autoincrement(),
  registrationId: int("registration_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("EGP"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull(), // pending, completed, failed
  certificateRequested: boolean("certificate_requested").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

// Admin users with role-based access
export const admins = mysqlTable("admins", {
  id: int("id").primaryKey().autoincrement(),
  openId: varchar("open_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("viewer"), // super_admin, moderator, viewer
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by", { length: 255 }), // openId of the admin who created this admin
});

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

// Audit log for tracking all admin actions
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").primaryKey().autoincrement(),
  adminId: int("admin_id"), // null if action by system
  adminEmail: varchar("admin_email", { length: 255 }),
  adminName: varchar("admin_name", { length: 255 }),
  action: varchar("action", { length: 100 }).notNull(), // create, update, delete, export, login, logout
  resourceType: varchar("resource_type", { length: 100 }).notNull(), // registration, session, sponsorship, admin, etc.
  resourceId: int("resource_id"), // ID of the affected resource
  details: text("details"), // JSON string with additional details
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

// Email Digest Preferences
export const digestPreferences = mysqlTable("digest_preferences", {
  id: int("id").primaryKey().autoincrement(),
  adminId: int("admin_id").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  frequency: varchar("frequency", { length: 20 }).notNull(), // daily, weekly, disabled
  enabled: boolean("enabled").default(true).notNull(),
  lastSentAt: timestamp("last_sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DigestPreference = typeof digestPreferences.$inferSelect;
export type NewDigestPreference = typeof digestPreferences.$inferInsert;

// Post-Event Surveys
export const surveys = mysqlTable("surveys", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  questions: json("questions").notNull(), // Array of question objects
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, scheduled, sent, closed
  scheduledSendDate: timestamp("scheduled_send_date"),
  sentAt: timestamp("sent_at"),
  createdBy: int("created_by").notNull(), // admin ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Survey = typeof surveys.$inferSelect;
export type NewSurvey = typeof surveys.$inferInsert;

export const surveyResponses = mysqlTable("survey_responses", {
  id: int("id").primaryKey().autoincrement(),
  surveyId: int("survey_id").notNull(),
  registrationId: int("registration_id").notNull(),
  answers: json("answers").notNull(), // Object mapping question IDs to answers
  sentiment: varchar("sentiment", { length: 20 }), // positive, neutral, negative (calculated via LLM)
  sentimentScore: int("sentiment_score"), // -100 to 100
  ipAddress: varchar("ip_address", { length: 45 }),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type NewSurveyResponse = typeof surveyResponses.$inferInsert;

// Conference Reminder Subscriptions
export const reminderSubscriptions = mysqlTable("reminder_subscriptions", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  reminderSent: boolean("reminder_sent").default(false).notNull(),
  reminderSentAt: timestamp("reminder_sent_at"),
  unsubscribed: boolean("unsubscribed").default(false).notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

export type ReminderSubscription = typeof reminderSubscriptions.$inferSelect;
export type NewReminderSubscription = typeof reminderSubscriptions.$inferInsert;

// Gallery Photos
export const galleryPhotos = mysqlTable("gallery_photos", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  titleAr: varchar("title_ar", { length: 255 }),
  description: text("description"),
  descriptionAr: text("description_ar"),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  imageKey: varchar("image_key", { length: 500 }).notNull(), // S3 key for deletion
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  category: varchar("category", { length: 100 }).notNull(), // opening, workshops, presentations, networking, closing, general
  uploadedBy: varchar("uploaded_by", { length: 255 }).notNull(), // admin openId
  uploaderName: varchar("uploader_name", { length: 255 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
});

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type NewGalleryPhoto = typeof galleryPhotos.$inferInsert;
