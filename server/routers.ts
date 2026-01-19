import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import { db } from "./db.js";
import { registrations, sponsorships, sessions, supportTickets } from "../drizzle/schema.js";

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
          wantsCertificate: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        const [result] = await db.insert(registrations).values(input);
        const registrationId = result.insertId;
        
        // Send email notification to organizers
        const { sendRegistrationNotification } = await import("./email.js");
        await sendRegistrationNotification({
          ...input,
          registrationId,
        });
        
        return {
          success: true,
          id: registrationId,
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
        const sponsorshipId = result.insertId;
        
        // Send email notification to organizers
        const { sendSponsorshipNotification } = await import("./email.js");
        await sendSponsorshipNotification({
          ...input,
          sponsorshipId,
        });
        
        return {
          success: true,
          id: sponsorshipId,
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

  session: router({
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title is required"),
          titleAr: z.string().min(1, "Arabic title is required"),
          description: z.string().optional(),
          sessionType: z.enum(["keynote", "research", "workshop", "panel", "break", "opening", "closing"]),
          track: z.string().optional(),
          day: z.number().min(1).max(2),
          startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
          endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
          location: z.string().optional(),
          speakerName: z.string().optional(),
          speakerTitle: z.string().optional(),
          speakerAffiliation: z.string().optional(),
          speakerBio: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const [result] = await db.insert(sessions).values(input);
        return {
          success: true,
          id: result.insertId,
          message: "Session created successfully",
        };
      }),

    list: publicProcedure.query(async () => {
      const allSessions = await db.select().from(sessions);
      return allSessions;
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [session] = await db
          .select()
          .from(sessions)
          .where(eq(sessions.id, input.id));
        return session;
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          titleAr: z.string().min(1).optional(),
          description: z.string().optional(),
          sessionType: z.enum(["keynote", "research", "workshop", "panel", "break", "opening", "closing"]).optional(),
          track: z.string().optional(),
          day: z.number().min(1).max(2).optional(),
          startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
          endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
          location: z.string().optional(),
          speakerName: z.string().optional(),
          speakerTitle: z.string().optional(),
          speakerAffiliation: z.string().optional(),
          speakerBio: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await db.update(sessions).set(updateData).where(eq(sessions.id, id));
        return {
          success: true,
          message: "Session updated successfully",
        };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(sessions).where(eq(sessions.id, input.id));
        return {
          success: true,
          message: "Session deleted successfully",
        };
      }),
  }),

  supportTicket: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email address"),
          subject: z.string().min(1, "Subject is required"),
          message: z.string().min(1, "Message is required"),
          priority: z.enum(["low", "normal", "high"]).optional().default("normal"),
        })
      )
      .mutation(async ({ input }) => {
        const [result] = await db.insert(supportTickets).values(input);
        const ticketId = result.insertId;
        
        // Send email notification to organizers
        const { sendSupportTicketNotification } = await import("./email.js");
        await sendSupportTicketNotification({
          ...input,
          ticketId,
        });
        
        return {
          success: true,
          id: ticketId,
          message: "Support ticket submitted successfully",
        };
      }),

    list: publicProcedure.query(async () => {
      const allTickets = await db.select().from(supportTickets);
      return allTickets;
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [ticket] = await db
          .select()
          .from(supportTickets)
          .where(eq(supportTickets.id, input.id));
        return ticket;
      }),

    updateStatus: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["open", "in-progress", "resolved"]),
          response: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await db.update(supportTickets).set(updateData).where(eq(supportTickets.id, id));
        return {
          success: true,
          message: "Ticket updated successfully",
        };
      }),
  }),

  payment: router({
    createCheckoutSession: publicProcedure
      .input(
        z.object({
          registrationId: z.number(),
          email: z.string().email(),
          fullName: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: "2025-12-15.clover",
        });

        const { PRODUCTS } = await import("./products.js");
        const origin = "https://sci-conference-2026.manus.space"; // Use production URL

        try {
          // Create Stripe checkout session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "egp",
                  product_data: {
                    name: PRODUCTS.CERTIFICATE.name,
                    description: PRODUCTS.CERTIFICATE.description,
                  },
                  unit_amount: PRODUCTS.CERTIFICATE.price * 100, // Stripe expects amount in cents
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: `${origin}/attendance?payment=success&registration_id=${input.registrationId}`,
            cancel_url: `${origin}/attendance?payment=cancelled`,
            customer_email: input.email,
            client_reference_id: input.registrationId.toString(),
            metadata: {
              registrationId: input.registrationId.toString(),
              fullName: input.fullName,
              productType: "certificate",
            },
            allow_promotion_codes: true,
          });

          // Update registration with checkout session ID
          await db
            .update(registrations)
            .set({
              stripeCheckoutSessionId: session.id,
              paymentStatus: "pending",
            })
            .where(eq(registrations.id, input.registrationId));

          return {
            success: true,
            checkoutUrl: session.url,
            sessionId: session.id,
          };
        } catch (error: any) {
          console.error("[Stripe] Checkout session creation failed:", error);
          throw new Error(error.message || "Failed to create checkout session");
        }
      }),
  }),

  badge: router({
    generate: publicProcedure
      .input(
        z.object({
          registrationId: z.number().min(1, "Registration ID is required"),
        })
      )
      .mutation(async ({ input }) => {
        // Get registration data
        const [registration] = await db
          .select()
          .from(registrations)
          .where(eq(registrations.id, input.registrationId));

        if (!registration) {
          throw new Error("Registration not found");
        }

        // Generate badge PDF
        const { generateBadgePDF } = await import("./badge.js");
        const pdfStream = await generateBadgePDF({
          registrationId: registration.id,
          fullNameEnglish: registration.fullNameEnglish,
          fullNameArabic: registration.fullNameArabic,
          affiliation: registration.affiliation,
          attendeeCategory: registration.attendeeCategory,
          participationType: registration.participationType,
        });

        // Convert stream to buffer
        const chunks: Buffer[] = [];
        for await (const chunk of pdfStream) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const pdfBuffer = Buffer.concat(chunks);

        return {
          success: true,
          pdf: pdfBuffer.toString("base64"),
          filename: `badge-${registration.id}.pdf`,
        };
      }),

    generateBulk: publicProcedure.mutation(async () => {
      // Get all registrations
      const allRegistrations = await db.select().from(registrations);

      if (allRegistrations.length === 0) {
        throw new Error("No registrations found");
      }

      // Generate bulk badges PDF
      const { generateBulkBadgesPDF } = await import("./badge.js");
      const pdfStream = await generateBulkBadgesPDF(
        allRegistrations.map((reg) => ({
          registrationId: reg.id,
          fullNameEnglish: reg.fullNameEnglish,
          fullNameArabic: reg.fullNameArabic,
          affiliation: reg.affiliation,
          attendeeCategory: reg.attendeeCategory,
          participationType: reg.participationType,
        }))
      );

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of pdfStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const pdfBuffer = Buffer.concat(chunks);

      return {
        success: true,
        pdf: pdfBuffer.toString("base64"),
        filename: `badges-all-${Date.now()}.pdf`,
        count: allRegistrations.length,
      };
    }),
  }),

  checkin: router({
    // Lookup registration by ID (from QR code scan)
    lookup: publicProcedure
      .input(z.object({ registrationId: z.number() }))
      .query(async ({ input }) => {
        const [registration] = await db
          .select()
          .from(registrations)
          .where(eq(registrations.id, input.registrationId));

        if (!registration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Registration not found",
          });
        }

        return registration;
      }),

    // Mark registration as checked in
    markCheckedIn: publicProcedure
      .input(
        z.object({
          registrationId: z.number(),
          staffName: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const [registration] = await db
          .select()
          .from(registrations)
          .where(eq(registrations.id, input.registrationId));

        if (!registration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Registration not found",
          });
        }

        if (registration.checkedIn) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Already checked in",
          });
        }

        await db
          .update(registrations)
          .set({
            checkedIn: true,
            checkedInAt: new Date(),
            checkedInBy: input.staffName,
          })
          .where(eq(registrations.id, input.registrationId));

        return { success: true };
      }),

    // Get check-in statistics
    stats: publicProcedure.query(async () => {
      const allRegistrations = await db.select().from(registrations);
      const checkedInCount = allRegistrations.filter((r) => r.checkedIn).length;
      const totalCount = allRegistrations.length;
      const percentage =
        totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

      return {
        total: totalCount,
        checkedIn: checkedInCount,
        remaining: totalCount - checkedInCount,
        percentage,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
