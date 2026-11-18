# Workshop Registration Links Implementation Plan

**Goal:** Add the user-confirmed Google Form registration link to each existing SCI 2027 workshop card without changing other details.

**Architecture:** Change only the two central registration objects and render a safe external button when a registration URL exists. Keep the Coming soon fallback for future records with no URL. Preserve all workshop facts, logos, fees, programme dates, existing conference forms, routes, backend, admin and archive.

**Tech Stack:** React/TypeScript, Tailwind, Vitest, Puppeteer.

## Confirmed mapping and scope

The organizer explicitly confirmed on 18 November 2026 that `https://forms.gle/7fhDR3QCDLqEpVi59` belongs to NARSS (`remote-sensing`) and `https://forms.gle/FQRgvzyVvRjpdsiLA` belongs to Patents (`patents`). Both links were fetched and currently redirect to Google sign-in. The form contents, submission acceptance and settings are therefore not independently verified; do not submit any form, alter permissions, or infer additional facts from it. Use neutral status `Registration available`, not a claim about a confirmed registration deadline.

## Task 1 — Test first

Modify `client/src/data/sci2027Workshops.test.ts`: require exact registration status and mapping, safe conditional external anchors with target=_blank and rel=noopener noreferrer, workshop-specific accessible names and the agreed visible label `Register for this workshop`. Replace the obsolete no-link assertion while retaining no internal form, invented date, fee or cropped-logo checks. Run `pnpm exec vitest run client/src/data/sci2027Workshops.test.ts` and observe expected RED before production edits.

## Task 2 — Minimal implementation

In `client/src/data/sci2027Content.ts`, replace each workshop registration object only with `{ status: "Registration available", url: "<confirmed URL>" }`. In `client/src/pages/Sci2027Workshops.tsx`, replace the placeholder paragraph with a conditional external anchor plus the factual note that it opens in a new tab and Google sign-in may be required; retain the original paragraph for records without URLs. Keep the existing navy/gold visual design and visible keyboard focus.

## Task 3 — Verification and checkpoint

Run focused and full tests, `pnpm check`, `pnpm build`, `git diff --check`. Browser-check 1920px desktop and 375px mobile: one link per card, exact mapping, safe new-tab behavior, English copy, keyboard focus, no overflow or runtime errors, existing facts/logos unchanged and no premature schedule. Click both links only to verify their destinations; do not log in or submit. Review screenshots. Compare all central-data text after reverting only these two registration substitutions to HEAD, and hash all other tracked files. Mark only two active tasks in `todo.md`, record evidence here, then save a managed WebDev checkpoint. No publication or historical TODO work is requested.

## Verification evidence — 18 November 2026

Expected RED was observed before implementation: four registration-related failures and seven passing focused tests. After implementation, `pnpm test && pnpm check && pnpm build && git diff --check` exited 0: all 164 tests across eight files passed, including 11 Workshops tests. TypeScript and production build passed; pre-existing pnpm configuration and large-bundle warnings remain non-blocking and out of scope.

`/tmp/sci2027-workshop-registration-qa.mjs` passed all four workshop/viewport pairs at 1920px and 375px. Each card has exactly one registration anchor with the exact confirmed mapping, target=_blank, rel=noopener noreferrer, descriptive accessible name and visible keyboard focus. Tab/Shift+Tab and Enter activation were verified. Both new tabs reached Google URLs containing the matching exact form ID while the Workshops page stayed open. No login or form submission occurred. The visible notice accurately says Google sign-in may be required.

Reviewed desktop NARSS and mobile Patents/NARSS registration screenshots. Labels and buttons remain inside their cards without horizontal/internal overflow or runtime errors. Ordered cards, intact object-contain logos (1056×1056 Patents and 400×393 NARSS), EGP 200 and 30-seat Patents facts, NARSS participation certificate and all five unannounced NARSS details remain unchanged. No restored announcement or invented schedule.

Source comparison confirms only the two registration objects differ in central conference data. SHA-256 comparison confirms 766 other tracked files remain identical to the saved baseline. Independent read-only review found no concrete bug and confirmed mapping, native anchors, safety, keyboard accessibility, neutral status and fallback. Only the two active registration-link tasks are marked complete; historical checklist work is not executed. Save this verified state in a managed WebDev checkpoint without a separate publication action.
