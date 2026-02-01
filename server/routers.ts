import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import superjson from "superjson";
import { db } from "./db.js";
import { registrations, sponsorships, sessions, supportTickets, admins, auditLogs, reminderSubscriptions, galleryPhotos, newsletterSubscriptions, googleSheetsSyncs, mediaRegistrations, committees, keynoteSpeakers } from "../drizzle/schema.js";
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
        })
      )
      .mutation(async ({ input }) => {
        const [result] = await db.insert(registrations).values(input);
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
          resourceId: ctx.admin.id.toString(),
          details: `Updated digest preferences: ${input.frequency}, enabled: ${input.enabled}`,
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
            resourceId: input.frequency,
            details: `Manually triggered ${input.frequency} digest`,
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
          resourceId: survey.insertId.toString(),
          details: `Created survey: ${input.title}`,
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
          resourceId: input.id.toString(),
          details: `Distributed survey: ${result.sent} sent, ${result.failed} failed, ${result.alreadyResponded} already responded`,
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
          answers: z.record(z.any()),
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
});
export type AppRouter = typeof appRouter;
