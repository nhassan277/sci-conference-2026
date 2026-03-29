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
  certificateInvoiceUrl: varchar("certificate_invoice_url", { length: 500 }), // uploaded payment receipt for certificate
  wantsWorkshop: boolean("wants_workshop").default(false).notNull(),
  workshopChoice: varchar("workshop_choice", { length: 50 }), // legacy single choice
  workshopChoices: json("workshop_choices").$type<string[]>(), // multi-select: array of workshop keys
  workshopInvoiceUrl: varchar("workshop_invoice_url", { length: 500 }), // uploaded payment receipt for workshop
  workshopPaymentStatus: varchar("workshop_payment_status", { length: 20 }).default("unpaid").notNull(),
  // Pre/Post conference workshops (350 EGP)
  wantsExtWorkshop: boolean("wants_ext_workshop").default(false).notNull(),
  extWorkshopChoice: varchar("ext_workshop_choice", { length: 100 }), // ai_biotech, etc. (legacy single)
  extWorkshopChoices: json("ext_workshop_choices").$type<string[]>(), // multi-select array
  extWorkshopInvoiceUrl: varchar("ext_workshop_invoice_url", { length: 500 }),
  extWorkshopPaymentStatus: varchar("ext_workshop_payment_status", { length: 20 }).default("unpaid").notNull(),
  // Bundle: MARC + Chitosan flash offer at 150 EGP (instead of 300 EGP)
  extWorkshopBundle: varchar("ext_workshop_bundle", { length: 50 }), // "marc_chitosan" when bundle is selected
  paymentStatus: varchar("payment_status", { length: 20 }).default("unpaid").notNull(), // unpaid, pending, paid
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeCheckoutSessionId: varchar("stripe_checkout_session_id", { length: 255 }),
  paidAt: timestamp("paid_at"),
  checkedIn: boolean("checked_in").default(false).notNull(),
  checkedInAt: timestamp("checked_in_at"),
  checkedInBy: varchar("checked_in_by", { length: 255 }), // staff member who checked them in
  isVIP: boolean("is_vip").default(false).notNull(), // VIP status for priority alerts
  sourceSheetId: varchar("source_sheet_id", { length: 255 }), // Google Sheet ID where this registration came from
  sourceRowIndex: int("source_row_index"), // Row number in the source sheet
  rawFormData: json("raw_form_data"), // Store original form data for reference
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, confirmed, rejected
  logoUrl: varchar("logo_url", { length: 500 }),
  bannerUrl: varchar("banner_url", { length: 500 }),
  brochureUrl: varchar("brochure_url", { length: 500 }),
  workshopMaterialsUrl: varchar("workshop_materials_url", { length: 500 }),
  companyDescription: text("company_description"),
  materialsUploadedAt: timestamp("materials_uploaded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

// Volunteer Applications for Conference Organization
export const volunteers = mysqlTable("volunteers", {
  id: int("id").primaryKey().autoincrement(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  studentId: varchar("student_id", { length: 50 }).notNull(),
  academicYear: varchar("academic_year", { length: 20 }).notNull(), // 1, 2, 3, 4, graduate
  department: varchar("department", { length: 255 }).notNull(),
  preferredCommittee: varchar("preferred_committee", { length: 100 }).notNull(), // hall_organization, reception, logistics, etc.
  secondChoiceCommittee: varchar("second_choice_committee", { length: 100 }),
  skills: text("skills"), // Technical skills, languages, etc.
  previousExperience: text("previous_experience"),
  availability: json("availability"), // {day1: boolean, day2: boolean, beforeConference: boolean}
  whyVolunteer: text("why_volunteer"),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, approved, rejected
  assignedCommittee: varchar("assigned_committee", { length: 100 }),
  notes: text("notes"), // Admin notes
  reviewedBy: varchar("reviewed_by", { length: 255 }), // Admin who reviewed
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Volunteer = typeof volunteers.$inferSelect;
export type NewVolunteer = typeof volunteers.$inferInsert;

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

// Newsletter Subscriptions
export const newsletterSubscriptions = mysqlTable("newsletter_subscriptions", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  source: varchar("source", { length: 50 }).default("website").notNull(), // website, registration, manual
});

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;

// Google Sheets Sync Tracking
export const googleSheetsSyncs = mysqlTable("google_sheets_syncs", {
  id: int("id").primaryKey().autoincrement(),
  sheetId: varchar("sheet_id", { length: 255 }).notNull().unique(),
  sheetName: varchar("sheet_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // student, faculty, external, industry
  lastSyncedAt: timestamp("last_synced_at"),
  lastRowCount: int("last_row_count").default(0),
  syncStatus: varchar("sync_status", { length: 50 }).default("pending").notNull(), // pending, syncing, success, error
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GoogleSheetsSync = typeof googleSheetsSyncs.$inferSelect;
export type NewGoogleSheetsSync = typeof googleSheetsSyncs.$inferInsert;

// Media Registrations (Press & TV Coverage)
export const mediaRegistrations = mysqlTable("media_registrations", {
  id: int("id").primaryKey().autoincrement(),
  // Conference Info
  conferenceName: varchar("conference_name", { length: 255 }).notNull().default("SCI 2026"),
  conferenceDate: varchar("conference_date", { length: 100 }).notNull().default("April 7-8, 2026"),
  conferenceLocation: varchar("conference_location", { length: 255 }).notNull().default("Faculty of Science, Cairo University"),
  
  // Media Organization Info
  organizationName: varchar("organization_name", { length: 255 }).notNull(),
  organizationType: varchar("organization_type", { length: 50 }).notNull(), // newspaper, news_website, tv_channel, radio
  coverageType: varchar("coverage_type", { length: 50 }).notNull(), // written, photo, video, live_broadcast
  
  // Journalist/Reporter Info
  fullName: varchar("full_name", { length: 255 }).notNull(),
  jobTitle: varchar("job_title", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  pressCardNumber: varchar("press_card_number", { length: 100 }), // optional
  
  // Coverage Team (stored as JSON array)
  teamMembers: json("team_members"), // [{name: string, role: string, phone: string}]
  
  // Status & Approval
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, approved, rejected
  approvedBy: varchar("approved_by", { length: 255 }), // admin openId
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  
  // Badge & Access
  badgeIssued: boolean("badge_issued").default(false).notNull(),
  badgeIssuedAt: timestamp("badge_issued_at"),
  badgeNumber: varchar("badge_number", { length: 50 }),
  
  // Compliance
  agreementAccepted: boolean("agreement_accepted").default(true).notNull(),
  
  // Metadata
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  notes: text("notes"), // admin notes
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MediaRegistration = typeof mediaRegistrations.$inferSelect;
export type NewMediaRegistration = typeof mediaRegistrations.$inferInsert;

// Conference Committees
export const committees = mysqlTable("committees", {
  id: int("id").primaryKey().autoincrement(),
  
  // Member Information
  fullName: varchar("full_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(), // Prof., Dr., etc.
  
  // Committee Details
  committeeType: varchar("committee_type", { length: 50 }).notNull(), // scientific, organizing, reception, technical
  department: varchar("department", { length: 255 }), // For scientific committees: Zoology, Physics, etc.
  role: varchar("role", { length: 100 }), // Chair, Co-chair, Member, etc.
  
  // Contact (optional)
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  
  // Display Order
  displayOrder: int("display_order").default(0).notNull(),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Committee = typeof committees.$inferSelect;
export type NewCommittee = typeof committees.$inferInsert;

// Keynote Speakers
export const keynoteSpeakers = mysqlTable("keynote_speakers", {
  id: int("id").primaryKey().autoincrement(),
  
  // Speaker Information
  fullName: varchar("full_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(), // Major General Dr., Prof. Dr., Dr., etc.
  affiliation: varchar("affiliation", { length: 500 }).notNull(),
  
  // Presentation Details
  presentationTitle: varchar("presentation_title", { length: 500 }).notNull(),
  presentationTitleAr: varchar("presentation_title_ar", { length: 500 }),
  presentationAbstract: text("presentation_abstract"),
  
  // Biography
  bio: text("bio"),
  bioAr: text("bio_ar"),
  
  // Media
  photoUrl: varchar("photo_url", { length: 500 }),
  
  // Social Links (optional)
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  twitterUrl: varchar("twitter_url", { length: 500 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  
  // Speaker Type
  speakerType: varchar("speaker_type", { length: 50 }).default("keynote").notNull(), // keynote or invited
  
  // Speaker Sector (for invited speakers)
  speakerSector: varchar("speaker_sector", { length: 50 }).default("academia").notNull(), // academia or industry
  
  // Display Order
  displayOrder: int("display_order").default(0).notNull(),
  
  // Visibility
  isVisible: boolean("is_visible").default(true).notNull(),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type KeynoteSpeaker = typeof keynoteSpeakers.$inferSelect;
export type NewKeynoteSpeaker = typeof keynoteSpeakers.$inferInsert;

// Site Announcements (admin-controlled banner notifications)
export const announcements = mysqlTable("announcements", {
  id: int("id").primaryKey().autoincrement(),
  message: text("message").notNull(),
  messageAr: text("message_ar"), // Arabic translation
  type: varchar("type", { length: 20 }).notNull().default("info"), // info, warning, success, urgent
  isActive: boolean("is_active").default(true).notNull(),
  link: varchar("link", { length: 500 }), // optional CTA link
  linkText: varchar("link_text", { length: 100 }), // optional CTA button text
  createdBy: varchar("created_by", { length: 255 }).notNull(), // admin openId
  createdByName: varchar("created_by_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
