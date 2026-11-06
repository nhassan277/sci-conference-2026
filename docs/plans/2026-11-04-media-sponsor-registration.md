# SCI 2027 Media and Sponsor Registration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Provide two English-only public request forms and authenticated administration/CSV export, keeping SCI 2026 data and the three existing official registration forms unchanged.

**Architecture:** Separate `sci2027_media_requests` and `sci2027_sponsor_requests` tables with bounded validated fields, unique client submission keys for safe retry, pending status and server timestamps. A dedicated tRPC subrouter uses the existing authenticated admin middleware, read/export permissions and canUpdate checks. New public pages reuse the SCI 2027 shared header/footer and navy/gold editorial identity. A new tab integrates into the existing Admin dashboard (no new parallel admin shell).

**Tech Stack:** React, TypeScript, Wouter, Tailwind/shadcn, tRPC, Zod, Drizzle/MySQL, Vitest, Puppeteer.

## Confirmed contract

- Routes `/media-registration-2027` and `/sponsor-registration-2027`. Retain legacy `/media-registration` and old APIs.
- `shared/sci2027Requests.ts`: schemas, input types, status list and current-tier options.
- Media fields: fullName, email, phone, organizationName, jobTitle, coverageType, website (optional), notes (optional).
- Sponsor fields: companyName, contactPerson, jobTitle, email, phone, activitySector, cooperationType, website (optional), notes (optional).
- Both: submissionKey UUID, consent true, website honeypot field `contactWebsite` empty. Required contact fields trimmed/bounded; URL optional accepts only http/https.
- Sponsor cooperation values: Platinum, Gold, Silver, Bronze, Special sponsorship, In-kind contribution, Partnership, Discuss options. No charges/price commitments.
- Common return shape `{success:true, reference:string}`. A repeated submission key returns same reference without a second insert. No PII is returned publicly.
- API `sci2027Requests.submitMedia`, `submitSponsor`, `list({kind:'media'|'sponsor'})`, `update({kind,id,status,adminNotes})`, `exportCsv({kind})`.
- list returns complete typed rows newest first. Status values `pending`, `in_review`, `contacted`, `closed`; submission cannot select its status or year.
- CSV returns `{csv:string,filename:string}`, UTF-8 BOM, quoting/newlines and spreadsheet-formula protection.
- Public success message means request received and team will follow up; not approval/accreditation/sponsorship confirmation. Consent only to process request and contact; no marketing opt-in.

## Task 1: Backend and persistence (test-first)
Files: `shared/sci2027Requests.ts`, `server/sci2027-requests-router.ts`, `server/sci2027-requests-db.ts`, `drizzle/schema.ts`, new migrations, `client/src/data/sci2027Requests.server.test.ts`.
1. Add failing tests for validation, required consent, safe URLs, honeypot, pending status, auth denial, role permissions, database failure, retry idempotence and safe CSV.
2. Run `pnpm exec vitest run client/src/data/sci2027Requests.server.test.ts`; verify RED.
3. Implement isolated tables/helpers/router. Preserve all old schema definitions and APIs.
4. Generate migration with `pnpm exec drizzle-kit generate`; inspect SQL; apply only new-table DDL through managed SQL tool (never test data).
5. Run focused tests; verify GREEN and database DDL.

## Task 2: Public forms (test-first)
Files: new registration form component/pages and `client/src/data/sci2027RequestForms.test.ts`.
1. Add failing route/component assertions then verify RED.
2. Build asymmetric explanatory sidebar/form, clear labels, required fields, optional URLs/notes, consent, validation, disabled pending submit, inline recoverable error, persistent success/reference, stable retry key and English-only notices.
3. Use tRPC mutations only. No upload or email automation. Reuse existing assets rather than introduce imagery.
4. Verify valid/invalid and retry flows in browser at desktop and 375px.

## Task 3: Admin integration (test-first)
Files: `client/src/pages/admin/Sci2027Requests.tsx`, `client/src/pages/Admin.tsx`, admin regression tests.
1. Add failing tests asserting two request types, separate SCI 2027 tab, empty/loading/error handling, detail/status/notes and full CSV export.
2. Add component into existing dashboard; preserve all legacy tabs and data. Respect viewer role restrictions for update.
3. Verify access denial server-side, actual persisted read/update/export, and responsive layout. No deletion feature.

## Task 4: Navigation and deployment verification
Files: `client/src/App.tsx`, `client/src/pages/Sci2027Home.tsx`, `client/src/pages/Sci2027Sponsorship.tsx`, `todo.md`.
1. Add failing content test for two dedicated routes and entry-point links alongside official forms/in sponsorship page; protect old routes/forms.
2. Register new pages; link Media Registration next to registration options and Sponsor & Partner Registration in sponsorship hero and contact section without removing email prospectus action.
3. `pnpm test && pnpm check && pnpm build && git diff --check`.
4. Browser screenshots desktop/mobile, actual submission/read/update/export test with clearly marked temporary test records, cleanup only exact temporary rows; no email side effects. Preserve old table counts.
5. Mark current tasks complete only after evidence; save managed WebDev checkpoint.

## Safety and rollback
No change to legacy records, APIs, pricing/payment, publications, dates, brochures or media. Additive SQL only. Do not modify scheduled services or trigger bulk emails during QA. Restore checkpoint for UI rollback; leave additive empty tables rather than risk existing data. QA evidence stored outside public assets. No secrets/auth tokens committed or shared.

## Completion evidence — 6 November 2026

The new subrouter is registered on the real app router. Its factory receives the existing router/public/admin procedures by dependency injection; it has no runtime import cycle. A regression test exercises the actual app router registration in addition to the validation, persistence, role and CSV tests.

The reviewed additive migration `0030_eminent_stranger.sql` was applied through the managed SQL tool to create only `sci2027_media_requests` and `sci2027_sponsor_requests`. Existing tables were not changed. Generated Drizzle schema/snapshot/journal are included. The DDL has already been applied to this environment; do not blindly rerun historical migrations or mark old migrations as applied without auditing the database's migration state.

Real HTTP/browser verification successfully submitted one synthetic media request and one synthetic sponsor request. It verified server-generated references, year 2027, pending status, consent and server timestamps. A deliberately lost media response was retried with the same UUID and returned the original reference with exactly one stored row. The real persistence helper updated and read back status/internal notes on the exact synthetic media row. All temporary submissions were then deleted using their exact UUIDs plus the reserved QA email; legacy media and sponsorship counts stayed at 4 and 2 respectively. No email was sent and no admin identity or permission was created or changed.

Real unauthenticated HTTP calls to list/update/export return UNAUTHORIZED. Runtime middleware/unit tests exercise viewer, moderator and super-admin permissions, unknown roles, invalid tokens, failure recovery and safe full CSV generation. Admin UI screenshots and save/export interactions use explicit local network fixtures, not a live administrator login: 1440px editable and 375px read-only detail dialogs, both request lists, correct consent/year, and Blob CSV output passed. Public forms were checked at both widths with no horizontal overflow. New table cells explicitly allow wrapping long references/contact/organization text.

Public entry points: Media Registration beside the three unchanged official Google Forms; Sponsor & Partner Registration in the sponsorship page hero/contact area. Administration: existing `/admin` → SCI 2027 Requests → Media requests / Sponsor & partner requests. Export all CSV always includes every record of the selected type, independent of current search/status filters. Request receipt is not approval/accreditation or a sponsorship/payment commitment. Current archive, fees/payment instructions, brochure, conference dates and existing workflows are unchanged.

Local QA scripts and screenshots are kept outside public assets. Final release verification uses `pnpm test`, `pnpm check`, `pnpm build`, `git diff --check`, responsive screenshots, API validation and HTTP readiness, followed by a managed WebDev checkpoint. Saving a checkpoint alone is not a claim that the public domain has deployed it.
