# Both Workshops: Format, Fee and Venue Correction

**Goal:** Apply the organizer's confirmed format, fee and venue to both current SCI 2027 workshops, preserving all other details.

**Architecture:** Modify only workshop fields in `client/src/data/sci2027Content.ts`; the page already renders these fields from central data. Keep the exact supplied spelling `Abn Sina Hall, Faculty of Science, Cairo University`. The optional NARSS duration field must also say `Half-day`, matching the now-confirmed format rather than contradicting it with To be announced.

**Tech Stack:** React/TypeScript, Vitest, Puppeteer.

## Authoritative update

On 18 November 2026, the organizer explicitly confirmed that BOTH NARSS and Patents use `Half-day hands-on workshop`, cost `EGP 200` each and take place at `Abn Sina Hall, Faculty of Science, Cairo University`. No dates, times, number of hours or NARSS seat count were supplied. Preserve dateAndTime To be announced, NARSS capacity null, Patents capacity 30, both registration links/statuses, titles/providers/logos and NARSS participation certificate. Do not replace the main conference venue or change archive venue spelling, Google Form settings, payment instructions, backend/admin or DNS.

## Test-first steps

Update `client/src/data/sci2027Workshops.test.ts` with the exact NARSS format/fee/duration/venue, Patents venue and a shared two-record regression test. Run the focused test and observe expected RED before production edits. Then apply only those central-field changes and run `pnpm test && pnpm check && pnpm build && git diff --check`. Preserve the existing responsive card and fee styling. If narrowed literal types trigger a TypeScript error in a preserved future-fee fallback, make only the minimal type-safe change after reproducing it.

## Verification and checkpoint

Check `/workshops` at 1920px and 375px: identical half-day format, EGP 200 and exact hall in both cards; NARSS duration Half-day; dates/time unannounced; capacity and participation certificate unchanged; same registration destinations/safe new-tab attributes; full logos; no overflow or runtime errors. Review screenshots and compare all other central data and tracked files to the saved baseline. Update only the two new active checklist tasks and record results here, then save a managed WebDev checkpoint. No separate publication or historical TODO work requested.

## Verification evidence — 18 November 2026

Observed the expected RED before implementation: three corrected-fact failures and nine passing focused tests. The now-identical EGP 200 literals caused TS2367 in the preserved future-unannounced-fee comparison. Reproduced it with `pnpm check`; updated the regression expectation and observed one expected RED with 11 passing tests before changing only that comparison to `String(workshop.fee) === "To be announced"`. Current and future string-fee display behavior is unchanged.

`pnpm test && pnpm check && pnpm build && git diff --check` exited 0: 165 tests across eight files, including 12 Workshops tests, passed. TypeScript and production build passed; existing pnpm configuration and bundle-size warnings remain non-blocking and outside this task.

`/tmp/sci2027-workshop-facts-qa.mjs` passed all four workshop/viewport pairs at 1920px and 375px. Both cards display exactly Half-day hands-on workshop, EGP 200 and Abn Sina Hall, Faculty of Science, Cairo University. NARSS duration is Half-day. Both dates/time remain To be announced; Patents capacity remains 30 and NARSS remains unannounced; NARSS participation certificate, intact logos and safe registration anchors/mapping remain unchanged. No internal/horizontal overflow or runtime errors. Reviewed desktop NARSS and mobile Patents/NARSS screenshots; hall names wrap cleanly.

Exact comparisons confirm central content differs only in the five approved workshop fields and UI differs only in the single type-safe guard. Hashes confirm 767 other tracked files remain identical to the prior checkpoint, including forms, backend/admin, archive, routes and main conference venue. Independent read-only review found no blocking issue. Only the two current checklist tasks are marked complete. Save the verified state through WebDev without a separate publication action or historical TODO work.
