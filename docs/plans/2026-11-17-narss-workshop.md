# NARSS Workshop Implementation Plan

**Goal:** Add the second approved workshop to the existing English Workshops page, keeping the patents workshop unchanged.

**Architecture:** Append one central workshop record with the exact approved title and NARSS provider. Reuse the existing list renderer and uncropped object-contain logo markup; add unknown capacity handling and optional duration/certificate fields. Use smaller body-text sizing only for unannounced fees, preserving the existing confirmed-price typography. No backend, registration, programme, archive or DNS changes.

**Tech Stack:** React/TypeScript, Tailwind, Vitest, Puppeteer.

## Approved content and asset

- Title: `Remote Sensing Applications: From Space Science to Geological and Petroleum Exploration`.
- Provider: `National Authority for Remote Sensing and Space Sciences (NARSS)`.
- Format: `Practical workshop`; certificate: `Certificate of participation`.
- Duration, capacity, fee, date/time and venue: `To be announced`. Capacity is stored as null rather than an invented seat count.
- Registration: `Coming soon`, null URL, no form/button pending the organizer's Google Form.
- The logo was supplied after the initial workshop approval, superseding the initial null-logo plan. Hosted lossless WebP: `https://files.manuscdn.com/user_upload_by_module/session_file/118031311/daQZyudkgjiRZkGh.webp`, 400×393. Entire image preserved, no crop, upscale or background removal; English alt text.
- The administrative letter remains private and is not published. Conference dates are not assigned to the workshop. No speakers, prices, payment URLs or schedules invented.

## Test-first implementation

1. Updated `client/src/data/sci2027Workshops.test.ts` to require two ordered workshop records, exact NARSS fields/logo/certificate and safe unknown-value rendering. Observed four expected RED failures before implementation; five existing checks passed.
2. Appended the record to `client/src/data/sci2027Content.ts`, leaving the patents object unchanged.
3. Updated `client/src/pages/Sci2027Workshops.tsx` for null capacity, optional duration/certificate and card spacing. Nine focused tests and TypeScript passed.
4. Corrected the temporary QA script's nested-object comparison: its regex stopped at the logo's closing brace. The replacement compares all central data after removing the complete appended record up to the existing workshops-list outer boundary.
5. Browser QA caught internal mobile overflow in the unannounced fee text. Added a regression test, observed its expected RED (nine tests passed, one failed), then applied body-text sizing only to the unannounced fee. Kept the EGP 200 typography unchanged.

## Verification evidence — 17 November 2026

- `pnpm test && pnpm check && pnpm build && git diff --check`: exit 0; 163 tests across eight files passed, including ten Workshops tests. Existing pnpm configuration and large-bundle warnings remain non-blocking and outside scope.
- `/tmp/sci2027-narss-qa.mjs`: passed at 1920px desktop and 375px mobile; ordered IDs `patents`, `remote-sensing`; exact NARSS text; five TBA values; participation certificate; Coming soon; no registration controls, invented date/price/seats, restored poster, horizontal/internal overflow or runtime errors.
- Reviewed desktop, mobile header/logo/fee and mobile duration/certificate/registration screenshots. NARSS logo is fully visible and aspect-preserved. Existing natural circular patents-office logo remains unchanged.
- Hash comparison: 765 other tracked files remain byte-identical to HEAD. Exact source comparison: patents record and all other central conference data remain byte-identical after removal of the complete additive NARSS block.
- Original NARSS upload SHA-256 remains `dba8cc07a70a5b173444a8c3de0d7919d0e5ed51b5464a857e286272892e16b9`. Worker verification records identical decoded pixels and hosted/local bytes in `/tmp/sci2027-narss-logo/manifest.json`. Original attachments were not altered or reopened through file-image viewing.
- Letter SHA-256 before/after browser verification: `1e15d730f98979e351a7f1a1b469c5e2fc071e6e0fce64bfa80d3105af98e19a`.
- Only the two active NARSS tasks are marked complete in `todo.md`. Historical pending work is not executed. Save the verified state through the managed WebDev checkpoint; no separate publication is requested or performed.
