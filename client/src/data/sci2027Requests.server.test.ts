import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTableName } from "drizzle-orm";
import { MySqlDialect } from "drizzle-orm/mysql-core";
import { generateToken } from "../../../server/auth.js";

// Only the database connection is replaced. Validation, persistence, token
// verification, admin lookup/middleware, role permissions and CSV run for real.
const memory = vi.hoisted(() => ({
  tables: new Map<string, Record<string, any>[]>(),
  fail: undefined as string | undefined,
  insertAttempts: 0,
}));
vi.mock("../../../server/db.js", () => {
  const dialect = new MySqlDialect();
  const tableRows = (table: any) => {
    const name = getTableName(table);
    if (!memory.tables.has(name)) memory.tables.set(name, []);
    return memory.tables.get(name)!;
  };
  const matches = (condition: any, row: Record<string, any>) => {
    const query = dialect.sqlToQuery(condition);
    const column = query.sql.match(/`([^`]+)`\s*=/)?.[1];
    const key = column?.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    return key ? row[key] === query.params[0] : false;
  };
  return { db: {
    select: () => ({ from: (table: any) => {
      let condition: any;
      let newestFirst = false;
      let maximum = Infinity;
      const builder: any = {
        where: (value: any) => { condition = value; return builder; },
        orderBy: () => { newestFirst = true; return builder; },
        limit: (value: number) => { maximum = value; return builder; },
        then: (resolve: any, reject: any) => {
          if (memory.fail === "select") return Promise.reject(new Error("DB failed: secret@example.com")).then(resolve, reject);
          let rows = tableRows(table).filter(row => !condition || matches(condition, row));
          if (newestFirst) rows = [...rows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id);
          return Promise.resolve(rows.slice(0, maximum).map(row => ({ ...row }))).then(resolve, reject);
        },
      };
      return builder;
    } }),
    insert: (table: any) => ({ values: async (values: Record<string, any>) => {
      memory.insertAttempts++;
      if (memory.fail === "insert") throw new Error("DB failed: secret@example.com");
      const rows = tableRows(table);
      if (rows.some(row => row.submissionKey === values.submissionKey)) {
        // Drizzle wraps driver errors in a cause; exercise that production shape.
        throw new Error("duplicate", { cause: Object.assign(new Error("duplicate"), { code: "ER_DUP_ENTRY", errno: 1062 }) });
      }
      const id = rows.length + 1;
      rows.push({ id, year: 2027, status: "pending", adminNotes: null, website: null, notes: null, createdAt: new Date(), updatedAt: new Date(), ...values });
      return [{ insertId: id, affectedRows: 1 }];
    } }),
    update: (table: any) => ({ set: (values: any) => ({ where: async (condition: any) => {
      if (memory.fail === "update") throw new Error("DB failed: secret@example.com");
      const rows = tableRows(table).filter(row => matches(condition, row));
      for (const row of rows) Object.assign(row, values);
      return [{ affectedRows: rows.length }];
    } }) }),
  } };
});

// Missing modules yield explicit failed contract assertions on the initial RED
// run, rather than aborting collection with unresolved static imports.
const sharedUrl = new URL("../../../shared/sci2027Requests.ts", import.meta.url);
const routerUrl = new URL("../../../server/sci2027-requests-router.ts", import.meta.url);
const shared: typeof import("../../../shared/sci2027Requests.js") = existsSync(fileURLToPath(sharedUrl))
  ? await import(sharedUrl.href) : {} as any;
const routerModule: typeof import("../../../server/sci2027-requests-router.js") = existsSync(fileURLToPath(routerUrl))
  ? await import(routerUrl.href) : {} as any;
const appProcedures = await import("../../../server/routers.js");

const media = () => ({
  submissionKey: randomUUID(), fullName: "Press Contact", email: "press@example.com", phone: "+20 123 456 7890",
  organizationName: "Science News", jobTitle: "Reporter", coverageType: "Written coverage" as const,
  website: "https://example.com", notes: "Please contact us", consent: true as const, contactWebsite: "",
});
const sponsor = () => ({
  submissionKey: randomUUID(), companyName: "Science Partner", contactPerson: "Partner Contact", jobTitle: "Director",
  email: "partner@example.com", phone: "+20 123 456 7890", activitySector: "Biotechnology",
  cooperationType: "Discuss options" as const, website: "https://example.com", notes: "Interested in partnership",
  consent: true as const, contactWebsite: "",
});
function schema(kind: "media" | "sponsor") {
  const value = kind === "media" ? shared.mediaRequestSchema : shared.sponsorRequestSchema;
  expect(value, `${kind} validation schema must exist`).toBeDefined();
  return value;
}
let ipSequence = 0;
function caller(role?: string, options: { token?: string; cookies?: boolean; address?: string; headers?: Record<string, string> } = {}) {
  expect(routerModule.createSci2027RequestsRouter, "lazy router factory must exist").toBeTypeOf("function");
  const openId = role ?? "non-admin";
  const token = options.token ?? generateToken({ openId, name: "Test Admin", email: "admin@example.com" });
  return routerModule.createSci2027RequestsRouter(appProcedures).createCaller({
    req: { cookies: options.cookies === false ? {} : { auth_token: token }, socket: { remoteAddress: options.address ?? `192.0.2.${++ipSequence}` }, headers: options.headers ?? {} },
  });
}
const updateInput = { kind: "media" as const, id: 1, status: "contacted" as const, adminNotes: "Follow up" };
beforeEach(() => {
  memory.tables.clear();
  memory.insertAttempts = 0;
  memory.fail = undefined;
  memory.tables.set("admins", ["viewer", "moderator", "super_admin", "unknown"].map((role, i) => ({ id: i + 1, openId: role, role, name: "Admin", email: "admin@example.com" })));
});

describe("SCI 2027 shared request validation", () => {
  it("exports the exact status, coverage and cooperation contracts", () => {
    expect(shared.requestStatuses).toEqual(["pending", "in_review", "contacted", "closed"]);
    expect(shared.coverageTypes).toEqual(["Written coverage", "Photography", "Video coverage", "Live broadcast", "Other"]);
    expect(shared.cooperationTypes).toEqual(["Platinum", "Gold", "Silver", "Bronze", "Special sponsorship", "In-kind contribution", "Partnership", "Discuss options"]);
  });
  for (const kind of ["media", "sponsor"] as const) {
    const valid = kind === "media" ? media : sponsor;
    it(`${kind}: trims contact fields and accepts valid requests`, () => {
      expect(schema(kind).parse({ ...valid(), email: "  person@example.com  ", phone: "  +20 123 456 7890  ", jobTitle: "  Editor  " })).toMatchObject({ email: "person@example.com", phone: "+20 123 456 7890", jobTitle: "Editor" });
    });
    it(`${kind}: requires explicit true consent`, () => {
      for (const consent of [false, undefined, "true", 1]) expect(schema(kind).safeParse({ ...valid(), consent }).success).toBe(false);
    });
    const names = kind === "media" ? ["fullName", "organizationName", "jobTitle"] : ["companyName", "contactPerson", "jobTitle", "activitySector"];
    for (const field of names) {
      it(`${kind}: rejects blank and excessive ${field}`, () => {
        for (const value of [undefined, "  ", "x".repeat(256)]) expect(schema(kind).safeParse({ ...valid(), [field]: value }).success).toBe(false);
      });
    }
    it(`${kind}: bounds email, phone, website and notes`, () => {
      for (const patch of [{ email: "invalid" }, { email: `${"x".repeat(255)}@example.com` }, { phone: "  " }, { phone: "x".repeat(51) }, { website: `https://example.com/${"x".repeat(2048)}` }, { notes: "x".repeat(5001) }]) {
        expect(schema(kind).safeParse({ ...valid(), ...patch }).success).toBe(false);
      }
    });
    it(`${kind}: allows optional empty website and notes`, () => {
      expect(schema(kind).safeParse({ ...valid(), website: undefined, notes: undefined, contactWebsite: undefined }).success).toBe(true);
      expect(schema(kind).safeParse({ ...valid(), website: "  ", notes: "  " }).success).toBe(true);
    });
    it(`${kind}: accepts only safe HTTP(S) websites`, () => {
      for (const website of ["http://example.com", "https://example.com/path?x=1", " HTTPS://example.com "]) expect(schema(kind).safeParse({ ...valid(), website }).success).toBe(true);
      for (const website of ["javascript:alert(1)", "data:text/html,test", "ftp://example.com", "//example.com", "example.com", "https://", "https://user:password@example.com", "https://exam\nple.com"]) expect(schema(kind).safeParse({ ...valid(), website }).success).toBe(false);
    });
    it(`${kind}: requires UUID key and an empty honeypot`, () => {
      for (const patch of [{ submissionKey: "bad-key" }, { submissionKey: undefined }, { contactWebsite: "spam" }, { contactWebsite: " " }]) expect(schema(kind).safeParse({ ...valid(), ...patch }).success).toBe(false);
    });
    it(`${kind}: strips public attempts to select administrative metadata`, () => {
      const parsed = schema(kind).parse({ ...valid(), status: "closed", year: 2026, reference: "attacker", adminNotes: "attacker" });
      expect(parsed).not.toHaveProperty("status");
      expect(parsed).not.toHaveProperty("year");
      expect(parsed).not.toHaveProperty("adminNotes");
      expect(parsed).not.toHaveProperty("reference");
    });
  }
  it("rejects legacy coverage and unsupported cooperation", () => {
    expect(schema("media").safeParse({ ...media(), coverageType: "written" }).success).toBe(false);
    expect(schema("sponsor").safeParse({ ...sponsor(), cooperationType: "Diamond" }).success).toBe(false);
  });
});

describe("SCI 2027 real public router and persistence", () => {
  it("registers both submission APIs and protected administration on the actual app router", async () => {
    const { appRouter } = await import("../../../server/routers.js");
    for (const endpoint of ["submitMedia", "submitSponsor", "list", "update", "exportCsv"]) {
      expect(appRouter._def.procedures, `SCI 2027 ${endpoint} must be reachable over HTTP`).toHaveProperty(`sci2027Requests.${endpoint}`);
    }
  });
  it("stores media in its isolated table with pending status and year 2027", async () => {
    const result = await caller().submitMedia({ ...media(), status: "closed", year: 2026, adminNotes: "attacker" } as any);
    expect(result).toEqual({ success: true, reference: expect.stringMatching(/^SCI2027-M-/) });
    const rows = memory.tables.get("sci2027_media_requests")!;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ reference: result.reference, status: "pending", year: 2027, consent: true, adminNotes: null });
    expect(rows[0].createdAt).toBeInstanceOf(Date);
    expect(rows[0]).not.toHaveProperty("contactWebsite");
    expect(memory.tables.has("media_registrations")).toBe(false);
  });
  it("stores sponsor in its isolated table without charges or legacy inserts", async () => {
    const result = await caller().submitSponsor(sponsor());
    expect(result).toEqual({ success: true, reference: expect.stringMatching(/^SCI2027-S-/) });
    expect(memory.tables.get("sci2027_sponsor_requests")?.[0]).toMatchObject({ status: "pending", year: 2027, consent: true });
    expect(memory.tables.has("sponsorships")).toBe(false);
  });
  for (const kind of ["media", "sponsor"] as const) {
    it(`${kind}: returns original reference on retry and does not alter original fields`, async () => {
      const api = caller();
      const input = kind === "media" ? media() : sponsor();
      const submit = (value: any) => kind === "media" ? api.submitMedia(value) : api.submitSponsor(value);
      const first = await submit(input);
      const retried = await submit({ ...input, email: "changed@example.com" });
      expect(retried).toEqual(first);
      const rows = memory.tables.get(`sci2027_${kind}_requests`)!;
      expect(rows).toHaveLength(1);
      expect(rows[0].email).toBe(input.email);
    });
    it(`${kind}: handles concurrent retries using the unique key`, async () => {
      const api = caller();
      const input = kind === "media" ? media() : sponsor();
      const submit = () => kind === "media" ? api.submitMedia(input as any) : api.submitSponsor(input as any);
      const results = await Promise.all(Array.from({ length: 4 }, submit));
      expect(new Set(results.map(result => result.reference)).size).toBe(1);
      expect(memory.tables.get(`sci2027_${kind}_requests`)).toHaveLength(1);
      expect(memory.insertAttempts).toBeGreaterThan(1);
    });
    it(`${kind}: sanitizes database failure and succeeds on retry after recovery`, async () => {
      const api = caller();
      const input = kind === "media" ? media() : sponsor();
      const submit = () => kind === "media" ? api.submitMedia(input as any) : api.submitSponsor(input as any);
      memory.fail = "insert";
      const error = await submit().catch(error => error);
      expect(error.code).toBe("INTERNAL_SERVER_ERROR");
      expect(error.message).not.toContain("secret@example.com");
      expect(error.cause?.message ?? "").not.toContain("secret@example.com");
      memory.fail = undefined;
      expect(await submit()).toMatchObject({ success: true });
      expect(memory.tables.get(`sci2027_${kind}_requests`)).toHaveLength(1);
    });
  }
  it("normalizes UUID case for idempotent retry", async () => {
    const api = caller();
    const input = media();
    expect(await api.submitMedia({ ...input, submissionKey: input.submissionKey.toUpperCase() })).toEqual(await api.submitMedia(input));
  });
  it("rejects invalid public submissions without persistence or PII in errors", async () => {
    const error = await caller().submitMedia({ ...media(), coverageType: "secret@example.com", consent: false, contactWebsite: "spam" } as any).catch(error => error);
    expect(error.code).toBe("BAD_REQUEST");
    expect(error.message).not.toContain("secret@example.com");
    expect(memory.insertAttempts).toBe(0);
  });
  it("rate limits the socket address, not spoofable forwarded headers", async () => {
    const address = "198.51.100.200";
    const outcomes = [];
    for (let i = 0; i < 35; i++) {
      outcomes.push(await caller(undefined, { address, headers: { "x-forwarded-for": `203.0.113.${i}`, "x-real-ip": `203.0.113.${i}` } }).submitMedia(media()).catch(error => ({ code: error.code })));
    }
    expect(outcomes.some(result => "code" in result && result.code === "TOO_MANY_REQUESTS")).toBe(true);
    expect(await caller(undefined, { address: "198.51.100.201" }).submitMedia(media())).toMatchObject({ success: true });
  });
});

describe("SCI 2027 real administrator authentication and role permissions", () => {
  for (const endpoint of ["list", "update", "exportCsv"] as const) {
    const invoke = (api: ReturnType<typeof caller>) => endpoint === "update" ? api.update(updateInput) : api[endpoint]({ kind: "media" });
    it(`${endpoint}: denies unauthenticated callers even with forged user context`, async () => {
      await expect(invoke(caller("super_admin", { cookies: false }))).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    });
    it(`${endpoint}: denies invalid auth tokens`, async () => {
      await expect(invoke(caller("super_admin", { token: "invalid" }))).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    });
    it(`${endpoint}: denies authenticated users without an admin row`, async () => {
      await expect(invoke(caller())).rejects.toMatchObject({ code: "FORBIDDEN" });
    });
    it(`${endpoint}: denies unrecognized roles`, async () => {
      await expect(invoke(caller("unknown"))).rejects.toMatchObject({ code: "FORBIDDEN" });
    });
  }
  it("viewer can list full typed rows newest first and export, but cannot update", async () => {
    const first = media();
    await caller().submitMedia(first);
    await caller().submitMedia({ ...media(), fullName: "Newer Contact" });
    const api = caller("viewer");
    const rows = await api.list({ kind: "media" });
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ kind: "media", id: 2, fullName: "Newer Contact", status: "pending", adminNotes: null, email: "press@example.com", coverageType: "Written coverage" });
    expect(rows[0].reference).toMatch(/^SCI2027-M-/);
    expect(rows[0].createdAt).toBeInstanceOf(Date);
    expect(await api.exportCsv({ kind: "media" })).toMatchObject({ csv: expect.any(String), filename: expect.stringMatching(/sci2027-media-requests.*\.csv$/) });
    await expect(api.update(updateInput)).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect((await api.list({ kind: "media" }))[1].status).toBe("pending");
  });
  for (const role of ["moderator", "super_admin"]) {
    it(`${role}: updates only the requested table's status and trimmed admin notes`, async () => {
      await caller().submitMedia(media());
      await caller().submitSponsor(sponsor());
      const api = caller(role);
      expect(await api.update({ ...updateInput, adminNotes: "  Called contact  " })).toEqual({ success: true });
      expect((await api.list({ kind: "media" }))[0]).toMatchObject({ status: "contacted", adminNotes: "Called contact" });
      expect((await api.list({ kind: "sponsor" }))[0]).toMatchObject({ status: "pending", adminNotes: null });
      expect(await api.update({ kind: "sponsor", id: 1, status: "in_review", adminNotes: "Reviewing partnership" })).toEqual({ success: true });
      expect((await api.list({ kind: "sponsor" }))[0]).toMatchObject({ kind: "sponsor", companyName: "Science Partner", status: "in_review", adminNotes: "Reviewing partnership" });
    });
  }
  it("rejects invalid kind, status, ids and excessively long admin notes", async () => {
    const api = caller("moderator");
    for (const patch of [{ kind: "legacy" }, { status: "approved" }, { id: 0 }, { id: 1.5 }, { adminNotes: "x".repeat(5001) }]) await expect(api.update({ ...updateInput, ...patch } as any)).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(api.list({ kind: "legacy" } as any)).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
  it("reports missing records rather than silently accepting an update", async () => {
    await expect(caller("moderator").update(updateInput)).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
  it("keeps admin database error details private", async () => {
    await caller().submitMedia(media());
    memory.fail = "update";
    const error = await caller("moderator").update(updateInput).catch(error => error);
    expect(error.code).toBe("INTERNAL_SERVER_ERROR");
    expect(error.message).not.toContain("secret@example.com");
  });
});

describe("SCI 2027 CSV encoding and spreadsheet safety", () => {
  it("includes a BOM, all fields, quoted commas/quotes/newlines and full export", async () => {
    await caller().submitMedia({ ...media(), organizationName: 'Science, "News"', notes: "First line\nSecond line" });
    const result = await caller("viewer").exportCsv({ kind: "media" });
    expect(result.csv.startsWith("\uFEFF")).toBe(true);
    expect(result.csv).toContain('"Science, ""News"""');
    expect(result.csv).toContain('"First line\nSecond line"');
    expect(result.csv).toContain("SCI2027-M-");
    for (const label of ["Reference", "Status", "Admin Notes", "Created At", "Full Name", "Email", "Phone", "Organization Name", "Job Title", "Coverage Type", "Website", "Notes", "Consent"]) expect(result.csv).toContain(label);
    expect(result.csv).not.toContain("Submission Key");
    expect(result.csv).not.toContain("contactWebsite");
  });
  for (const value of ["=SUM(1,1)", "+SUM(1,1)", "-SUM(1,1)", "@SUM(1,1)", "\t=SUM(1,1)", "\r=SUM(1,1)", "\n=SUM(1,1)", " \t=SUM(1,1)", "\u0000=SUM(1,1)", "\uFEFF=SUM(1,1)"]) {
    it(`neutralizes formula/control-leading cells ${JSON.stringify(value)}`, async () => {
      await caller().submitMedia(media());
      await caller("moderator").update({ ...updateInput, adminNotes: value });
      // Exercise historical control-leading data that predates trimming.
      memory.tables.get("sci2027_media_requests")![0].adminNotes = value;
      const { csv } = await caller("viewer").exportCsv({ kind: "media" });
      expect(csv).toContain(`"'${value.replaceAll('"', '""')}"`);
    });
  }
  it("exports sponsor-specific fields and stable headers for empty results", async () => {
    const api = caller("viewer");
    expect((await api.exportCsv({ kind: "sponsor" })).csv).toContain("Company Name");
    await caller().submitSponsor(sponsor());
    const { csv } = await api.exportCsv({ kind: "sponsor" });
    for (const value of ["SCI2027-S-", "Science Partner", "Contact Person", "Activity Sector", "Cooperation Type", "Discuss options"]) expect(csv).toContain(value);
    expect(csv).not.toContain("Coverage Type");
  });
});
