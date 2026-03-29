import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, desc, sql, and } from "drizzle-orm";
import superjson from "superjson";
import { db } from "./db.js";
import { registrations, sponsorships, sessions, supportTickets, admins, auditLogs, reminderSubscriptions, galleryPhotos, newsletterSubscriptions, googleSheetsSyncs, mediaRegistrations, committees, keynoteSpeakers, volunteers, surveys, surveyResponses, announcements } from "../drizzle/schema.js";
import { syncAllSheets, SHEETS_CONFIG, type SheetCategory } from "./googleSheets.js";
import { verifyToken, isOwner } from "./auth.js";
import { logAuditAction, getIpAddress, getUserAgent } from "./audit.js";
import { sendMediaRegistrationNotification } from "./email.js";
import { getAdminByOpenId, hasPermission, getRolePermissions, ensureOwnerIsSuperAdmin } from "./admin-management.js";
import { notificationEmitter } from "./notification-emitter.js";

interface Context {
  user?: {
    openId: string;
    name?: string;
    email?: string;
  };
  req?: any;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Extract token from cookies
  const token = ctx.req?.cookies?.auth_token;
  
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  const user = verifyToken(token);
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid authentication token",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

// Admin procedure - requires authentication and admin status
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  // Check if user is in admins table
  const admin = await getAdminByOpenId(ctx.user.openId);
  if (!admin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      admin, // Add admin info to context
    },
  });
});

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
          certificateInvoiceUrl: z.string().optional(),
          wantsWorkshop: z.boolean().default(false),
          workshopChoice: z.enum(["nawah", "bioinformatics", "marc", "medsol", "geochemistry", "agitech"]).optional(), // legacy single
          workshopChoices: z.array(z.enum(["nawah", "bioinformatics", "marc", "medsol", "geochemistry", "agitech"])).optional(), // multi-select
          workshopInvoiceUrl: z.string().optional(),
          wantsExtWorkshop: z.boolean().default(false),
          extWorkshopChoice: z.string().optional(), // legacy single
          extWorkshopChoices: z.array(z.string()).optional(), // multi-select
          extWorkshopInvoiceUrl: z.string().optional(),
          extWorkshopBundle: z.string().optional(), // "marc_chitosan" for flash bundle at 150 EGP
        })
      )
      .mutation(async ({ input }) => {
        // Workshops that are closed for new registrations
        const CLOSED_WORKSHOPS = ['hvd_genomics'];
        // Derive legacy workshopChoice from multi-select for backwards compat
        const resolvedChoices = input.workshopChoices && input.workshopChoices.length > 0 ? input.workshopChoices : (input.workshopChoice ? [input.workshopChoice] : []);
        const resolvedSingleChoice = resolvedChoices[0] ?? input.workshopChoice;
        // Resolve ext workshop choices
        const resolvedExtChoices = (input.extWorkshopChoices && input.extWorkshopChoices.length > 0
          ? input.extWorkshopChoices
          : (input.extWorkshopChoice ? [input.extWorkshopChoice] : []))
          .filter(w => !CLOSED_WORKSHOPS.includes(w)); // Remove closed workshops silently
        const resolvedExtSingleChoice = resolvedExtChoices[0] ?? input.extWorkshopChoice;
        const [result] = await db.insert(registrations).values({
          ...input,
          workshopChoice: resolvedSingleChoice,
          workshopChoices: resolvedChoices.length > 0 ? resolvedChoices : undefined,
          extWorkshopChoice: resolvedExtSingleChoice,
          extWorkshopChoices: resolvedExtChoices.length > 0 ? resolvedExtChoices : undefined,
          extWorkshopBundle: input.extWorkshopBundle ?? undefined,
          workshopPaymentStatus: input.wantsWorkshop && input.workshopInvoiceUrl ? "pending" : "unpaid",
          extWorkshopPaymentStatus: input.wantsExtWorkshop && input.extWorkshopInvoiceUrl ? "pending" : "unpaid",
        });
        const registrationId = result.insertId;
        
        // Emit real-time notification
        notificationEmitter.emitNewRegistration({
          name: input.fullNameEnglish,
          email: input.email,
          category: input.attendeeCategory,
        });
        
        // Send email notification to organizers
        const { sendRegistrationNotification } = await import("./email.js");
        await sendRegistrationNotification({
          ...input,
          registrationId,
        });

        // Check 80% capacity threshold for workshops and send alert if crossed
        try {
          const allRegs = await db.select().from(registrations);
          const WORKSHOP_CAPACITIES: Record<string, number> = {
            nawah: 30, bioinformatics: 50, marc: 30, medsol: 30, geochemistry: 30, agitech: 20,
            chitosan: 30, scrna_seq: 30, hvd_genomics: 20, ai_biotech: 30, colors_metagenomics: 25,
          };
          const workshopLabels: Record<string, string> = {
            nawah: "NAWAH Scientific", bioinformatics: "Bioinformatics (Dr. Dina Amr)", marc: "MARC", medsol: "Medsol Corporation",
            geochemistry: "Geochemistry", agitech: "Agitech (NGS & ddPCR)",
            chitosan: "Biotech Product Dev 101 (Chitosan)",
            scrna_seq: "Single Cell Genomics (EG-CompBio)",
            hvd_genomics: "Genomics & Proteomics (HVD)",
            ai_biotech: "AI Meets Biotech",
            colors_metagenomics: "Metagenomics & Microbiome (Colors Educational Hub)",
          };
          // Check during-conference workshops
          for (const [key, capacity] of Object.entries(WORKSHOP_CAPACITIES)) {
            const isDuring = ["nawah", "bioinformatics", "marc", "medsol", "geochemistry", "agitech"].includes(key);
            const count = isDuring
              ? allRegs.filter(r => r.wantsWorkshop && (r.workshopChoice === key || (Array.isArray(r.workshopChoices) && r.workshopChoices.includes(key))) && r.workshopPaymentStatus !== "rejected").length
              : allRegs.filter(r => r.wantsExtWorkshop && (r.extWorkshopChoice === key || (Array.isArray(r.extWorkshopChoices) && r.extWorkshopChoices.includes(key))) && r.extWorkshopPaymentStatus !== "rejected").length;
            const pct = (count / capacity) * 100;
            const threshold80 = Math.floor(capacity * 0.8);
            // Alert exactly when crossing 80% (i.e., count just hit the threshold)
            if (count === threshold80) {
              notificationEmitter.emitSystemAlert({
                message: `⚠️ Workshop "${workshopLabels[key]}" has reached 80% capacity (${count}/${capacity} spots filled). Act now!`,
                details: { workshop: key, count, capacity, percent: Math.round(pct) },
              });
              console.log(`[Capacity Alert] ${workshopLabels[key]}: ${count}/${capacity} (${Math.round(pct)}%)`);
            }
          }
        } catch (capErr) {
          console.error("[Capacity Check] Error:", capErr);
        }

        return {
          success: true,
          id: registrationId,
          message: "Registration submitted successfully",
        };
      }),

    list: adminProcedure.query(async () => {
      const allRegistrations = await db.select().from(registrations);
      return allRegistrations;
    }),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [registration] = await db
          .select()
          .from(registrations)
          .where(eq(registrations.id, input.id));
        return registration;
      }),

    updateVIPStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          isVIP: z.boolean(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Get registration details for notification
        const [registration] = await db
          .select()
          .from(registrations)
          .where(eq(registrations.id, input.id));

        if (!registration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Registration not found",
          });
        }

        await db
          .update(registrations)
          .set({ isVIP: input.isVIP })
          .where(eq(registrations.id, input.id));

        // Emit real-time notification for VIP status change
        notificationEmitter.emitVIPChange({
          name: registration.fullNameEnglish,
          email: registration.email,
          isVIP: input.isVIP,
          changedBy: (ctx as any).admin?.name || "Admin",
        });

        // Log audit action
        await logAuditAction({
          adminId: (ctx as any).admin?.id,
          adminEmail: (ctx as any).admin?.email,
          adminName: (ctx as any).admin?.name,
          action: "update",
          resourceType: "registration",
          resourceId: input.id,
          details: { field: "isVIP", newValue: input.isVIP },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true };
      }),

    uploadInvoice: publicProcedure
      .input(
        z.object({
          registrationId: z.number(),
          invoiceType: z.enum(["certificate", "workshop", "ext_workshop"]),
          file: z.object({
            data: z.string(), // base64
            name: z.string(),
            type: z.string(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        const [registration] = await db
          .select()
          .from(registrations)
          .where(eq(registrations.id, input.registrationId));

        if (!registration) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Registration not found" });
        }

        const { storagePut } = await import("../storage/index.js");
        const base64Data = input.file.data.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const extension = input.file.name.split(".").pop();
        const key = `invoices/${input.invoiceType}/${input.registrationId}-${timestamp}-${randomSuffix}.${extension}`;
        const result = await storagePut(key, buffer, input.file.type);

        if (input.invoiceType === "certificate") {
          await db.update(registrations)
            .set({ certificateInvoiceUrl: result.url, updatedAt: new Date() })
            .where(eq(registrations.id, input.registrationId));
        } else if (input.invoiceType === "ext_workshop") {
          await db.update(registrations)
            .set({ extWorkshopInvoiceUrl: result.url, extWorkshopPaymentStatus: "pending", updatedAt: new Date() })
            .where(eq(registrations.id, input.registrationId));
        } else {
          await db.update(registrations)
            .set({ workshopInvoiceUrl: result.url, workshopPaymentStatus: "pending", updatedAt: new Date() })
            .where(eq(registrations.id, input.registrationId));
        }

        return { success: true, url: result.url };
      }),

    getWorkshopCounts: publicProcedure.query(async () => {
      const allRegs = await db.select().from(registrations);
      // Helper: check if a registrant selected a given during-conference workshop (supports both multi and legacy single)
      const hasDuringWorkshop = (r: typeof allRegs[0], key: string) => {
        if (r.workshopPaymentStatus === 'rejected') return false;
        if (!r.wantsWorkshop) return false;
        const choices = r.workshopChoices as string[] | null;
        if (choices && choices.length > 0) return choices.includes(key);
        return r.workshopChoice === key;
      };
      const nawah = allRegs.filter(r => hasDuringWorkshop(r, 'nawah')).length;
      const bioinformatics = allRegs.filter(r => hasDuringWorkshop(r, 'bioinformatics')).length;
      const marc = allRegs.filter(r => hasDuringWorkshop(r, 'marc')).length;
      const medsol = allRegs.filter(r => hasDuringWorkshop(r, 'medsol')).length;
      const geochemistry = allRegs.filter(r => hasDuringWorkshop(r, 'geochemistry')).length;
      const agitech = allRegs.filter(r => hasDuringWorkshop(r, 'agitech')).length;
      const countExt = (key: string) => allRegs.filter(r => r.wantsExtWorkshop && r.extWorkshopPaymentStatus !== 'rejected' && (r.extWorkshopChoice === key || (Array.isArray(r.extWorkshopChoices) && r.extWorkshopChoices.includes(key)))).length;
      const ai_biotech = countExt('ai_biotech');
      const chitosan = countExt('chitosan');
      const scrna_seq = countExt('scrna_seq');
      const hvd_genomics = countExt('hvd_genomics');
      const colors_metagenomics = countExt('colors_metagenomics');
      const vaccine_industry = countExt('vaccine_industry');
      const gesr_scholarships = allRegs.filter(r => r.wantsExtWorkshop && (r.extWorkshopChoice === 'gesr_scholarships' || (Array.isArray(r.extWorkshopChoices) && r.extWorkshopChoices.includes('gesr_scholarships')))).length;
      return { nawah, bioinformatics, marc, medsol, geochemistry, agitech, ai_biotech, chitosan, scrna_seq, hvd_genomics, colors_metagenomics, vaccine_industry, gesr_scholarships };
    }),

    confirmWorkshopPayment: adminProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.update(registrations)
          .set({ workshopPaymentStatus: 'confirmed', updatedAt: new Date() })
          .where(eq(registrations.id, input.registrationId));
        return { success: true };
      }),

    rejectWorkshopPayment: adminProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.update(registrations)
          .set({ workshopPaymentStatus: 'rejected', updatedAt: new Date() })
          .where(eq(registrations.id, input.registrationId));
        return { success: true };
      }),

    confirmExtWorkshopPayment: adminProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.update(registrations)
          .set({ extWorkshopPaymentStatus: 'confirmed', updatedAt: new Date() })
          .where(eq(registrations.id, input.registrationId));
        return { success: true };
      }),

    rejectExtWorkshopPayment: adminProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.update(registrations)
          .set({ extWorkshopPaymentStatus: 'rejected', updatedAt: new Date() })
          .where(eq(registrations.id, input.registrationId));
        return { success: true };
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

    uploadMaterials: publicProcedure
      .input(
        z.object({
          sponsorshipId: z.number(),
          companyDescription: z.string(),
          logo: z.object({
            data: z.string(),
            name: z.string(),
            type: z.string(),
          }).optional(),
          banner: z.object({
            data: z.string(),
            name: z.string(),
            type: z.string(),
          }).optional(),
          brochure: z.object({
            data: z.string(),
            name: z.string(),
            type: z.string(),
          }).optional(),
          workshopMaterials: z.object({
            data: z.string(),
            name: z.string(),
            type: z.string(),
          }).optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Verify sponsorship exists
        const [sponsorship] = await db.select().from(sponsorships).where(eq(sponsorships.id, input.sponsorshipId));
        if (!sponsorship) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sponsorship not found. Please check your Sponsorship ID.",
          });
        }

        // Upload files to S3 and get URLs
        const { storagePut } = await import("../storage/index.js");
        const uploadFile = async (file: { data: string; name: string; type: string } | undefined, prefix: string) => {
          if (!file) return null;
          
          // Convert base64 to buffer
          const base64Data = file.data.split(",")[1];
          const buffer = Buffer.from(base64Data, "base64");
          
          // Generate unique filename
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(7);
          const extension = file.name.split(".").pop();
          const key = `sponsors/${input.sponsorshipId}/${prefix}-${timestamp}-${randomSuffix}.${extension}`;
          
          const result = await storagePut(key, buffer, file.type);
          return result.url;
        };

        const logoUrl = await uploadFile(input.logo, "logo");
        const bannerUrl = await uploadFile(input.banner, "banner");
        const brochureUrl = await uploadFile(input.brochure, "brochure");
        const workshopMaterialsUrl = await uploadFile(input.workshopMaterials, "workshop");

        // Update sponsorship with file URLs and description
        await db.update(sponsorships)
          .set({
            companyDescription: input.companyDescription,
            logoUrl: logoUrl || sponsorship.logoUrl,
            bannerUrl: bannerUrl || sponsorship.bannerUrl,
            brochureUrl: brochureUrl || sponsorship.brochureUrl,
            workshopMaterialsUrl: workshopMaterialsUrl || sponsorship.workshopMaterialsUrl,
            materialsUploadedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(sponsorships.id, input.sponsorshipId));

        return {
          success: true,
          message: "Materials uploaded successfully",
        };
      }),

    list: adminProcedure.query(async () => {
      const allSponsorships = await db.select().from(sponsorships);
      return allSponsorships;
    }),

    getById: adminProcedure
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
    create: adminProcedure
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

    update: adminProcedure
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

    delete: adminProcedure
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

    list: adminProcedure.query(async () => {
      const allTickets = await db.select().from(supportTickets);
      return allTickets;
    }),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [ticket] = await db
          .select()
          .from(supportTickets)
          .where(eq(supportTickets.id, input.id));
        return ticket;
      }),

    updateStatus: adminProcedure
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
    generate: adminProcedure
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

    generateBulk: adminProcedure.mutation(async () => {
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
    lookup: adminProcedure
      .input(z.object({ registrationId: z.number() }))
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

        return registration;
      }),

    // Mark registration as checked in
    markCheckedIn: adminProcedure
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

        // Emit real-time notification for check-in
        notificationEmitter.emitCheckIn({
          name: registration.fullNameEnglish,
          email: registration.email,
          isVIP: registration.isVIP,
        });

        // Send VIP alert if this is a VIP attendee
        if (registration.isVIP) {
          const { sendVIPCheckinAlert } = await import("./email.js");
          await sendVIPCheckinAlert({
            fullNameEnglish: registration.fullNameEnglish,
            fullNameArabic: registration.fullNameArabic,
            email: registration.email,
            affiliation: registration.affiliation,
            attendeeCategory: registration.attendeeCategory,
            checkedInBy: input.staffName,
            checkedInAt: new Date(),
          });
        }

        return { success: true };
      }),

    // Get check-in statistics
    stats: adminProcedure.query(async () => {
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

    // Export check-in data as CSV
    exportCheckins: adminProcedure.query(async () => {
      const allRegistrations = await db
        .select()
        .from(registrations)
        .where(eq(registrations.checkedIn, true));

      // CSV headers
      const headers = [
        "ID",
        "Full Name (English)",
        "Full Name (Arabic)",
        "Email",
        "Phone",
        "Affiliation",
        "Category",
        "Participation Type",
        "Checked In At",
        "Checked In By",
      ];

      // CSV rows
      const rows = allRegistrations.map((reg) => [
        reg.id.toString(),
        reg.fullNameEnglish,
        reg.fullNameArabic,
        reg.email,
        reg.phone,
        reg.affiliation,
        reg.attendeeCategory,
        reg.participationType,
        reg.checkedInAt
          ? new Date(reg.checkedInAt).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "",
        reg.checkedInBy || "",
      ]);

      // Build CSV content
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      return {
        csv: csvContent,
        filename: `checkins-${new Date().toISOString().split("T")[0]}.csv`,
        count: allRegistrations.length,
      };
    }),

    // Get recent check-ins for dashboard feed
    recentCheckins: adminProcedure
      .input(z.object({ limit: z.number().optional().default(20) }))
      .query(async ({ input }) => {
        const recentCheckins = await db
          .select()
          .from(registrations)
          .where(eq(registrations.checkedIn, true))
          .orderBy(desc(registrations.checkedInAt))
          .limit(input.limit);

        return recentCheckins;
      }),

    // Get category-wise breakdown
    categoryBreakdown: adminProcedure.query(async () => {
      const allRegistrations = await db.select().from(registrations);
      
      const categories = [
        "student",
        "faculty",
        "researcher",
        "industry",
      ] as const;

      const breakdown = categories.map((category) => {
        const total = allRegistrations.filter(
          (r) => r.attendeeCategory === category
        ).length;
        const checkedIn = allRegistrations.filter(
          (r) => r.attendeeCategory === category && r.checkedIn
        ).length;
        const percentage = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

        return {
          category,
          total,
          checkedIn,
          remaining: total - checkedIn,
          percentage,
        };
      });

      return breakdown;
    }),
  }),

  // Admin Management
  adminManagement: router({
    // List all admins (super_admin only)
    list: adminProcedure.query(async ({ ctx }) => {
      const admin = (ctx as any).admin;
      if (admin.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only super admins can manage admins",
        });
      }

      const allAdmins = await db.select().from(admins).orderBy(desc(admins.createdAt));
      return allAdmins;
    }),

    // Add new admin (super_admin only)
    create: adminProcedure
      .input(
        z.object({
          openId: z.string(),
          email: z.string().email(),
          name: z.string(),
          role: z.enum(["super_admin", "moderator", "viewer"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const admin = (ctx as any).admin;
        if (admin.role !== "super_admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only super admins can add admins",
          });
        }

        const [result] = await db.insert(admins).values({
          openId: input.openId,
          email: input.email,
          name: input.name,
          role: input.role,
          createdBy: ctx.user!.openId,
        });

        // Log audit action
        await logAuditAction({
          adminId: admin.id,
          adminEmail: admin.email,
          adminName: admin.name,
          action: "create",
          resourceType: "admin",
          resourceId: result.insertId,
          details: { newAdmin: input },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true, id: result.insertId };
      }),

    // Update admin role (super_admin only)
    updateRole: adminProcedure
      .input(
        z.object({
          id: z.number(),
          role: z.enum(["super_admin", "moderator", "viewer"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const admin = (ctx as any).admin;
        if (admin.role !== "super_admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only super admins can update admin roles",
          });
        }

        // Prevent changing owner's role
        const [targetAdmin] = await db.select().from(admins).where(eq(admins.id, input.id));
        if (targetAdmin && targetAdmin.openId === process.env.OWNER_OPEN_ID) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot change owner's role",
          });
        }

        await db.update(admins).set({ role: input.role }).where(eq(admins.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: admin.id,
          adminEmail: admin.email,
          adminName: admin.name,
          action: "update",
          resourceType: "admin",
          resourceId: input.id,
          details: { field: "role", newValue: input.role },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true };
      }),

    // Remove admin (super_admin only)
    remove: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const admin = (ctx as any).admin;
        if (admin.role !== "super_admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only super admins can remove admins",
          });
        }

        // Prevent removing owner
        const [targetAdmin] = await db.select().from(admins).where(eq(admins.id, input.id));
        if (targetAdmin && targetAdmin.openId === process.env.OWNER_OPEN_ID) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot remove owner",
          });
        }

        // Prevent removing self
        if (input.id === admin.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot remove yourself",
          });
        }

        await db.delete(admins).where(eq(admins.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: admin.id,
          adminEmail: admin.email,
          adminName: admin.name,
          action: "delete",
          resourceType: "admin",
          resourceId: input.id,
          details: { removedAdmin: targetAdmin },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true };
      }),

    // Get current admin info and permissions
    me: adminProcedure.query(async ({ ctx }) => {
      const admin = (ctx as any).admin;
      const permissions = getRolePermissions(admin.role);
      return { ...admin, permissions };
    }),
  }),

  // Audit Log
  auditLog: router({
    // List audit logs with filtering
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().optional().default(50),
          offset: z.number().optional().default(0),
          action: z.string().optional(),
          resourceType: z.string().optional(),
          adminEmail: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        let query = db.select().from(auditLogs);

        // Apply filters (simplified - in production use drizzle filters)
        const logs = await query.orderBy(desc(auditLogs.timestamp)).limit(input.limit).offset(input.offset);

        // Filter in memory (for simplicity)
        let filtered = logs;
        if (input.action) {
          filtered = filtered.filter((log) => log.action === input.action);
        }
        if (input.resourceType) {
          filtered = filtered.filter((log) => log.resourceType === input.resourceType);
        }
        if (input.adminEmail) {
          filtered = filtered.filter((log) => log.adminEmail === input.adminEmail);
        }
        if (input.startDate) {
          const start = new Date(input.startDate);
          filtered = filtered.filter((log) => log.timestamp >= start);
        }
        if (input.endDate) {
          const end = new Date(input.endDate);
          filtered = filtered.filter((log) => log.timestamp <= end);
        }

        return filtered;
      }),

    // Get audit log stats
    stats: adminProcedure.query(async () => {
      const allLogs = await db.select().from(auditLogs);
      
      const actionCounts = allLogs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const resourceCounts = allLogs.reduce((acc, log) => {
        acc[log.resourceType] = (acc[log.resourceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalActions: allLogs.length,
        actionCounts,
        resourceCounts,
      };
    }),
  }),

  // Email Digest Management
  digest: router({
    // Get current user's digest preferences
    getPreferences: adminProcedure.query(async ({ ctx }) => {
      const { digestPreferences } = await import("../drizzle/schema.js");
      const { eq } = await import("drizzle-orm");
      
      const [pref] = await db
        .select()
        .from(digestPreferences)
        .where(eq(digestPreferences.adminId, ctx.admin.id))
        .limit(1);
      
      return pref || null;
    }),

    // Update digest preferences
    updatePreferences: adminProcedure
      .input(
        z.object({
          frequency: z.enum(["daily", "weekly", "disabled"]),
          enabled: z.boolean(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { digestPreferences } = await import("../drizzle/schema.js");
        const { eq } = await import("drizzle-orm");
        
        // Check if preference exists
        const [existing] = await db
          .select()
          .from(digestPreferences)
          .where(eq(digestPreferences.adminId, ctx.admin.id))
          .limit(1);

        if (existing) {
          // Update existing
          await db
            .update(digestPreferences)
            .set({
              frequency: input.frequency,
              enabled: input.enabled,
              updatedAt: new Date(),
            })
            .where(eq(digestPreferences.id, existing.id));
        } else {
          // Create new
          await db.insert(digestPreferences).values({
            adminId: ctx.admin.id,
            email: ctx.admin.email,
            frequency: input.frequency,
            enabled: input.enabled,
          });
        }

        // Log the action
        await logAuditAction({
          adminId: ctx.admin.id,
          adminEmail: ctx.admin.email,
          action: "updated",
          resourceType: "digest_preferences",
          resourceId: ctx.admin.id,
          details: { frequency: input.frequency, enabled: input.enabled },
          ipAddress: ctx.req.ip || "unknown",
          userAgent: ctx.req.get("user-agent") || "unknown",
        });

        return { success: true };
      }),

    // Manually trigger digest send
    sendNow: adminProcedure
      .input(
        z.object({
          frequency: z.enum(["daily", "weekly"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { triggerManualDigest } = await import("./digest-scheduler.js");
        
        try {
          await triggerManualDigest(input.frequency);

          // Log the action
          await logAuditAction({
            adminId: ctx.admin.id,
            adminEmail: ctx.admin.email,
            action: "triggered",
            resourceType: "email_digest",
            details: { action: `Manually triggered ${input.frequency} digest`, frequency: input.frequency },
            ipAddress: ctx.req.ip || "unknown",
            userAgent: ctx.req.get("user-agent") || "unknown",
          });

          return { success: true, message: `${input.frequency} digest sent successfully` };
        } catch (error) {
          console.error("[Digest] Error sending manual digest:", error);
          throw new Error(`Failed to send ${input.frequency} digest`);
        }
      }),
  }),

  // Survey router
  survey: router({
    // Admin: List all surveys
    list: adminProcedure.query(async () => {
      return await db.select().from(surveys).orderBy(desc(surveys.createdAt));
    }),

    // Admin: Get single survey
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [survey] = await db
          .select()
          .from(surveys)
          .where(eq(surveys.id, input.id))
          .limit(1);
        return survey || null;
      }),

    // Admin: Create survey
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          questions: z.array(z.any()),
          scheduledSendDate: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const [survey] = await db
          .insert(surveys)
          .values({
            title: input.title,
            description: input.description,
            questions: input.questions,
            status: input.scheduledSendDate ? "scheduled" : "draft",
            scheduledSendDate: input.scheduledSendDate ? new Date(input.scheduledSendDate) : null,
            createdBy: ctx.admin.id,
          });

        await logAuditAction({
          adminId: ctx.admin.id,
          adminEmail: ctx.admin.email,
          action: "created",
          resourceType: "survey",
          resourceId: survey.insertId,
          details: { title: input.title },
          ipAddress: ctx.req.ip || "unknown",
          userAgent: ctx.req.get("user-agent") || "unknown",
        });

        return { id: survey.insertId };
      }),

    // Admin: Distribute survey manually
    distribute: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { distributeSurvey } = await import("./survey-distribution.js");
        const result = await distributeSurvey(input.id);

        await logAuditAction({
          adminId: ctx.admin.id,
          adminEmail: ctx.admin.email,
          action: "distributed",
          resourceType: "survey",
          resourceId: input.id,
          details: { sent: result.sent, failed: result.failed, alreadyResponded: result.alreadyResponded },
          ipAddress: ctx.req.ip || "unknown",
          userAgent: ctx.req.get("user-agent") || "unknown",
        });

        return result;
      }),

    // Public: Get survey by token
    getByToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const { decodeSurveyToken } = await import("./survey-distribution.js");
        const decoded = decodeSurveyToken(input.token);

        if (!decoded) {
          throw new Error("Invalid survey token");
        }

        const [survey] = await db
          .select()
          .from(surveys)
          .where(eq(surveys.id, decoded.surveyId))
          .limit(1);

        if (!survey) {
          throw new Error("Survey not found");
        }

        if (survey.status === "closed") {
          throw new Error("Survey is closed");
        }

        // Check if already responded
        const [existingResponse] = await db
          .select()
          .from(surveyResponses)
          .where(
            and(
              eq(surveyResponses.surveyId, decoded.surveyId),
              eq(surveyResponses.registrationId, decoded.registrationId)
            )
          )
          .limit(1);

        return {
          survey,
          alreadyResponded: !!existingResponse,
          registrationId: decoded.registrationId,
        };
      }),

    // Public: Submit survey response
    submit: publicProcedure
      .input(
        z.object({
          token: z.string(),
          answers: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { decodeSurveyToken } = await import("./survey-distribution.js");
        const decoded = decodeSurveyToken(input.token);

        if (!decoded) {
          throw new Error("Invalid survey token");
        }

        // Check if already responded
        const [existingResponse] = await db
          .select()
          .from(surveyResponses)
          .where(
            and(
              eq(surveyResponses.surveyId, decoded.surveyId),
              eq(surveyResponses.registrationId, decoded.registrationId)
            )
          )
          .limit(1);

        if (existingResponse) {
          throw new Error("You have already responded to this survey");
        }

        // Analyze sentiment of text responses
        const textResponses = Object.values(input.answers)
          .filter((a: any) => typeof a === "string" && a.length > 10)
          .join(" ");

        let sentiment = "neutral";
        let sentimentScore = 0;

        if (textResponses.length > 0) {
          // TODO: Call LLM for sentiment analysis
          // For now, use simple keyword matching
          const positive = ["good", "great", "excellent", "amazing", "love", "wonderful"];
          const negative = ["bad", "poor", "terrible", "awful", "hate", "disappointing"];

          const lowerText = textResponses.toLowerCase();
          const positiveCount = positive.filter((w) => lowerText.includes(w)).length;
          const negativeCount = negative.filter((w) => lowerText.includes(w)).length;

          if (positiveCount > negativeCount) {
            sentiment = "positive";
            sentimentScore = Math.min(100, positiveCount * 20);
          } else if (negativeCount > positiveCount) {
            sentiment = "negative";
            sentimentScore = Math.max(-100, -negativeCount * 20);
          }
        }

        await db.insert(surveyResponses).values({
          surveyId: decoded.surveyId,
          registrationId: decoded.registrationId,
          answers: input.answers,
          sentiment,
          sentimentScore,
          ipAddress: ctx.req?.ip || "unknown",
        });

        return { success: true };
      }),

    // Admin: Get survey analytics
    analytics: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [survey] = await db
          .select()
          .from(surveys)
          .where(eq(surveys.id, input.id))
          .limit(1);

        if (!survey) {
          throw new Error("Survey not found");
        }

        const responses = await db
          .select()
          .from(surveyResponses)
          .where(eq(surveyResponses.surveyId, input.id));

        const totalRegistrations = await db.select({ count: sql<number>`count(*)` }).from(registrations);
        const totalCount = totalRegistrations[0]?.count || 0;

        const responseRate = totalCount > 0 ? (responses.length / totalCount) * 100 : 0;

        const sentimentCounts = {
          positive: responses.filter((r) => r.sentiment === "positive").length,
          neutral: responses.filter((r) => r.sentiment === "neutral").length,
          negative: responses.filter((r) => r.sentiment === "negative").length,
        };

        const avgSentimentScore =
          responses.length > 0
            ? responses.reduce((sum, r) => sum + (r.sentimentScore || 0), 0) / responses.length
            : 0;

        return {
          survey,
          totalResponses: responses.length,
          totalRegistrations: totalCount,
          responseRate: Math.round(responseRate * 10) / 10,
          sentimentCounts,
          avgSentimentScore: Math.round(avgSentimentScore),
        };
       }),
  }),

  // Conference Reminder Subscriptions
  reminder: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email("Invalid email address"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Check if already subscribed
          const existing = await db
            .select()
            .from(reminderSubscriptions)
            .where(eq(reminderSubscriptions.email, input.email))
            .limit(1);

          if (existing.length > 0) {
            if (existing[0].unsubscribed) {
              // Resubscribe if previously unsubscribed
              await db
                .update(reminderSubscriptions)
                .set({
                  unsubscribed: false,
                  unsubscribedAt: null,
                  subscribedAt: new Date(),
                })
                .where(eq(reminderSubscriptions.email, input.email));
              return {
                success: true,
                message: "You have been resubscribed to conference reminders",
              };
            }
            return {
              success: true,
              message: "You are already subscribed to conference reminders",
            };
          }

          // Create new subscription
          await db.insert(reminderSubscriptions).values({
            email: input.email,
          });

          return {
            success: true,
            message: "Successfully subscribed to conference reminders",
          };
        } catch (error) {
          console.error("Reminder subscription error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to subscribe to reminders",
          });
        }
      }),

    unsubscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email("Invalid email address"),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(reminderSubscriptions)
          .set({
            unsubscribed: true,
            unsubscribedAt: new Date(),
          })
          .where(eq(reminderSubscriptions.email, input.email));

        return {
          success: true,
          message: "Successfully unsubscribed from conference reminders",
        };
      }),

    // Admin: List all subscriptions
    list: adminProcedure.query(async () => {
      const allSubscriptions = await db
        .select()
        .from(reminderSubscriptions)
        .orderBy(desc(reminderSubscriptions.subscribedAt));
      return allSubscriptions;
    }),
  }),

  // Newsletter Subscriptions
  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email("Invalid email address"),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Check if already subscribed
          const existing = await db
            .select()
            .from(newsletterSubscriptions)
            .where(eq(newsletterSubscriptions.email, input.email))
            .limit(1);

          if (existing.length > 0) {
            if (!existing[0].isActive) {
              // Reactivate if previously unsubscribed
              await db
                .update(newsletterSubscriptions)
                .set({
                  isActive: true,
                  unsubscribedAt: null,
                  subscribedAt: new Date(),
                  name: input.name || existing[0].name,
                })
                .where(eq(newsletterSubscriptions.email, input.email));
              return {
                success: true,
                message: "You have been resubscribed to conference updates",
              };
            }
            return {
              success: true,
              message: "You are already subscribed to conference updates",
            };
          }

          // Create new subscription
          await db.insert(newsletterSubscriptions).values({
            email: input.email,
            name: input.name,
            source: "website",
          });

          return {
            success: true,
            message: "Successfully subscribed to conference updates",
          };
        } catch (error) {
          console.error("Newsletter subscription error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to subscribe to newsletter",
          });
        }
      }),

    unsubscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email("Invalid email address"),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(newsletterSubscriptions)
          .set({
            isActive: false,
            unsubscribedAt: new Date(),
          })
          .where(eq(newsletterSubscriptions.email, input.email));

        return {
          success: true,
          message: "Successfully unsubscribed from conference updates",
        };
      }),

    // Admin: List all subscriptions
    list: adminProcedure.query(async () => {
      const allSubscriptions = await db
        .select()
        .from(newsletterSubscriptions)
        .orderBy(desc(newsletterSubscriptions.subscribedAt));
      return allSubscriptions;
    }),

    // Admin: Get subscription stats
    stats: adminProcedure.query(async () => {
      const allSubscriptions = await db.select().from(newsletterSubscriptions);
      const activeCount = allSubscriptions.filter((s) => s.isActive).length;
      const inactiveCount = allSubscriptions.filter((s) => !s.isActive).length;

      return {
        total: allSubscriptions.length,
        active: activeCount,
        inactive: inactiveCount,
      };
    }),
  }),

  // Google Sheets Sync
  sheetsSync: router({
    // Trigger manual sync of all Google Sheets
    syncAll: adminProcedure.mutation(async ({ ctx }) => {
      try {
        const results = await syncAllSheets();
        
        // Update sync tracking table
        for (const result of results) {
          const sheetConfig = SHEETS_CONFIG.find(s => s.category === result.category);
          if (!sheetConfig) continue;

          // Check if sync record exists
          const existing = await db
            .select()
            .from(googleSheetsSyncs)
            .where(eq(googleSheetsSyncs.sheetId, sheetConfig.id))
            .limit(1);

          if (existing.length > 0) {
            // Update existing record
            await db
              .update(googleSheetsSyncs)
              .set({
                lastSyncedAt: new Date(),
                lastRowCount: result.rowCount,
                syncStatus: 'success',
                errorMessage: null,
              })
              .where(eq(googleSheetsSyncs.sheetId, sheetConfig.id));
          } else {
            // Create new record
            await db.insert(googleSheetsSyncs).values({
              sheetId: sheetConfig.id,
              sheetName: sheetConfig.name,
              category: sheetConfig.category,
              lastSyncedAt: new Date(),
              lastRowCount: result.rowCount,
              syncStatus: 'success',
            });
          }

          // Insert/update registrations
          for (let i = 0; i < result.data.length; i++) {
            const row = result.data[i];
            
            // Check if registration already exists (by email + sheet)
            const existingReg = await db
              .select()
              .from(registrations)
              .where(eq(registrations.email, row.email))
              .limit(1);

            const registrationData = {
              fullNameEnglish: row.fullNameEnglish || '',
              fullNameArabic: row.fullNameArabic || '',
              email: row.email || '',
              phone: row.phone || '',
              affiliation: row.affiliation || '',
              attendeeCategory: result.category,
              participationType: row.participationType || 'attendee',
              researchTitle: row.researchTitle,
              researchAbstract: row.researchAbstract,
              sourceSheetId: sheetConfig.id,
              sourceRowIndex: i + 2, // +2 because row 1 is header, and array is 0-indexed
              rawFormData: row,
              wantsCertificate: false,
              paymentStatus: 'unpaid',
              checkedIn: false,
              isVIP: false,
            };

            if (existingReg.length === 0) {
              // Insert new registration
              await db.insert(registrations).values(registrationData);
            } else {
              // Update existing registration
              await db
                .update(registrations)
                .set({
                  ...registrationData,
                  updatedAt: new Date(),
                })
                .where(eq(registrations.id, existingReg[0].id));
            }
          }
        }

        // Log audit action
        await logAuditAction({
          adminId: ctx.admin?.id,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: 'sync',
          resourceType: 'google_sheets',
          details: {
            sheetsCount: results.length,
            totalRows: results.reduce((sum, r) => sum + r.rowCount, 0),
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return {
          success: true,
          results: results.map(r => ({
            category: r.category,
            sheetName: r.sheetName,
            rowCount: r.rowCount,
          })),
        };
      } catch (error) {
        console.error('Sheets sync error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to sync sheets: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),

    // Get sync status for all sheets
    getStatus: adminProcedure.query(async () => {
      const syncs = await db
        .select()
        .from(googleSheetsSyncs)
        .orderBy(desc(googleSheetsSyncs.lastSyncedAt));
      return syncs;
    }),

    // Get registration statistics by category
    getStats: adminProcedure.query(async () => {
      const allRegistrations = await db.select().from(registrations);
      
      const stats = {
        total: allRegistrations.length,
        byCategory: {
          student: allRegistrations.filter(r => r.attendeeCategory === 'student').length,
          faculty: allRegistrations.filter(r => r.attendeeCategory === 'faculty').length,
          external: allRegistrations.filter(r => r.attendeeCategory === 'researcher').length,
          industry: allRegistrations.filter(r => r.attendeeCategory === 'industry').length,
        },
        checkedIn: allRegistrations.filter(r => r.checkedIn).length,
        withCertificate: allRegistrations.filter(r => r.wantsCertificate).length,
      };

      return stats;
    }),
  }),

  // gallery: galleryRouter, // Temporarily disabled

  // Media Registration (Press & TV Coverage)
  media: router({
    // Submit media registration
    register: publicProcedure
      .input(
        z.object({
          organizationName: z.string().min(1, "Organization name is required"),
          organizationType: z.enum(["newspaper", "news_website", "tv_channel", "radio"]),
          coverageType: z.enum(["written", "photo", "video", "live_broadcast"]),
          fullName: z.string().min(1, "Full name is required"),
          jobTitle: z.string().min(1, "Job title is required"),
          phone: z.string().min(1, "Phone number is required"),
          email: z.string().email("Invalid email address"),
          pressCardNumber: z.string().optional(),
          teamMembers: z.array(
            z.object({
              name: z.string(),
              role: z.string(),
              phone: z.string(),
            })
          ).optional(),
          agreementAccepted: z.boolean().refine(val => val === true, {
            message: "You must accept the coverage agreement",
          }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const ipAddress = getIpAddress(ctx.req);
          const userAgent = getUserAgent(ctx.req);

          const [registration] = await db
            .insert(mediaRegistrations)
            .values({
              organizationName: input.organizationName,
              organizationType: input.organizationType,
              coverageType: input.coverageType,
              fullName: input.fullName,
              jobTitle: input.jobTitle,
              phone: input.phone,
              email: input.email,
              pressCardNumber: input.pressCardNumber,
              teamMembers: input.teamMembers || [],
              agreementAccepted: input.agreementAccepted,
              ipAddress,
              userAgent,
              status: "pending",
            });

          // Send email notification to organizers
          await sendMediaRegistrationNotification({
            organizationName: input.organizationName,
            organizationType: input.organizationType,
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            jobTitle: input.jobTitle,
            coverageType: [input.coverageType],
            teamMembers: input.teamMembers || [],
            registrationId: registration.insertId,
          });

          return {
            success: true,
            message: "Registration submitted successfully. You will receive a confirmation email shortly.",
            registrationId: registration.insertId,
          };
        } catch (error) {
          console.error("Media registration error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to submit registration. Please try again.",
          });
        }
      }),

    // Admin: Get all media registrations
    getAll: adminProcedure
      .input(
        z.object({
          status: z.enum(["all", "pending", "approved", "rejected"]).optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        let query = db.select().from(mediaRegistrations);
        
        if (input?.status && input.status !== "all") {
          query = query.where(eq(mediaRegistrations.status, input.status)) as any;
        }

        const registrations = await query.orderBy(desc(mediaRegistrations.createdAt));
        return registrations;
      }),

    // Admin: Get single media registration
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [registration] = await db
          .select()
          .from(mediaRegistrations)
          .where(eq(mediaRegistrations.id, input.id));

        if (!registration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Registration not found",
          });
        }

        return registration;
      }),

    // Admin: Approve media registration
    approve: adminProcedure
      .input(
        z.object({
          id: z.number(),
          badgeNumber: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const [registration] = await db
          .select()
          .from(mediaRegistrations)
          .where(eq(mediaRegistrations.id, input.id));

        if (!registration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Registration not found",
          });
        }

        await db
          .update(mediaRegistrations)
          .set({
            status: "approved",
            approvedBy: ctx.user?.openId,
            approvedAt: new Date(),
            badgeNumber: input.badgeNumber,
          })
          .where(eq(mediaRegistrations.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "approve",
          resourceType: "media_registration",
          resourceId: input.id,
          details: {
            message: `Approved media registration for ${registration.fullName} from ${registration.organizationName}`,
            badgeNumber: input.badgeNumber,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        // TODO: Send approval email to journalist (will implement in next phase)

        return { success: true, message: "Registration approved successfully" };
      }),

    // Admin: Reject media registration
    reject: adminProcedure
      .input(
        z.object({
          id: z.number(),
          reason: z.string().min(1, "Rejection reason is required"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const [registration] = await db
          .select()
          .from(mediaRegistrations)
          .where(eq(mediaRegistrations.id, input.id));

        if (!registration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Registration not found",
          });
        }

        await db
          .update(mediaRegistrations)
          .set({
            status: "rejected",
            approvedBy: ctx.user?.openId,
            approvedAt: new Date(),
            rejectionReason: input.reason,
          })
          .where(eq(mediaRegistrations.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "reject",
          resourceType: "media_registration",
          resourceId: input.id,
          details: {
            message: `Rejected media registration for ${registration.fullName}`,
            reason: input.reason,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        // TODO: Send rejection email to journalist (will implement in next phase)

        return { success: true, message: "Registration rejected" };
      }),

    // Admin: Update notes
    updateNotes: adminProcedure
      .input(
        z.object({
          id: z.number(),
          notes: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(mediaRegistrations)
          .set({ notes: input.notes })
          .where(eq(mediaRegistrations.id, input.id));

        return { success: true };
      }),

    // Admin: Issue badge
    issueBadge: adminProcedure
      .input(
        z.object({
          id: z.number(),
          badgeNumber: z.string().min(1, "Badge number is required"),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(mediaRegistrations)
          .set({
            badgeIssued: true,
            badgeIssuedAt: new Date(),
            badgeNumber: input.badgeNumber,
          })
          .where(eq(mediaRegistrations.id, input.id));

        return { success: true, message: "Badge issued successfully" };
      }),

    // Admin: Get statistics
    getStats: adminProcedure.query(async () => {
      const allRegistrations = await db.select().from(mediaRegistrations);

      const stats = {
        total: allRegistrations.length,
        byStatus: {
          pending: allRegistrations.filter(r => r.status === "pending").length,
          approved: allRegistrations.filter(r => r.status === "approved").length,
          rejected: allRegistrations.filter(r => r.status === "rejected").length,
        },
        byType: {
          newspaper: allRegistrations.filter(r => r.organizationType === "newspaper").length,
          news_website: allRegistrations.filter(r => r.organizationType === "news_website").length,
          tv_channel: allRegistrations.filter(r => r.organizationType === "tv_channel").length,
          radio: allRegistrations.filter(r => r.organizationType === "radio").length,
        },
        badgesIssued: allRegistrations.filter(r => r.badgeIssued).length,
      };

      return stats;
    }),
  }),

  // Committee Management
  committee: router({
    // Public: List all committees
    list: publicProcedure.query(async () => {
      const allCommittees = await db
        .select()
        .from(committees)
        .orderBy(committees.displayOrder, committees.id);

      // Group by committee type
      const grouped = allCommittees.reduce((acc, committee) => {
        const type = committee.committeeType;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(committee);
        return acc;
      }, {} as Record<string, typeof allCommittees>);

      return { committees: allCommittees, grouped };
    }),

    // Admin: Get all committees
    getAll: adminProcedure.query(async () => {
      return await db
        .select()
        .from(committees)
        .orderBy(committees.committeeType, committees.displayOrder, committees.id);
    }),

    // Admin: Get single committee
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const committee = await db
          .select()
          .from(committees)
          .where(eq(committees.id, input.id))
          .limit(1);

        if (!committee || committee.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Committee member not found",
          });
        }

        return committee[0];
      }),

    // Admin: Create committee member
    create: adminProcedure
      .input(
        z.object({
          fullName: z.string().min(1, "Full name is required"),
          title: z.string().min(1, "Title is required"),
          committeeType: z.enum(["scientific", "organizing", "reception", "technical"]),
          department: z.string().optional(),
          role: z.string().optional(),
          email: z.string().email().optional().or(z.literal("")),
          phone: z.string().optional(),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const [newCommittee] = await db.insert(committees).values({
          fullName: input.fullName,
          title: input.title,
          committeeType: input.committeeType,
          department: input.department || null,
          role: input.role || null,
          email: input.email || null,
          phone: input.phone || null,
          displayOrder: input.displayOrder,
        });

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "create",
          resourceType: "committee",
          resourceId: Number(newCommittee.insertId),
          details: {
            message: `Created committee member: ${input.fullName}`,
            committeeType: input.committeeType,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true, id: Number(newCommittee.insertId) };
      }),

    // Admin: Update committee member
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          fullName: z.string().min(1, "Full name is required"),
          title: z.string().min(1, "Title is required"),
          committeeType: z.enum(["scientific", "organizing", "reception", "technical"]),
          department: z.string().optional(),
          role: z.string().optional(),
          email: z.string().email().optional().or(z.literal("")),
          phone: z.string().optional(),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await db
          .update(committees)
          .set({
            fullName: input.fullName,
            title: input.title,
            committeeType: input.committeeType,
            department: input.department || null,
            role: input.role || null,
            email: input.email || null,
            phone: input.phone || null,
            displayOrder: input.displayOrder,
          })
          .where(eq(committees.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "update",
          resourceType: "committee",
          resourceId: input.id,
          details: {
            message: `Updated committee member: ${input.fullName}`,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true };
      }),

    // Admin: Delete committee member
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const committee = await db
          .select()
          .from(committees)
          .where(eq(committees.id, input.id))
          .limit(1);

        if (!committee || committee.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Committee member not found",
          });
        }

        await db.delete(committees).where(eq(committees.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "delete",
          resourceType: "committee",
          resourceId: input.id,
          details: {
            message: `Deleted committee member: ${committee[0].fullName}`,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true };
      }),
  }),

  // Keynote Speakers Router
  keynoteSpeakers: router({
    // Public: Get all visible keynote speakers
    list: publicProcedure.query(async () => {
      const speakers = await db
        .select()
        .from(keynoteSpeakers)
        .where(eq(keynoteSpeakers.isVisible, true))
        .orderBy(keynoteSpeakers.displayOrder);
      return speakers;
    }),

    // Admin: Get all keynote speakers (including hidden)
    listAll: adminProcedure.query(async () => {
      const speakers = await db
        .select()
        .from(keynoteSpeakers)
        .orderBy(keynoteSpeakers.displayOrder);
      return speakers;
    }),

    // Admin: Create keynote speaker
    create: adminProcedure
      .input(
        z.object({
          fullName: z.string().min(1, "Full name is required"),
          title: z.string().min(1, "Title is required"),
          affiliation: z.string().min(1, "Affiliation is required"),
          presentationTitle: z.string().min(1, "Presentation title is required"),
          presentationTitleAr: z.string().optional(),
          presentationAbstract: z.string().optional(),
          bio: z.string().optional(),
          bioAr: z.string().optional(),
          photoUrl: z.string().optional(),
          linkedinUrl: z.string().url().optional().or(z.literal("")),
          twitterUrl: z.string().url().optional().or(z.literal("")),
          websiteUrl: z.string().url().optional().or(z.literal("")),
          displayOrder: z.number().default(0),
          isVisible: z.boolean().default(true),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const newSpeaker = await db.insert(keynoteSpeakers).values({
          fullName: input.fullName,
          title: input.title,
          affiliation: input.affiliation,
          presentationTitle: input.presentationTitle,
          presentationTitleAr: input.presentationTitleAr || null,
          presentationAbstract: input.presentationAbstract || null,
          bio: input.bio || null,
          bioAr: input.bioAr || null,
          photoUrl: input.photoUrl || null,
          linkedinUrl: input.linkedinUrl || null,
          twitterUrl: input.twitterUrl || null,
          websiteUrl: input.websiteUrl || null,
          displayOrder: input.displayOrder,
          isVisible: input.isVisible,
        });

        const speakerId = Number((newSpeaker as any).insertId);

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "create",
          resourceType: "keynote_speaker",
          resourceId: speakerId,
          details: {
            message: `Created keynote speaker: ${input.fullName}`,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true, id: speakerId };
      }),

    // Admin: Update keynote speaker
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          fullName: z.string().min(1, "Full name is required"),
          title: z.string().min(1, "Title is required"),
          affiliation: z.string().min(1, "Affiliation is required"),
          presentationTitle: z.string().min(1, "Presentation title is required"),
          presentationTitleAr: z.string().optional(),
          presentationAbstract: z.string().optional(),
          bio: z.string().optional(),
          bioAr: z.string().optional(),
          photoUrl: z.string().optional(),
          linkedinUrl: z.string().url().optional().or(z.literal("")),
          twitterUrl: z.string().url().optional().or(z.literal("")),
          websiteUrl: z.string().url().optional().or(z.literal("")),
          displayOrder: z.number().default(0),
          isVisible: z.boolean().default(true),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await db
          .update(keynoteSpeakers)
          .set({
            fullName: input.fullName,
            title: input.title,
            affiliation: input.affiliation,
            presentationTitle: input.presentationTitle,
            presentationTitleAr: input.presentationTitleAr || null,
            presentationAbstract: input.presentationAbstract || null,
            bio: input.bio || null,
            bioAr: input.bioAr || null,
            photoUrl: input.photoUrl || null,
            linkedinUrl: input.linkedinUrl || null,
            twitterUrl: input.twitterUrl || null,
            websiteUrl: input.websiteUrl || null,
            displayOrder: input.displayOrder,
            isVisible: input.isVisible,
          })
          .where(eq(keynoteSpeakers.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "update",
          resourceType: "keynote_speaker",
          resourceId: input.id,
          details: {
            message: `Updated keynote speaker: ${input.fullName}`,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true };
      }),

    // Admin: Delete keynote speaker
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const speaker = await db
          .select()
          .from(keynoteSpeakers)
          .where(eq(keynoteSpeakers.id, input.id))
          .limit(1);

        if (!speaker || speaker.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Keynote speaker not found",
          });
        }

        await db.delete(keynoteSpeakers).where(eq(keynoteSpeakers.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "delete",
          resourceType: "keynote_speaker",
          resourceId: input.id,
          details: {
            message: `Deleted keynote speaker: ${speaker[0].fullName}`,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true };
      }),
  }),

  // Volunteer Registration
  volunteers: router({
    // Public: Submit volunteer application
    submit: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1, "Full name is required"),
          email: z.string().email("Invalid email address"),
          phone: z.string().min(1, "Phone number is required"),
          studentId: z.string().min(1, "Student ID is required"),
          academicYear: z.enum(["1", "2", "3", "4", "graduate"]),
          department: z.string().min(1, "Department is required"),
          preferredCommittee: z.string().min(1, "Please select a committee"),
          secondChoiceCommittee: z.string().optional(),
          skills: z.string().optional(),
          previousExperience: z.string().optional(),
          availability: z.object({
            day1: z.boolean(),
            day2: z.boolean(),
            beforeConference: z.boolean(),
          }),
          whyVolunteer: z.string().min(10, "Please tell us why you want to volunteer (minimum 10 characters)"),
        })
      )
      .mutation(async ({ input }) => {
        const result = await db.insert(volunteers).values({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          studentId: input.studentId,
          academicYear: input.academicYear,
          department: input.department,
          preferredCommittee: input.preferredCommittee,
          secondChoiceCommittee: input.secondChoiceCommittee || null,
          skills: input.skills || null,
          previousExperience: input.previousExperience || null,
          availability: input.availability,
          whyVolunteer: input.whyVolunteer,
          status: "pending",
        });

        return {
          success: true,
          id: result[0].insertId,
          message: "Your volunteer application has been submitted successfully!",
        };
      }),

    // Admin: List all volunteers with filters
    list: adminProcedure
      .input(
        z.object({
          status: z.enum(["all", "pending", "approved", "rejected"]).optional(),
          committee: z.string().optional(),
          academicYear: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        let query = db.select().from(volunteers);

        // Apply filters
        const conditions = [];
        if (input.status && input.status !== "all") {
          conditions.push(eq(volunteers.status, input.status));
        }
        if (input.committee) {
          conditions.push(eq(volunteers.preferredCommittee, input.committee));
        }
        if (input.academicYear) {
          conditions.push(eq(volunteers.academicYear, input.academicYear));
        }

        const results = await db
          .select()
          .from(volunteers)
          .orderBy(desc(volunteers.createdAt));

        // Filter in memory (simpler for now)
        let filtered = results;
        if (input.status && input.status !== "all") {
          filtered = filtered.filter((v) => v.status === input.status);
        }
        if (input.committee) {
          filtered = filtered.filter((v) => v.preferredCommittee === input.committee);
        }
        if (input.academicYear) {
          filtered = filtered.filter((v) => v.academicYear === input.academicYear);
        }

        return filtered;
      }),

    // Admin: Get volunteer statistics
    stats: adminProcedure.query(async () => {
      const allVolunteers = await db.select().from(volunteers);

      const stats = {
        total: allVolunteers.length,
        pending: allVolunteers.filter((v) => v.status === "pending").length,
        approved: allVolunteers.filter((v) => v.status === "approved").length,
        rejected: allVolunteers.filter((v) => v.status === "rejected").length,
        byCommittee: {} as Record<string, number>,
        byYear: {} as Record<string, number>,
      };

      // Count by committee
      allVolunteers.forEach((v) => {
        stats.byCommittee[v.preferredCommittee] = (stats.byCommittee[v.preferredCommittee] || 0) + 1;
      });

      // Count by academic year
      allVolunteers.forEach((v) => {
        stats.byYear[v.academicYear] = (stats.byYear[v.academicYear] || 0) + 1;
      });

      return stats;
    }),

    // Admin: Update volunteer status
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "approved", "rejected"]),
          assignedCommittee: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await db
          .update(volunteers)
          .set({
            status: input.status,
            assignedCommittee: input.assignedCommittee || null,
            notes: input.notes || null,
            reviewedBy: ctx.user?.email || null,
            reviewedAt: new Date(),
          })
          .where(eq(volunteers.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "update",
          resourceType: "volunteer",
          resourceId: input.id,
          details: {
            message: `Updated volunteer status to ${input.status}`,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true };
      }),

    // Admin: Send bulk email to volunteers
    sendBulkEmail: adminProcedure
      .input(
        z.object({
          subject: z.string().min(1),
          message: z.string().min(1),
          filters: z.object({
            status: z.enum(["all", "pending", "approved", "rejected"]).optional(),
            committee: z.string().optional(),
            academicYear: z.string().optional(),
          }).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Get filtered volunteers
        let query = db.select().from(volunteers);
        const results = await db
          .select()
          .from(volunteers)
          .orderBy(desc(volunteers.createdAt));

        // Filter in memory
        let filtered = results;
        if (input.filters?.status && input.filters.status !== "all") {
          filtered = filtered.filter((v) => v.status === input.filters!.status);
        }
        if (input.filters?.committee) {
          filtered = filtered.filter((v) => v.preferredCommittee === input.filters!.committee);
        }
        if (input.filters?.academicYear) {
          filtered = filtered.filter((v) => v.academicYear === input.filters!.academicYear);
        }

        if (filtered.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No volunteers match the selected filters",
          });
        }

        // In a real implementation, you would send emails here using an email service
        // For now, we'll just log the action and return success
        const recipients = filtered.map((v) => v.email).join(", ");
        
        console.log(`[Bulk Email] Sending to ${filtered.length} volunteers`);
        console.log(`[Bulk Email] Subject: ${input.subject}`);
        console.log(`[Bulk Email] Recipients: ${recipients}`);

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "bulk_email",
          resourceType: "volunteer",
          resourceId: undefined,
          details: {
            message: `Sent bulk email to ${filtered.length} volunteers`,
            subject: input.subject,
            filters: input.filters,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { 
          success: true, 
          recipientCount: filtered.length,
          recipients: filtered.map(v => ({ name: v.fullName, email: v.email }))
        };
      }),

    // Admin: Delete volunteer application
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const volunteer = await db
          .select()
          .from(volunteers)
          .where(eq(volunteers.id, input.id))
          .limit(1);

        if (!volunteer || volunteer.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Volunteer application not found",
          });
        }

        await db.delete(volunteers).where(eq(volunteers.id, input.id));

        // Log audit action
        await logAuditAction({
          adminId: undefined,
          adminEmail: ctx.user?.email,
          adminName: ctx.user?.name,
          action: "delete",
          resourceType: "volunteer",
          resourceId: input.id,
          details: {
            message: `Deleted volunteer application: ${volunteer[0].fullName}`,
          },
          ipAddress: getIpAddress(ctx.req),
          userAgent: getUserAgent(ctx.req),
        });

        return { success: true };
      }),
  }),

  // Announcements router
  announcements: router({
    // Public: get all active announcements
    getActive: publicProcedure.query(async () => {
      const activeAnnouncements = await db
        .select()
        .from(announcements)
        .where(eq(announcements.isActive, true))
        .orderBy(desc(announcements.createdAt));
      return activeAnnouncements;
    }),

    // Admin: get all announcements
    getAll: adminProcedure.query(async () => {
      return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
    }),

    // Admin: create announcement
    create: adminProcedure
      .input(z.object({
        message: z.string().min(1).max(500),
        messageAr: z.string().max(500).optional(),
        type: z.enum(["info", "warning", "success", "urgent"]).default("info"),
        isActive: z.boolean().default(true),
        link: z.string().url().optional().or(z.literal("")),
        linkText: z.string().max(100).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const admin = await getAdminByOpenId(ctx.user!.openId);
        const result = await db.insert(announcements).values({
          message: input.message,
          messageAr: input.messageAr || null,
          type: input.type,
          isActive: input.isActive,
          link: input.link || null,
          linkText: input.linkText || null,
          createdBy: ctx.user!.openId,
          createdByName: admin?.name || ctx.user!.name || "Admin",
        });
        return { success: true, id: Number(result[0].insertId) };
      }),

    // Admin: update announcement
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        message: z.string().min(1).max(500).optional(),
        messageAr: z.string().max(500).optional().nullable(),
        type: z.enum(["info", "warning", "success", "urgent"]).optional(),
        isActive: z.boolean().optional(),
        link: z.string().optional().nullable(),
        linkText: z.string().max(100).optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.update(announcements).set(updates).where(eq(announcements.id, id));
        return { success: true };
      }),

    // Admin: toggle active status
    toggleActive: adminProcedure
      .input(z.object({ id: z.number(), isActive: z.boolean() }))
      .mutation(async ({ input }) => {
        await db.update(announcements).set({ isActive: input.isActive }).where(eq(announcements.id, input.id));
        return { success: true };
      }),

    // Admin: delete announcement
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(announcements).where(eq(announcements.id, input.id));
        return { success: true };
      }),

    // Admin: send announcement email to all registrants
    sendToRegistrants: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        // Get the announcement
        const [announcement] = await db
          .select()
          .from(announcements)
          .where(eq(announcements.id, input.id))
          .limit(1);
        if (!announcement) throw new TRPCError({ code: "NOT_FOUND", message: "Announcement not found" });

        // Get all registrant emails (distinct, non-null)
        const allRegistrants = await db
          .select({ email: registrations.email, name: registrations.fullNameEnglish })
          .from(registrations);

        const uniqueEmails = Array.from(
          new Map(allRegistrants.filter(r => r.email).map(r => [r.email, r])).values()
        );

        if (uniqueEmails.length === 0) {
          return { success: true, sent: 0, failed: 0, message: "No registrants found" };
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Email service not configured" });

        const typeColors: Record<string, string> = {
          info: "#2563eb",
          warning: "#d97706",
          success: "#16a34a",
          urgent: "#dc2626",
        };
        const accentColor = typeColors[announcement.type] || "#2563eb";

        let sent = 0;
        let failed = 0;

        // Send one at a time to respect Resend's 2 req/sec rate limit
        for (const registrant of uniqueEmails) {
            const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <tr><td style="background:${accentColor};padding:24px 32px">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">SCI 2026 — Conference Announcement</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,.85);font-size:14px">Science at the Core of Innovation | Faculty of Science, Cairo University</p>
        </td></tr>
        <tr><td style="padding:32px">
          <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6">${announcement.message}</p>
          ${announcement.messageAr ? `<p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;direction:rtl;text-align:right">${announcement.messageAr}</p>` : ""}
          ${announcement.link ? `<p style="margin:24px 0 0"><a href="${announcement.link}" style="background:${accentColor};color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${announcement.linkText || "Learn More"}</a></p>` : ""}
        </td></tr>
        <tr><td style="background:#f1f5f9;padding:20px 32px;border-top:1px solid #e2e8f0">
          <p style="margin:0;color:#64748b;font-size:12px">You are receiving this email because you registered for SCI 2026. Conference: April 7-8, 2026 | Cairo University, Faculty of Science.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

            try {
              const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${RESEND_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: "SCI 2026 <noreply@sciconf26.website>",
                  to: [registrant.email],
                  reply_to: "sci.conf.2026@gmail.com",
                  subject: `[SCI 2026] ${announcement.message.slice(0, 80)}${announcement.message.length > 80 ? "..." : ""}`,
                  html: htmlBody,
                }),
              });
              const data = await res.json() as { id?: string; statusCode?: number; message?: string };
              if (data.id) {
                sent++;
              } else {
                console.error(`[Announcement Email] Failed to send to ${registrant.email}:`, data);
                failed++;
              }
            } catch (err) {
              console.error(`[Announcement Email] Error sending to ${registrant.email}:`, err);
              failed++;
            }
          // 600ms delay between sends to stay within 2 req/sec limit
          await new Promise(resolve => setTimeout(resolve, 600));
        }

        // Log the send action
        await db.insert(auditLogs).values({
          adminEmail: "system",
          action: "announcement_email_sent",
          resourceType: "announcement",
          resourceId: announcement.id,
          details: `Announcement #${announcement.id} sent to ${sent} registrants (${failed} failed): "${announcement.message.slice(0, 100)}"`
        });

        return {
          success: true,
          sent,
          failed,
          total: uniqueEmails.length,
          message: `Email sent to ${sent} of ${uniqueEmails.length} registrants${failed > 0 ? ` (${failed} failed)` : ""}`,
        };
      }),

    // Admin: send attendance confirmation + invoice request email to all registrants
    sendAttendanceConfirmation: adminProcedure
      .mutation(async () => {
        // Get all registrants with their details
        const allRegistrants = await db
          .select({
            email: registrations.email,
            nameEn: registrations.fullNameEnglish,
            nameAr: registrations.fullNameArabic,
            participationType: registrations.participationType,
            attendeeCategory: registrations.attendeeCategory,
          })
          .from(registrations);

        const uniqueRegistrants = Array.from(
          new Map(allRegistrants.filter(r => r.email).map(r => [r.email, r])).values()
        );

        if (uniqueRegistrants.length === 0) {
          return { success: true, sent: 0, failed: 0, message: "No registrants found" };
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Email service not configured" });

        let sent = 0;
        let failed = 0;

        // Send one at a time to respect Resend's 2 req/sec rate limit
        for (const reg of uniqueRegistrants) {
            const firstName = reg.nameEn?.split(" ")[0] || "Participant";

            const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SCI 2026 – Attendance Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.10)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a3a6b 0%,#2563eb 100%);padding:28px 36px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px">SCI 2026 — Attendance Confirmation</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,.80);font-size:13px">Science at the Core of Innovation | April 7–8, 2026</p>
                  <p style="margin:2px 0 0;color:rgba(255,255,255,.70);font-size:12px">Faculty of Science, Cairo University</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px">

            <!-- English section -->
            <p style="margin:0 0 12px;color:#1e3a5f;font-size:16px;font-weight:600">Dear ${firstName},</p>
            <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7">
              We are pleased to confirm your registration for the <strong>1st Annual Conference of the Faculty of Science, Cairo University — SCI 2026</strong>, taking place on <strong>April 7–8, 2026</strong> at the University Hostel, Cairo University.
            </p>
            <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7">
              To complete your registration and secure your certificate, please pay the <strong>certificate fee (100 EGP)</strong> using one of the methods below, then send a soft copy (scan or clear photo) of your payment receipt to <strong>sci.conf.2026@gmail.com</strong> by <strong>April 1, 2026</strong>:
            </p>

            <!-- Payment methods box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;margin:0 0 24px">
              <tr>
                <td style="padding:18px 24px">
                  <p style="margin:0 0 12px;color:#1e40af;font-size:14px;font-weight:700">💳 Payment Methods (choose one):</p>
                  <p style="margin:0 0 2px;color:#374151;font-size:13px;font-weight:600">Option 1 — InstaPay Transfer:</p>
                  <p style="margin:0 0 12px;color:#1d4ed8;font-size:16px;font-weight:700">9450882167 (CBE)</p>
                  <p style="margin:0 0 2px;color:#374151;font-size:13px;font-weight:600">Option 2 — Send receipt by email:</p>
                  <p style="margin:0 0 12px;color:#1d4ed8;font-size:16px;font-weight:700">sci.conf.2026@gmail.com</p>
                  <p style="margin:8px 0 0;color:#374151;font-size:13px">Subject line: <em>Invoice – [Your Full Name] – SCI 2026</em></p>
                  <p style="margin:6px 0 0;color:#dc2626;font-size:13px;font-weight:600">⏰ Deadline: April 1, 2026</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6">
              If you have already submitted your payment receipt, please disregard this message.
            </p>
            <p style="margin:0 0 24px;color:#374151;font-size:14px;line-height:1.6">
              For any inquiries, feel free to reply to this email or contact us at <a href="mailto:sci.conf.2026@gmail.com" style="color:#2563eb">sci.conf.2026@gmail.com</a>.
            </p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">

            <!-- Arabic section -->
            <div dir="rtl" style="text-align:right">
              <p style="margin:0 0 12px;color:#1e3a5f;font-size:16px;font-weight:600">عزيزي/عزيزتي ${firstName}،</p>
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.8">
                يسعدنا تأكيد تسجيلك في <strong>المؤتمر السنوي الأول لكلية العلوم، جامعة القاهرة — SCI 2026</strong>، المقرر انعقاده في <strong>7–8 أبريل 2026</strong> بمدينة الضيافة، جامعة القاهرة.
              </p>
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.8">
                لاستكمال تسجيلك والحصول على شهادة المشاركة، يُرجى سداد <strong>رسوم الشهادة (100 جنيه مصري)</strong> بإحدى الطريقتين التاليتين، ثم إرسال صورة الإيصال إلى <strong>sci.conf.2026@gmail.com</strong> في موعد أقصاه <strong>1 أبريل 2026</strong>:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;margin:0 0 20px">
                <tr>
                  <td style="padding:18px 24px">
                    <p style="margin:0 0 12px;color:#1e40af;font-size:14px;font-weight:700">💳 طرق الدفع (اختر إحداهما):</p>
                    <p style="margin:0 0 2px;color:#374151;font-size:13px;font-weight:600">الطريقة الأولى — التحويل عبر InstaPay:</p>
                    <p style="margin:0 0 12px;color:#1d4ed8;font-size:16px;font-weight:700">9450882167 (البنك المركزي)</p>
                    <p style="margin:0 0 2px;color:#374151;font-size:13px;font-weight:600">الطريقة الثانية — إرسال الإيصال بالبريد الإلكتروني:</p>
                    <p style="margin:0 0 12px;color:#1d4ed8;font-size:16px;font-weight:700">sci.conf.2026@gmail.com</p>
                    <p style="margin:8px 0 0;color:#374151;font-size:13px">موضوع الرسالة: <em>إيصال – [اسمك الكامل] – SCI 2026</em></p>
                    <p style="margin:6px 0 0;color:#dc2626;font-size:13px;font-weight:600">⏰ الموعد النهائي: 1 أبريل 2026</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.7">إذا كنت قد أرسلت الإيصال بالفعل، يُرجى تجاهل هذه الرسالة.</p>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f1f5f9;padding:20px 36px;border-top:1px solid #e2e8f0">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 4px;color:#1e3a5f;font-size:13px;font-weight:600">SCI 2026 Organizing Committee</p>
                  <p style="margin:0;color:#64748b;font-size:12px">Faculty of Science, Cairo University | April 7–8, 2026</p>
                  <p style="margin:4px 0 0;color:#64748b;font-size:12px">
                    <a href="https://sciconf26.website" style="color:#2563eb;text-decoration:none">sciconf26.website</a> &nbsp;|&nbsp;
                    <a href="mailto:sci.conf.2026@gmail.com" style="color:#2563eb;text-decoration:none">sci.conf.2026@gmail.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

            try {
              const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${RESEND_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: "SCI 2026 Organizing Committee <noreply@sciconf26.website>",
                  to: [reg.email],
                  reply_to: "sci.conf.2026@gmail.com",
                  subject: "[SCI 2026] Attendance Confirmation & Certificate Invoice Request | تأكيد الحضور وطلب إيصال الشهادة",
                  html: htmlBody,
                }),
              });
              const data = await res.json() as { id?: string; statusCode?: number; message?: string };
              if (data.id) {
                sent++;
              } else {
                console.error(`[Confirmation Email] Failed to send to ${reg.email}:`, data);
                failed++;
              }
            } catch (err) {
              console.error(`[Confirmation Email] Error sending to ${reg.email}:`, err);
              failed++;
            }
          // 600ms delay between sends to stay within 2 req/sec limit
          await new Promise(resolve => setTimeout(resolve, 600));
        }

        // Log the action
        await db.insert(auditLogs).values({
          adminEmail: "system",
          action: "attendance_confirmation_sent",
          resourceType: "registration",
          resourceId: 0,
          details: `Attendance confirmation + invoice request sent to ${sent} registrants (${failed} failed)`
        });

        return {
          success: true,
          sent,
          failed,
          total: uniqueRegistrants.length,
          message: `Confirmation email sent to ${sent} of ${uniqueRegistrants.length} registrants${failed > 0 ? ` (${failed} failed)` : ""}`,
        };
      }),

    // Admin: Send NAWAH workshop payment reminder
    sendNawahPaymentReminder: adminProcedure
      .mutation(async () => {
        // Get all NAWAH workshop registrants who haven't paid yet
        const nawahRegistrants = await db
          .select({
            email: registrations.email,
            nameEn: registrations.fullNameEnglish,
            nameAr: registrations.fullNameArabic,
            paymentStatus: registrations.workshopPaymentStatus,
          })
          .from(registrations)
          .where(and(
            eq(registrations.wantsWorkshop, true),
            eq(registrations.workshopChoice, 'nawah')
          ));

        const uniqueRegistrants = Array.from(
          new Map(nawahRegistrants.filter(r => r.email).map(r => [r.email, r])).values()
        );

        if (uniqueRegistrants.length === 0) {
          return { success: true, sent: 0, failed: 0, message: "No NAWAH registrants found" };
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Email service not configured" });

        let sent = 0;
        let failed = 0;

        for (const reg of uniqueRegistrants) {
          const firstName = reg.nameEn?.split(" ")[0] || "Participant";
          const isPaid = reg.paymentStatus === "confirmed" || reg.paymentStatus === "paid";
          const statusNote = isPaid
            ? `<p style="margin:0 0 16px;color:#16a34a;font-size:14px;font-weight:600">✅ Your payment has already been confirmed. No further action is needed.</p>`
            : ``;

          const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SCI 2026 — NAWAH Workshop Payment Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.10)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#14532d 0%,#16a34a 100%);padding:28px 36px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700">SCI 2026 — NAWAH Scientific Workshop</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:13px">Research to Business: Translating Science into Industry</p>
                  <p style="margin:4px 0 0;color:rgba(255,255,255,.70);font-size:12px">April 7–8, 2026 · Faculty of Science, Cairo University</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px">

            <!-- English -->
            <p style="margin:0 0 12px;color:#14532d;font-size:16px;font-weight:600">Dear ${firstName},</p>
            <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7">
              Thank you for registering for the <strong>NAWAH Scientific Workshop</strong> at SCI 2026 — <em>Research to Business: Translating Science into Industry</em>.
            </p>
            ${statusNote}
            ${!isPaid ? `
            <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7">
              To <strong>confirm your spot</strong>, please complete your workshop payment of <strong>200 EGP</strong> (includes certificate) using one of the methods below, then upload your receipt on the registration page or email it to us.
            </p>

            <!-- Payment box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;margin:0 0 20px">
              <tr>
                <td style="padding:18px 24px">
                  <p style="margin:0 0 12px;color:#14532d;font-size:14px;font-weight:700">💳 Payment Methods (choose one):</p>
                  <p style="margin:0 0 2px;color:#374151;font-size:13px;font-weight:600">Option 1 — InstaPay Transfer:</p>
                  <p style="margin:0 0 12px;color:#15803d;font-size:18px;font-weight:700">9450882167 (CBE)</p>
                  <p style="margin:0 0 2px;color:#374151;font-size:13px;font-weight:600">Option 2 — Email your receipt to:</p>
                  <p style="margin:0 0 4px;color:#15803d;font-size:15px;font-weight:700">sci.conf.2026@gmail.com</p>
                  <p style="margin:0 0 12px;color:#6b7280;font-size:12px">Subject: Workshop Invoice – [Your Full Name] – NAWAH – SCI 2026</p>
                  <p style="margin:0;color:#dc2626;font-size:13px;font-weight:600">⏰ Deadline: April 1, 2026 — Seats are limited to 30 participants</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6">
              You can also upload your receipt directly on the registration page at <a href="https://sciconf26.website/registration" style="color:#16a34a;font-weight:600">sciconf26.website/registration</a>.
            </p>
            ` : ``}

            <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6">
              For any questions, reply to this email or contact us at <a href="mailto:sci.conf.2026@gmail.com" style="color:#16a34a">sci.conf.2026@gmail.com</a>.
            </p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">

            <!-- Arabic -->
            <div dir="rtl" style="text-align:right">
              <p style="margin:0 0 12px;color:#14532d;font-size:16px;font-weight:600">عزيزي/عزيزتي ${firstName}،</p>
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.8">
                شكراً لتسجيلك في <strong>ورشة عمل NAWAH Scientific</strong> ضمن فعاليات SCI 2026 — <em>من البحث إلى الأعمال: تحويل العلوم إلى صناعة</em>.
              </p>
              ${isPaid
                ? `<p style="margin:0 0 16px;color:#16a34a;font-size:14px;font-weight:600">✅ تم تأكيد دفعتك بالفعل. لا يلزمك اتخاذ أي إجراء إضافي.</p>`
                : `
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.8">
                لـ<strong>تأكيد مقعدك</strong> في الورشة، يُرجى سداد رسوم الاشتراك البالغة <strong>200 جنيه مصري</strong> (تشمل الشهادة) بإحدى الطريقتين التاليتين، ثم رفع الإيصال على صفحة التسجيل أو إرساله إلينا.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;margin:0 0 20px">
                <tr>
                  <td style="padding:18px 24px">
                    <p style="margin:0 0 12px;color:#14532d;font-size:14px;font-weight:700">💳 طرق الدفع (اختر إحداهما):</p>
                    <p style="margin:0 0 2px;color:#374151;font-size:13px;font-weight:600">الطريقة الأولى — التحويل عبر InstaPay:</p>
                    <p style="margin:0 0 12px;color:#15803d;font-size:18px;font-weight:700">9450882167 (البنك المركزي)</p>
                    <p style="margin:0 0 2px;color:#374151;font-size:13px;font-weight:600">الطريقة الثانية — إرسال الإيصال بالبريد:</p>
                    <p style="margin:0 0 4px;color:#15803d;font-size:15px;font-weight:700">sci.conf.2026@gmail.com</p>
                    <p style="margin:0 0 12px;color:#6b7280;font-size:12px">الموضوع: إيصال ورشة – [اسمك الكامل] – NAWAH – SCI 2026</p>
                    <p style="margin:0;color:#dc2626;font-size:13px;font-weight:600">⏰ الموعد النهائي: 1 أبريل 2026 — المقاعد محدودة (30 مشاركاً فقط)</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6">
                يمكنك أيضاً رفع الإيصال مباشرةً عبر صفحة التسجيل على <a href="https://sciconf26.website/registration" style="color:#16a34a;font-weight:600">sciconf26.website/registration</a>.
              </p>
              `}
              <p style="margin:0;color:#374151;font-size:14px;line-height:1.6">
                لأي استفسار، يُرجى الرد على هذا البريد أو التواصل معنا على <a href="mailto:sci.conf.2026@gmail.com" style="color:#16a34a">sci.conf.2026@gmail.com</a>.
              </p>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#14532d;padding:20px 36px;text-align:center">
            <p style="margin:0;color:#ffffff;font-size:13px;font-weight:600">Science at the Core of Innovation — SCI 2026</p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,.75);font-size:12px">Faculty of Science · Cairo University · April 7–8, 2026</p>
            <p style="margin:6px 0 0;color:rgba(255,255,255,.60);font-size:11px">sciconf26.website · sci.conf.2026@gmail.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

          try {
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "SCI 2026 Organizing Committee <noreply@sciconf26.website>",
                to: [reg.email],
                reply_to: "sci.conf.2026@gmail.com",
                subject: "[SCI 2026] NAWAH Workshop — Please Confirm Your Spot by Paying | ورشة NAWAH — أكّد مشاركتك بالدفع",
                html: htmlBody,
              }),
            });
            const data = await res.json() as { id?: string; statusCode?: number; message?: string };
            if (data.id) {
              sent++;
            } else {
              console.error(`[NAWAH Email] Failed to send to ${reg.email}:`, data);
              failed++;
            }
          } catch (err) {
            console.error(`[NAWAH Email] Error sending to ${reg.email}:`, err);
            failed++;
          }
          await new Promise(resolve => setTimeout(resolve, 600));
        }

        await db.insert(auditLogs).values({
          adminEmail: "system",
          action: "nawah_payment_reminder_sent",
          resourceType: "registration",
          resourceId: 0,
          details: `NAWAH payment reminder sent to ${sent} registrants (${failed} failed) out of ${uniqueRegistrants.length} total`
        });

        return {
          success: true,
          sent,
          failed,
          total: uniqueRegistrants.length,
          message: `NAWAH payment reminder sent to ${sent} of ${uniqueRegistrants.length} registrants${failed > 0 ? ` (${failed} failed)` : ""}`,
        };
      }),

    // Admin: Send payment reminder email to all registrants
    sendPaymentReminder: adminProcedure
      .mutation(async ({ ctx }) => {
        // Fetch all registrants with emails
        const allRegs = await db.select({
          id: registrations.id,
          nameEn: registrations.fullNameEnglish,
          nameAr: registrations.fullNameArabic,
          email: registrations.email,
          wantsCertificate: registrations.wantsCertificate,
          wantsWorkshop: registrations.wantsWorkshop,
          workshopChoice: registrations.workshopChoice,
          workshopChoices: registrations.workshopChoices,
          wantsExtWorkshop: registrations.wantsExtWorkshop,
          extWorkshopChoice: registrations.extWorkshopChoice,
        }).from(registrations);

        const uniqueRegs = Array.from(
          new Map(allRegs.filter(r => r.email).map(r => [r.email, r])).values()
        );

        if (uniqueRegs.length === 0) {
          return { success: true, sent: 0, failed: 0, message: "No registrants found" };
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Email service not configured" });

        const WORKSHOP_LABELS: Record<string, string> = {
          nawah: "NAWAH Scientific — Research to Business (200 EGP)",
          bioinformatics: "Bioinformatics Workshop — Dr. Dina Amr (100 EGP)",
          marc: "MARC — Good Clinical Practice GCP (200 EGP)",
          medsol: "Medsol — From DNA to Proteins: Advanced Sequencing (200 EGP)",
          agitech: "Agitech — NGS & ddPCR in Targeted Therapy (200 EGP)",
          geochemistry: "Geochemistry Workshop (200 EGP)",
        };
        const EXT_WORKSHOP_LABELS: Record<string, string> = {
          chitosan: "Chitosan Workshop — April 6 (100 EGP)",
          agitech: "Agitech — NGS & ddPCR (200 EGP)",
          vaccine: "Vaccine Industry Race — April 6 (100 EGP)",
          biotech: "Biotech Product Dev 101 — April 6 (100 EGP)",
        };

        let sent = 0;
        let failed = 0;

        for (const reg of uniqueRegs) {
          const firstName = reg.nameEn?.split(" ")[0] || "Participant";

          // Build workshop lines
          const workshopKeys: string[] = [];
          if (reg.wantsWorkshop) {
            const choices = reg.workshopChoices ? JSON.parse(reg.workshopChoices as unknown as string) : null;
            if (Array.isArray(choices) && choices.length > 0) {
              workshopKeys.push(...choices);
            } else if (reg.workshopChoice) {
              workshopKeys.push(reg.workshopChoice);
            }
          }
          if (reg.wantsExtWorkshop && reg.extWorkshopChoice) {
            workshopKeys.push(reg.extWorkshopChoice);
          }

          const hasWorkshop = workshopKeys.length > 0;
          const hasCert = reg.wantsCertificate;

          // Build fee breakdown
          const WORKSHOP_FEES: Record<string, number> = {
            nawah: 200, bioinformatics: 100, marc: 200, medsol: 200, agitech: 200,
            geochemistry: 200, chitosan: 100, vaccine: 100, biotech: 100,
          };
          let totalFee = 0;
          if (hasCert) totalFee += 100;
          for (const k of workshopKeys) totalFee += (WORKSHOP_FEES[k] ?? 0);

          const certRow = hasCert ? `
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#374151">Conference Certificate of Attendance | شهادة حضور المؤتمر</td>
              <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#1e40af;font-weight:600;text-align:right">100 EGP</td>
            </tr>` : "";

          const workshopRows = workshopKeys.map(k => {
            const label = WORKSHOP_LABELS[k] || EXT_WORKSHOP_LABELS[k] || k.toUpperCase();
            const fee = WORKSHOP_FEES[k] ?? 0;
            return `
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#374151">${label}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#92400e;font-weight:600;text-align:right">${fee} EGP</td>
            </tr>`;
          }).join("");

          const totalRow = totalFee > 0 ? `
            <tr style="background:#f0fdf4">
              <td style="padding:10px 12px;color:#15803d;font-weight:700">Total Amount | الإجمالي</td>
              <td style="padding:10px 12px;color:#15803d;font-weight:700;text-align:right">${totalFee} EGP</td>
            </tr>` : "";

          const feeTable = (hasCert || hasWorkshop) ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin:16px 0">
            <thead><tr style="background:#1e3a5f">
              <th style="padding:10px 12px;color:#fff;text-align:left;font-size:13px">Item</th>
              <th style="padding:10px 12px;color:#fff;text-align:right;font-size:13px">Amount</th>
            </tr></thead>
            <tbody>${certRow}${workshopRows}${totalRow}</tbody>
          </table>` : `<p style="color:#64748b;font-size:14px;margin:12px 0">You have not registered for a certificate or workshop yet. You can still add them by visiting the registration page before April 1, 2026.</p>`;

          const htmlBody = `<!DOCTYPE html>
<html dir="ltr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1)">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:28px 32px">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">SCI 2026 — Payment Reminder</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:14px">Science at the Core of Innovation | Faculty of Science, Cairo University</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,.75);font-size:13px;direction:rtl;text-align:right">العلوم في قلب الإبتكار | كلية العلوم — جامعة القاهرة</p>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:32px">
        <p style="margin:0 0 8px;color:#1e3a5f;font-size:18px;font-weight:700">Dear ${firstName},</p>
        <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7">We hope you are excited about <strong>SCI 2026 — April 7–8, 2026</strong> at Cairo University, Faculty of Science. This is a friendly reminder about your upcoming payment deadline.</p>

        <!-- Deadline Banner -->
        <div style="background:#fef2f2;border:2px solid #dc2626;border-radius:8px;padding:14px 18px;margin:0 0 20px">
          <p style="margin:0;color:#dc2626;font-size:16px;font-weight:700">⏰ Payment Deadline: April 1, 2026</p>
          <p style="margin:4px 0 0;color:#dc2626;font-size:14px;direction:rtl;text-align:right">آخر موعد للدفع: ١ أبريل ٢٠٢٦</p>
        </div>

        <!-- Fee Breakdown -->
        <h3 style="margin:0 0 8px;color:#1e3a5f;font-size:15px">Your Registration Summary | ملخص تسجيلك</h3>
        ${feeTable}

        <!-- Payment Instructions -->
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:18px;margin:20px 0">
          <h3 style="margin:0 0 12px;color:#1e40af;font-size:15px">💳 How to Pay | طريقة الدفع</h3>
          <p style="margin:0 0 10px;color:#374151;font-size:14px;line-height:1.7">Please transfer the total amount via <strong>InstaPay</strong> to the following account:</p>
          <table cellpadding="0" cellspacing="0" style="width:100%;background:#fff;border:1px solid #bfdbfe;border-radius:6px;overflow:hidden">
            <tr style="background:#1e3a5f"><td colspan="2" style="padding:8px 14px;color:#fff;font-size:13px;font-weight:600">Account Details | بيانات الحساب</td></tr>
            <tr><td style="padding:8px 14px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0">Account Name | اسم الحساب</td><td style="padding:8px 14px;color:#1e3a5f;font-weight:600;font-size:13px;border-bottom:1px solid #e2e8f0">ح/ صندوق الخدمات التعليمية — كلية العلوم، جامعة القاهرة</td></tr>
            <tr><td style="padding:8px 14px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0">Bank | البنك</td><td style="padding:8px 14px;color:#1e3a5f;font-weight:600;font-size:13px;border-bottom:1px solid #e2e8f0">البنك المركزي المصري</td></tr>
            <tr><td style="padding:8px 14px;color:#64748b;font-size:13px">Account Number | رقم الحساب</td><td style="padding:8px 14px;color:#1e3a5f;font-weight:700;font-size:15px;letter-spacing:1px">9450882167</td></tr>
          </table>
          <p style="margin:12px 0 0;color:#374151;font-size:13px;line-height:1.6">After payment, please upload your payment receipt through the registration portal at <a href="https://sciconf26.website/attendance" style="color:#2563eb">sciconf26.website/attendance</a> using your registration ID: <strong>#${reg.id}</strong>.</p>
          <p style="margin:8px 0 0;color:#374151;font-size:13px;line-height:1.6;direction:rtl;text-align:right">بعد الدفع، يرجى رفع إيصال الدفع عبر بوابة التسجيل على <a href="https://sciconf26.website/attendance" style="color:#2563eb">sciconf26.website/attendance</a> باستخدام رقم تسجيلك: <strong>#${reg.id}</strong></p>
        </div>

        <!-- Available Workshops -->
        <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:18px;margin:20px 0">
          <h3 style="margin:0 0 12px;color:#92400e;font-size:15px">🔬 Available Workshops | ورش العمل المتاحة</h3>
          <p style="margin:0 0 10px;color:#374151;font-size:13px">You can still register for workshops before the deadline. Each workshop includes a certificate of completion.</p>
          <ul style="margin:0;padding:0 0 0 18px;color:#374151;font-size:13px;line-height:2">
            <li><strong>NAWAH Scientific</strong> — Research to Business: Translating Science into Industry | 200 EGP</li>
            <li><strong>Bioinformatics Workshop</strong> — Dr. Dina Amr | Introduction to Bioinformatics (Day 1, April 7) | 100 EGP | Max 50 participants</li>
            <li><strong>MARC</strong> — Good Clinical Practice (GCP) Workshop | 200 EGP</li>
            <li><strong>Medsol Corporation</strong> — From DNA to Proteins: Advanced Sequencing Technologies | 200 EGP</li>
            <li><strong>Agitech</strong> — NGS & ddPCR in Targeted Therapy (April 6, 12:00–14:00) | 200 EGP | 20 spots only</li>
          </ul>
          <p style="margin:12px 0 0;color:#92400e;font-size:13px">Register at: <a href="https://sciconf26.website/attendance" style="color:#2563eb">sciconf26.website/attendance</a></p>
          <p style="margin:4px 0 0;color:#92400e;font-size:13px;direction:rtl;text-align:right">سجّل عبر: <a href="https://sciconf26.website/attendance" style="color:#2563eb">sciconf26.website/attendance</a></p>
        </div>

        <p style="margin:20px 0 0;color:#374151;font-size:14px;line-height:1.7">We look forward to seeing you at SCI 2026. For any questions, please contact us at <a href="mailto:sci.conf.2026@gmail.com" style="color:#2563eb">sci.conf.2026@gmail.com</a>.</p>
        <p style="margin:6px 0 0;color:#374151;font-size:14px;direction:rtl;text-align:right">نتطلع إلى رؤيتكم في SCI 2026. لأي استفسار، تواصلوا معنا على <a href="mailto:sci.conf.2026@gmail.com" style="color:#2563eb">sci.conf.2026@gmail.com</a></p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#1e3a5f;padding:20px 32px">
        <p style="margin:0;color:rgba(255,255,255,.8);font-size:12px;text-align:center">SCI 2026 · Faculty of Science, Cairo University · April 7–8, 2026</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,.6);font-size:11px;text-align:center">You are receiving this email because you registered for SCI 2026.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

          try {
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: "SCI 2026 <sci2026@sciconf26.website>",
                to: [reg.email],
                reply_to: "sci.conf.2026@gmail.com",
                subject: "[SCI 2026] Payment Reminder — Deadline April 1, 2026 | تذكير بالدفع",
                html: htmlBody,
              }),
            });
            const data = await res.json() as { id?: string; statusCode?: number; message?: string };
            if (data.id) {
              sent++;
            } else {
              console.error(`[Payment Reminder] Failed for ${reg.email}:`, data);
              failed++;
            }
          } catch (err) {
            console.error(`[Payment Reminder] Error for ${reg.email}:`, err);
            failed++;
          }
          // 600ms delay to respect Resend rate limit
          await new Promise(resolve => setTimeout(resolve, 600));
        }

        await db.insert(auditLogs).values({
          adminEmail: ctx.user?.email || "admin",
          action: "payment_reminder_sent",
          resourceType: "registration",
          resourceId: 0,
          details: `Payment reminder sent to ${sent} registrants (${failed} failed)`,
        });

        return {
          success: true,
          sent,
          failed,
          total: uniqueRegs.length,
          message: `Payment reminder sent to ${sent} of ${uniqueRegs.length} registrants${failed > 0 ? ` (${failed} failed)` : ""}`,
        };
      }),
  }),

  // ─── Acceptance Emails ───────────────────────────────────────────────────────
  acceptance: router({
    /**
     * Send a personalized acceptance/confirmation email to registrants.
     * Lists their selected workshops, fees, and payment instructions.
     * Supports optional filter: 'all' | 'unpaid' | 'paid'
     * Or pass specific registrationIds to send to a subset.
     */
    sendAcceptanceEmails: adminProcedure
      .input(z.object({
        filter: z.enum(["all", "unpaid", "paid"]).default("all"),
        registrationIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input }) => {
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Email service not configured" });

        // Workshop metadata
        const WORKSHOP_META: Record<string, { nameEn: string; nameAr: string; fee: number; date: string }> = {
          nawah:               { nameEn: "NAWAH Scientific Workshop",         nameAr: "\u0648\u0631\u0634\u0629 \u0639\u0645\u0644 \u0646\u0648\u0627\u0629 \u0644\u0644\u0639\u0644\u0648\u0645",               fee: 200, date: "April 7\u20138, 2026" },
          marc:                { nameEn: "Good Clinical Practice (MARC)",     nameAr: "\u0627\u0644\u0645\u0645\u0627\u0631\u0633\u0629 \u0627\u0644\u0633\u0631\u064a\u0631\u064a\u0629 \u0627\u0644\u062c\u064a\u062f\u0629 (MARC)",    fee: 200, date: "April 8, 2026" },
          medsol:              { nameEn: "Nanopore & Protein Sequencing",     nameAr: "\u062a\u0633\u0644\u0633\u0644 \u0627\u0644\u0646\u0627\u0646\u0648\u0628\u0648\u0631 \u0648\u0627\u0644\u0628\u0631\u0648\u062a\u064a\u0646",          fee: 200, date: "April 7\u20138, 2026" },
          agitech:             { nameEn: "NGS & ddPCR Therapy",               nameAr: "\u0627\u0644\u062a\u0633\u0644\u0633\u0644 \u0627\u0644\u062c\u064a\u0646\u064a \u0648ddPCR",             fee: 200, date: "April 6, 2026" },
          geochemistry:        { nameEn: "Geochemistry Workshop",             nameAr: "\u0648\u0631\u0634\u0629 \u0639\u0645\u0644 \u0627\u0644\u062c\u064a\u0648\u0643\u064a\u0645\u064a\u0627\u0621",              fee: 0,   date: "April 7\u20138, 2026" },
          chitosan:            { nameEn: "Biotech Product Dev 101",           nameAr: "\u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0628\u064a\u0648\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0629",       fee: 100, date: "April 6, 2026" },
          scrna_seq:           { nameEn: "Intro to Single Cell Genomics",     nameAr: "\u0645\u0642\u062f\u0645\u0629 \u0641\u064a \u062c\u064a\u0646\u0648\u0645\u064a\u0627\u062a \u0627\u0644\u062e\u0644\u064a\u0629 \u0627\u0644\u0648\u0627\u062d\u062f\u0629",  fee: 200, date: "April 9, 2026" },
          ai_biotech:          { nameEn: "AI Meets Biotech",                  nameAr: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u064a\u0644\u062a\u0642\u064a \u0627\u0644\u0628\u064a\u0648\u062a\u0643",    fee: 100, date: "April 9, 2026" },
          hvd_genomics:        { nameEn: "Genomics & Proteomics (HVD)",       nameAr: "\u0627\u0644\u062c\u064a\u0646\u0648\u0645\u064a\u0627\u062a \u0648\u0627\u0644\u0628\u0631\u0648\u062a\u064a\u0648\u0645\u064a\u0627\u062a (HVD)",      fee: 200, date: "April 12, 2026" },
          vaccine_industry:    { nameEn: "The Vaccine Industry Race",         nameAr: "\u0633\u0628\u0627\u0642 \u0635\u0646\u0627\u0639\u0629 \u0627\u0644\u0644\u0642\u0627\u062d\u0627\u062a",              fee: 100, date: "April 6, 2026" },
          gesr_scholarships:   { nameEn: "From Lab to Global Opportunities", nameAr: "\u0645\u0646 \u0627\u0644\u0645\u062e\u062a\u0628\u0631 \u0625\u0644\u0649 \u0627\u0644\u0641\u0631\u0635 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629",     fee: 0,   date: "April 9, 2026" },
          colors_metagenomics: { nameEn: "Metagenomics & Microbiome",         nameAr: "\u0627\u0644\u0645\u064a\u062a\u0627\u062c\u064a\u0646\u0648\u0645\u064a\u0643\u0633 \u0648\u0627\u0644\u0645\u064a\u0643\u0631\u0648\u0628\u064a\u0648\u0645",       fee: 200, date: "TBA" },
        };

        // Fetch all registrants
        const allRegs = await db.select({
          id: registrations.id,
          email: registrations.email,
          nameEn: registrations.fullNameEnglish,
          nameAr: registrations.fullNameArabic,
          wantsCertificate: registrations.wantsCertificate,
          wantsWorkshop: registrations.wantsWorkshop,
          workshopChoice: registrations.workshopChoice,
          workshopPaymentStatus: registrations.workshopPaymentStatus,
          wantsExtWorkshop: registrations.wantsExtWorkshop,
          extWorkshopChoice: registrations.extWorkshopChoice,
          extWorkshopPaymentStatus: registrations.extWorkshopPaymentStatus,
          paymentStatus: registrations.paymentStatus,
        }).from(registrations);

        // Apply filter
        let filtered = allRegs;
        if (input.registrationIds && input.registrationIds.length > 0) {
          filtered = allRegs.filter(r => input.registrationIds!.includes(r.id));
        } else if (input.filter === "unpaid") {
          filtered = allRegs.filter(r => r.paymentStatus !== "paid" && r.paymentStatus !== "confirmed");
        } else if (input.filter === "paid") {
          filtered = allRegs.filter(r => r.paymentStatus === "paid" || r.paymentStatus === "confirmed");
        }

        // Deduplicate by email
        const uniqueRegs = Array.from(new Map(filtered.filter(r => r.email).map(r => [r.email, r])).values());
        if (uniqueRegs.length === 0) {
          return { success: true, sent: 0, failed: 0, total: 0, message: "No registrants found matching the filter" };
        }

        let sent = 0;
        let failed = 0;

        for (const reg of uniqueRegs) {
          const firstName = reg.nameEn?.split(" ")[0] || "Participant";
          const firstNameAr = reg.nameAr?.split(" ")[0] || "\u0627\u0644\u0645\u0634\u0627\u0631\u0643";

          // Collect selected workshop keys
          const selectedKeys: string[] = [];
          if (reg.wantsWorkshop && reg.workshopChoice) selectedKeys.push(reg.workshopChoice);
          if (reg.wantsExtWorkshop && reg.extWorkshopChoice) selectedKeys.push(reg.extWorkshopChoice);

          // Build workshop table rows
          let totalWorkshopFee = 0;
          let wsRowsEn = "";
          let wsRowsAr = "";

          if (selectedKeys.length === 0) {
            wsRowsEn = `<tr><td colspan="3" style="padding:10px 12px;color:#6b7280;font-size:13px;text-align:center">No workshops selected</td></tr>`;
            wsRowsAr = `<tr><td colspan="3" style="padding:10px 12px;color:#6b7280;font-size:13px;text-align:center">\u0644\u0645 \u064a\u062a\u0645 \u0627\u062e\u062a\u064a\u0627\u0631 \u0648\u0631\u0634 \u0639\u0645\u0644</td></tr>`;
          } else {
            for (const key of selectedKeys) {
              const ws = WORKSHOP_META[key];
              if (!ws) continue;
              totalWorkshopFee += ws.fee;
              const feeEn = ws.fee === 0 ? `<span style="color:#16a34a;font-weight:700">FREE</span>` : `<strong>${ws.fee} EGP</strong>`;
              const feeAr = ws.fee === 0 ? `<span style="color:#16a34a;font-weight:700">\u0645\u062c\u0627\u0646\u064a</span>` : `<strong>${ws.fee} \u062c.\u0645</strong>`;
              wsRowsEn += `<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 12px;font-size:13px;color:#111827;font-weight:600">${ws.nameEn}</td><td style="padding:10px 12px;font-size:12px;color:#6b7280">${ws.date}</td><td style="padding:10px 12px;font-size:13px;text-align:right">${feeEn}</td></tr>`;
              wsRowsAr += `<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 12px;font-size:13px;color:#111827;font-weight:600;text-align:right">${ws.nameAr}</td><td style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:right">${ws.date}</td><td style="padding:10px 12px;font-size:13px;text-align:left">${feeAr}</td></tr>`;
            }
          }

          const certFee = reg.wantsCertificate ? 100 : 0;
          const grandTotal = certFee + totalWorkshopFee;
          const isPaid = reg.paymentStatus === "paid" || reg.paymentStatus === "confirmed";

          const paymentBlock = isPaid
            ? `<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px 20px;margin:0 0 20px">
                <p style="margin:0;color:#15803d;font-size:14px;font-weight:700">\u2705 Your payment has been received and confirmed. No further action needed.</p>
                <p style="margin:6px 0 0;color:#15803d;font-size:13px" dir="rtl">\u2705 \u062a\u0645 \u0627\u0633\u062a\u0644\u0627\u0645 \u062f\u0641\u0639\u062a\u0643 \u0648\u062a\u0623\u0643\u064a\u062f\u0647\u0627. \u0644\u0627 \u064a\u0644\u0632\u0645 \u0627\u062a\u062e\u0627\u0630 \u0623\u064a \u0625\u062c\u0631\u0627\u0621 \u0625\u0636\u0627\u0641\u064a.</p>
               </div>`
            : `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:18px 24px;margin:0 0 20px">
                <p style="margin:0 0 10px;color:#1e40af;font-size:14px;font-weight:700">\ud83d\udcb3 Payment Instructions | \u062a\u0639\u0644\u064a\u0645\u0627\u062a \u0627\u0644\u062f\u0641\u0639</p>
                <p style="margin:0 0 4px;color:#374151;font-size:13px;font-weight:600">Option 1 \u2014 InstaPay:</p>
                <p style="margin:0 0 12px;color:#1d4ed8;font-size:17px;font-weight:700">9450882167 (CBE)</p>
                <p style="margin:0 0 4px;color:#374151;font-size:13px;font-weight:600">Option 2 \u2014 Bank Transfer:</p>
                <p style="margin:0 0 2px;color:#374151;font-size:13px">\u062d/ \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u062a\u0639\u0644\u064a\u0645\u064a\u0629 \u2014 \u0643\u0644\u064a\u0629 \u0627\u0644\u0639\u0644\u0648\u0645\u060c \u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0642\u0627\u0647\u0631\u0629</p>
                <p style="margin:0 0 12px;color:#1d4ed8;font-size:14px;font-weight:700">Account: 9/450/88216/7 (CBE)</p>
                <p style="margin:0 0 4px;color:#374151;font-size:13px;font-weight:600">After payment, email your receipt to:</p>
                <p style="margin:0 0 4px;color:#1d4ed8;font-size:14px;font-weight:700">sci.conf.2026@gmail.com</p>
                <p style="margin:4px 0 0;color:#374151;font-size:12px">Subject: <em>Invoice \u2013 ${reg.nameEn} \u2013 SCI 2026</em></p>
                <p style="margin:4px 0 0;color:#dc2626;font-size:12px;font-weight:600">\u23f0 Deadline: April 1, 2026</p>
               </div>`;

          const certRowEn = reg.wantsCertificate ? `<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 12px;font-size:13px;color:#111827;font-weight:600">Conference Certificate</td><td style="padding:10px 12px;font-size:12px;color:#6b7280">April 7\u20138, 2026</td><td style="padding:10px 12px;font-size:13px;text-align:right"><strong>100 EGP</strong></td></tr>` : "";
          const certRowAr = reg.wantsCertificate ? `<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 12px;font-size:13px;color:#111827;font-weight:600;text-align:right">\u0634\u0647\u0627\u062f\u0629 \u0627\u0644\u0645\u0624\u062a\u0645\u0631</td><td style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:right">\u0667\u2013\u0668 \u0623\u0628\u0631\u064a\u0644 2026</td><td style="padding:10px 12px;font-size:13px;text-align:left"><strong>100 \u062c.\u0645</strong></td></tr>` : "";

          const htmlBody = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px"><tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.10)">
  <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:28px 36px">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">SCI 2026 \u2014 Registration Confirmed</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:13px">Science at the Core of Innovation</p>
    <p style="margin:4px 0 0;color:rgba(255,255,255,.70);font-size:12px">April 7\u20138, 2026 \u00b7 Faculty of Science, Cairo University</p>
  </td></tr>
  <tr><td style="padding:32px 36px">
    <p style="margin:0 0 12px;color:#1e3a5f;font-size:16px;font-weight:600">Dear ${firstName},</p>
    <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7">We are delighted to confirm your registration for the <strong>1st Annual Conference of the Faculty of Science, Cairo University \u2014 SCI 2026</strong>. Below is a summary of your selected workshops and fees.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:0 0 24px">
      <thead><tr style="background:#f8fafc">
        <th style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:left;font-weight:600;text-transform:uppercase">Workshop</th>
        <th style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:left;font-weight:600;text-transform:uppercase">Date</th>
        <th style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:right;font-weight:600;text-transform:uppercase">Fee</th>
      </tr></thead>
      <tbody>${wsRowsEn}${certRowEn}</tbody>
      <tfoot><tr style="background:#f8fafc">
        <td colspan="2" style="padding:12px;font-size:14px;font-weight:700;color:#1e3a5f">Total Amount Due</td>
        <td style="padding:12px;font-size:16px;font-weight:700;color:#1e3a5f;text-align:right">${grandTotal} EGP</td>
      </tr></tfoot>
    </table>
    ${paymentBlock}
    <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6">For any questions, reply to this email or contact us at <a href="mailto:sci.conf.2026@gmail.com" style="color:#2563eb">sci.conf.2026@gmail.com</a>.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
    <div dir="rtl" style="text-align:right">
      <p style="margin:0 0 12px;color:#1e3a5f;font-size:16px;font-weight:600">\u0639\u0632\u064a\u0632\u064a/\u0639\u0632\u064a\u0632\u062a\u064a ${firstNameAr}\u060c</p>
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.8">\u064a\u0633\u0639\u062f\u0646\u0627 \u062a\u0623\u0643\u064a\u062f \u062a\u0633\u062c\u064a\u0644\u0643 \u0641\u064a <strong>\u0627\u0644\u0645\u0624\u062a\u0645\u0631 \u0627\u0644\u0633\u0646\u0648\u064a \u0627\u0644\u0623\u0648\u0644 \u0644\u0643\u0644\u064a\u0629 \u0627\u0644\u0639\u0644\u0648\u0645\u060c \u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0642\u0627\u0647\u0631\u0629 \u2014 SCI 2026</strong>. \u0641\u064a\u0645\u0627 \u064a\u0644\u064a \u0645\u0644\u062e\u0635 \u0648\u0631\u0634 \u0627\u0644\u0639\u0645\u0644 \u0648\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0645\u062e\u062a\u0627\u0631\u0629.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:0 0 24px">
        <thead><tr style="background:#f8fafc">
          <th style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:right;font-weight:600">\u0648\u0631\u0634\u0629 \u0627\u0644\u0639\u0645\u0644</th>
          <th style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:right;font-weight:600">\u0627\u0644\u062a\u0627\u0631\u064a\u062e</th>
          <th style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:left;font-weight:600">\u0627\u0644\u0631\u0633\u0648\u0645</th>
        </tr></thead>
        <tbody>${wsRowsAr}${certRowAr}</tbody>
        <tfoot><tr style="background:#f8fafc">
          <td colspan="2" style="padding:12px;font-size:14px;font-weight:700;color:#1e3a5f;text-align:right">\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u0633\u062a\u062d\u0642</td>
          <td style="padding:12px;font-size:16px;font-weight:700;color:#1e3a5f;text-align:left">${grandTotal} \u062c.\u0645</td>
        </tr></tfoot>
      </table>
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.6">\u0644\u0623\u064a \u0627\u0633\u062a\u0641\u0633\u0627\u0631\u060c \u064a\u064f\u0631\u062c\u0649 \u0627\u0644\u0631\u062f \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064a\u062f \u0623\u0648 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0639\u0644\u0649 <a href="mailto:sci.conf.2026@gmail.com" style="color:#2563eb">sci.conf.2026@gmail.com</a>.</p>
    </div>
  </td></tr>
  <tr><td style="background:#f1f5f9;padding:20px 36px;border-top:1px solid #e2e8f0">
    <p style="margin:0;color:#64748b;font-size:12px;text-align:center">SCI 2026 \u00b7 Faculty of Science, Cairo University \u00b7 April 7\u20138, 2026</p>
    <p style="margin:4px 0 0;color:#64748b;font-size:11px;text-align:center">You are receiving this email because you registered for SCI 2026.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

          try {
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: "SCI 2026 <sci2026@sciconf26.website>",
                to: [reg.email],
                reply_to: "sci.conf.2026@gmail.com",
                subject: `[SCI 2026] Registration Confirmed \u2014 ${reg.nameEn}`,
                html: htmlBody,
              }),
            });
            const data = await res.json() as { id?: string; statusCode?: number; message?: string };
            if (data.id) {
              sent++;
            } else {
              console.error(`[Acceptance Email] Failed for ${reg.email}:`, data);
              failed++;
            }
          } catch (err) {
            console.error(`[Acceptance Email] Error for ${reg.email}:`, err);
            failed++;
          }
          await new Promise(resolve => setTimeout(resolve, 600));
        }

        await db.insert(auditLogs).values({
          adminEmail: "system",
          action: "acceptance_emails_sent",
          resourceType: "registration",
          resourceId: 0,
          details: `Acceptance emails sent to ${sent} registrants (${failed} failed) \u2014 filter: ${input.filter}`,
        });

        return {
          success: true,
          sent,
          failed,
          total: uniqueRegs.length,
          message: `Acceptance emails sent to ${sent} of ${uniqueRegs.length} registrants${failed > 0 ? ` (${failed} failed)` : ""}`,
        };
      }),
  }),
});
export type AppRouter = typeof appRouter;