import { mysqlTable, varchar, text, timestamp, int } from "drizzle-orm/mysql-core";

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
