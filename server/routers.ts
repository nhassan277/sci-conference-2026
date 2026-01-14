import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import { db } from "./db.js";
import { registrations, sponsorships } from "../drizzle/schema.js";

const t = initTRPC.create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  registration: router({
    create: publicProcedure
      .input(
        z.object({
          fullNameEnglish: z.string().min(1, "English name is required"),
          fullNameArabic: z.string().min(1, "Arabic name is required"),
          email: z.string().email("Invalid email address"),
          phone: z.string().min(1, "Phone number is required"),
          affiliation: z.string().min(1, "Affiliation is required"),
          attendeeCategory: z.enum(["student", "faculty", "researcher", "industry"]),
          participationType: z.enum(["attendee", "presenter", "workshop"]),
          researchTitle: z.string().optional(),
          researchAbstract: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const [result] = await db.insert(registrations).values(input);
        
        // TODO: Send email notification to organizers
        // This will be implemented in the next step
        
        return {
          success: true,
          id: result.insertId,
          message: "Registration submitted successfully",
        };
      }),

    list: publicProcedure.query(async () => {
      const allRegistrations = await db.select().from(registrations);
      return allRegistrations;
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [registration] = await db
          .select()
          .from(registrations)
          .where(eq(registrations.id, input.id));
        return registration;
      }),
  }),

  sponsorship: router({
    create: publicProcedure
      .input(
        z.object({
          companyName: z.string().min(1, "Company name is required"),
          contactPerson: z.string().min(1, "Contact person is required"),
          email: z.string().email("Invalid email address"),
          phone: z.string().min(1, "Phone number is required"),
          packageType: z.enum(["platinum", "gold", "silver", "bronze"]),
          companyWebsite: z.string().url("Invalid website URL").optional().or(z.literal("")),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const [result] = await db.insert(sponsorships).values(input);
        
        return {
          success: true,
          id: result.insertId,
          message: "Sponsorship inquiry submitted successfully",
        };
      }),

    list: publicProcedure.query(async () => {
      const allSponsorships = await db.select().from(sponsorships);
      return allSponsorships;
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [sponsorship] = await db
          .select()
          .from(sponsorships)
          .where(eq(sponsorships.id, input.id));
        return sponsorship;
      }),
  }),
});

export type AppRouter = typeof appRouter;
