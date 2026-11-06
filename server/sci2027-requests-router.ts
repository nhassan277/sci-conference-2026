import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { router as appRouterFactory, publicProcedure as appPublicProcedure, adminProcedure as appAdminProcedure } from "./routers.js";
import { getRolePermissions } from "./admin-management.js";
import { mediaRequestSchema, sponsorRequestSchema, requestStatuses, type RequestKind } from "../shared/sci2027Requests.js";
import { submitMediaRequest, submitSponsorRequest, listRequests, updateRequest, type Sci2027RequestRow } from "./sci2027-requests-db.js";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 30;
const MAX_BUCKETS = 10_000;
const buckets = new Map<string, { count: number; expires: number }>();

function enforceRateLimit(req: { socket?: { remoteAddress?: string } } | undefined) {
  const now = Date.now();
  // Never use req.ip, x-forwarded-for or x-real-ip. With an internal reverse
  // proxy this is intentionally a shared peer quota, not an authenticated
  // end-user identity. Configure trusted ingress limiting before scaling; this
  // basic per-process limiter cannot coordinate across application instances.
  const address = req?.socket?.remoteAddress?.replace(/^::ffff:/, "").slice(0, 255) || "unknown-peer";
  const current = buckets.get(address);
  if (current && current.expires > now) {
    if (current.count >= MAX_ATTEMPTS) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Please wait before trying again" });
    current.count++;
    return;
  }
  // Bound memory without evicting live buckets (which would bypass limits).
  for (const [key, bucket] of buckets) if (bucket.expires <= now) buckets.delete(key);
  if (buckets.size >= MAX_BUCKETS) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Please wait before trying again" });
  buckets.set(address, { count: 1, expires: now + WINDOW_MS });
}

function persistenceFailure(): never {
  // No raw error/cause or logging: driver errors may contain submitted PII.
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to process the request. Please try again" });
}

function csvCell(value: unknown): string {
  const text = value instanceof Date ? value.toISOString() : value == null ? "" : String(value);
  // Prefix the whole cell when it starts with control characters, or when
  // leading whitespace/control/BOM disguises a spreadsheet formula. Quoting
  // alone does not prevent Excel/LibreOffice from evaluating formulas.
  const unsafe = /^[\u0000-\u001f\u007f-\u009f]/.test(text) || /^[\s\u0000-\u001f\u007f-\u009f\uFEFF]*[=+\-@]/.test(text);
  return `"${(unsafe ? `'${text}` : text).replace(/"/g, '""')}"`;
}

function requestsCsv(kind: RequestKind, rows: Sci2027RequestRow[]): string {
  const base: [keyof Sci2027RequestRow, string][] = [["id", "ID"], ["reference", "Reference"], ["year", "Year"], ["status", "Status"], ["adminNotes", "Admin Notes"], ["createdAt", "Created At"], ["updatedAt", "Updated At"]];
  const fields: [string, string][] = kind === "media"
    ? [["fullName", "Full Name"], ["organizationName", "Organization Name"], ["jobTitle", "Job Title"], ["email", "Email"], ["phone", "Phone"], ["coverageType", "Coverage Type"]]
    : [["companyName", "Company Name"], ["contactPerson", "Contact Person"], ["jobTitle", "Job Title"], ["email", "Email"], ["phone", "Phone"], ["activitySector", "Activity Sector"], ["cooperationType", "Cooperation Type"]];
  const columns = [...base, ...fields, ["website", "Website"], ["notes", "Notes"], ["consent", "Consent"]];
  return "\uFEFF" + [
    columns.map(([, label]) => csvCell(label)).join(","),
    ...rows.map(row => columns.map(([key]) => csvCell((row as unknown as Record<string, unknown>)[key])).join(",")),
  ].join("\r\n") + "\r\n";
}

// Inject the application's authenticated procedures to avoid a runtime import
// cycle and to keep the same authorization contract as all existing admin APIs.
export function createSci2027RequestsRouter({ router, publicProcedure, adminProcedure }: {
  router: typeof appRouterFactory;
  publicProcedure: typeof appPublicProcedure;
  adminProcedure: typeof appAdminProcedure;
}) {
  const guardedPublicProcedure = publicProcedure.use(async ({ ctx, next }) => {
    enforceRateLimit(ctx.req);
    const result = await next();
    if (!result.ok) {
      // Zod's enum errors and driver causes can include input values. Preserve
      // typed shared client validation but keep all public API errors generic.
      if (result.error.code === "BAD_REQUEST") throw new TRPCError({ code: "BAD_REQUEST", message: "Please check the request fields and try again" });
      persistenceFailure();
    }
    return result;
  });
  const kindSchema = z.object({ kind: z.enum(["media", "sponsor"]) });
  // Any recognized administrator can read; unknown roles fail closed.
  const readProcedure = adminProcedure.use(({ ctx, next }) => {
    if (!getRolePermissions(ctx.admin.role).canExport) throw new TRPCError({ code: "FORBIDDEN", message: "Request access is not permitted" });
    return next();
  });
  return router({
    submitMedia: guardedPublicProcedure.input(mediaRequestSchema).mutation(async ({ input }) => {
      try {
        return { success: true as const, reference: await submitMediaRequest(input) };
      } catch {
        persistenceFailure();
      }
    }),
    submitSponsor: guardedPublicProcedure.input(sponsorRequestSchema).mutation(async ({ input }) => {
      try {
        return { success: true as const, reference: await submitSponsorRequest(input) };
      } catch {
        persistenceFailure();
      }
    }),
    list: readProcedure.input(kindSchema).query(async ({ input }) => {
      try { return await listRequests(input.kind); } catch { persistenceFailure(); }
    }),
    update: readProcedure.input(z.object({
      kind: z.enum(["media", "sponsor"]),
      id: z.number().int().positive().max(2_147_483_647),
      status: z.enum(requestStatuses),
      adminNotes: z.string().trim().max(5000).optional(),
    })).mutation(async ({ input, ctx }) => {
      if (!getRolePermissions(ctx.admin.role).canUpdate) throw new TRPCError({ code: "FORBIDDEN", message: "Request updates are not permitted" });
      let updated: boolean;
      try { updated = await updateRequest(input); } catch { persistenceFailure(); }
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Request not found" });
      return { success: true as const };
    }),
    exportCsv: readProcedure.input(kindSchema).query(async ({ input }) => {
      try {
        const rows = await listRequests(input.kind);
        return { csv: requestsCsv(input.kind, rows), filename: `sci2027-${input.kind}-requests-${new Date().toISOString().slice(0, 10)}.csv` };
      } catch { persistenceFailure(); }
    }),
  });
}
