import { z } from "zod";

export const requestStatuses = ["pending", "in_review", "contacted", "closed"] as const;
export const coverageTypes = ["Written coverage", "Photography", "Video coverage", "Live broadcast", "Other"] as const;
export const cooperationTypes = [
  "Platinum", "Gold", "Silver", "Bronze", "Special sponsorship",
  "In-kind contribution", "Partnership", "Discuss options",
] as const;

export type RequestStatus = typeof requestStatuses[number];
export type RequestKind = "media" | "sponsor";

const contactText = z.string().trim().min(1, "This field is required").max(255, "Use at most 255 characters");
const website = z.string().trim().max(2048, "Use at most 2048 characters").refine(value => {
  if (value === "") return true;
  if (/[\u0000-\u0020\u007f]/.test(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}, "Enter a valid HTTP or HTTPS website").optional();
const commonFields = {
  submissionKey: z.string().uuid("Invalid submission key").transform(value => value.toLowerCase()),
  jobTitle: contactText,
  email: z.string().trim().min(1, "Email is required").max(254, "Use at most 254 characters").email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone is required").max(50, "Use at most 50 characters"),
  website,
  notes: z.string().trim().max(5000, "Use at most 5000 characters").optional(),
  consent: z.literal(true, { error: "Consent is required" }),
  // Deliberately do not trim: even whitespace is a filled honeypot.
  contactWebsite: z.literal("", { error: "Invalid request" }).optional(),
};

// z.object strips unknown administrative fields instead of persisting them.
export const mediaRequestSchema = z.object({
  ...commonFields,
  fullName: contactText,
  organizationName: contactText,
  coverageType: z.enum(coverageTypes),
});
export const sponsorRequestSchema = z.object({
  ...commonFields,
  companyName: contactText,
  contactPerson: contactText,
  activitySector: contactText,
  cooperationType: z.enum(cooperationTypes),
});

export type MediaRequestInput = z.infer<typeof mediaRequestSchema>;
export type SponsorRequestInput = z.infer<typeof sponsorRequestSchema>;
