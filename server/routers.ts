import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import { db } from "./db.js";
import { registrations } from "../drizzle/schema.js";

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
});

export type AppRouter = typeof appRouter;
