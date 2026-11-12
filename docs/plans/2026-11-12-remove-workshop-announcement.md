# Remove Workshop Partnership Announcement Implementation Plan

**Goal:** Remove the large partnership announcement, its caption and associated date-explanation note from Workshops, while preserving the office logo and all confirmed workshop details.

**Architecture:** Delete only `announcement` and `scheduleNote` from the patents workshop record and their UI rendering. Remove the unused two-column poster layout so details fill the card. No original uploads, hosted assets, routes, programme/fees, forms, backend or archive are deleted or changed.

**Tech Stack:** React, TypeScript, Tailwind, Vitest, Puppeteer.

## Task 1 — RED

Update `client/src/data/sci2027Workshops.test.ts` to retain the complete-logo contract, confirmed details and links, reject announcement/scheduleNote fields and reject figure/caption/poster rendering or the unused `xl:grid-cols-[1.15fr_0.85fr]` layout. Run `pnpm exec vitest run client/src/data/sci2027Workshops.test.ts`; confirm failure because the announcement still exists.

## Task 2 — GREEN

Remove announcement/scheduleNote from `client/src/data/sci2027Content.ts`. In `client/src/pages/Sci2027Workshops.tsx`, remove figure, caption and schedule-note paragraph and convert the poster/details grid to one full-width details container. Preserve title, provider, complete logo, half-day format, 30 seats, EGP 200, scheduling/venue TBA, registration Coming soon, extra-workshops TBA and navigation. Run focused tests.

## Task 3 — Verify and save

Run `pnpm test`, `pnpm check`, `pnpm build`, `git diff --check`; browser-check desktop/mobile with only one logo image, no announcement figure/caption/date explanation, all details and original route/navigation preserved, no empty desktop column or horizontal overflow. Compare all other central data and tracked files against HEAD; verify original upload hashes unchanged. Review screenshots, mark these tasks complete and save a WebDev checkpoint. Do not execute historical checklist items.

## Completed verification

The revised tests first failed for the expected remaining scheduleNote and announcement rendering (2 failing / 4 passing). After the minimal implementation all six workshop tests passed; the full suite passed 159 tests across eight files. TypeScript, production build and git diff --check passed.

Desktop (1920px) and mobile (375px) browser checks and screenshots confirm one complete office logo only; no announcement, figure, caption, linked poster or date-explanation text; title/provider/half-day/30 seats/EGP 200/TBA scheduling/venue/Coming soon registration and additional-workshop status preserved. The full-width detail and registration sections leave no unused poster column, and there is no horizontal overflow or runtime page error. The Workshops tab, footer and route are unchanged.

Independent read-only comparison against HEAD 7f51201b1a32c86c86070711d2ff6ce1925d5ce5 checked all 767 tracked files: only the four intended files changed (page, central data, test and checklist). All other files remained byte-identical. Removing just the old announcement block and scheduleNote line from baseline central data gives the exact current bytes; fees, dates, links, forms, backend, admin and archive remain unchanged. Original logo and announcement upload SHA256 hashes match the prior verified values. No originals or hosted assets were deleted, no forms submitted, no email sent, and no DNS or deployment action performed by this task.
