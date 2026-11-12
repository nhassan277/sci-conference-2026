# Workshops and Patents Workshop Implementation Plan

**Goal:** Add a standalone English Workshops page and navigation tab after Programme, featuring the user-confirmed patent workshop, office logo and full partnership announcement.

**Architecture:** Add centralized `workshops` content to `client/src/data/sci2027Content.ts` and render it through a new public page at `/workshops`. Register the Wouter route and add shared desktop/mobile navigation, footer link and links from both programme pages. All existing routes, fees, workshop days, backend/forms/admin and archive remain unchanged. Both user images are complete uncropped lossless hosted WebP derivatives; originals are untouched. The bilingual announcement is the user-approved exception to otherwise English page text.

**Tech Stack:** React, TypeScript, Wouter, Tailwind, Vitest; Pillow for image re-encoding; Puppeteer for responsive QA.

## Task 1: Test-first contract

Create `client/src/data/sci2027Workshops.test.ts`. Require `/workshops`, tab directly after `/programme`, footer and programme links, central workshop title `Patents: when is your research protectable, and how to prepare and file`, provider `Cairo University Intellectual Property Protection Office`, format `Half-day hands-on workshop`, capacity 30, fee `EGP 200`, dates/time/venue `To be announced` and registration `Coming soon` with null URL. Require complete logo/announcement rendering and no workshop form/payment button or invented speaker details. Run `pnpm exec vitest run client/src/data/sci2027Workshops.test.ts` and verify expected RED (missing page/content).

## Task 2: Assets

Generate original-size lossless WebP derivatives outside the project from `/home/ubuntu/upload/IMG_0068.PNG` and `/home/ubuntu/upload/04d73eb1-dad0-4743-805f-59b0d8c5f103.jpg`. Do not reopen attachments for viewing. Preserve all pixels and original files, upload to managed storage, verify remote bytes/dimensions. Add descriptive English alt text. Do not infer the workshop date from the poster's conference dates.

## Task 3: Page and content

Add `workshops` immediately after existing `workshopProgramme` with page title, concise intro, future-workshop status and one item only. Include provider logo and official partnership announcement URLs/alt text, registration URL null, verified fee/capacity/format and unknown scheduling. Create `client/src/pages/Sci2027Workshops.tsx`: navy editorial hero, ivory workshop card, prominent exact title, logo and organized facts, date/venue/registration status, complete poster with English caption explaining conference dates are not workshop scheduling, and additional-workshops TBA notice. Use natural image aspect ratios (`h-auto w-full`/`object-contain`) without overlays or crop. Show no registration link/button until supplied.

## Task 4: Public entry points

Modify `client/src/App.tsx` to add `/workshops` without changing other routes. Modify `client/src/components/Sci2027Header.tsx` navigation after Programme, and `Sci2027Footer.tsx` with Workshops link after programme. Add `Explore workshops` links to `Sci2027Programme.tsx` and `Sci2027ProgrammeWorkshops.tsx` without assigning the patents workshop to a programme day. Preserve approved pre/post workshop dates and museum visit, all existing content and actions.

## Task 5: Verification and checkpoint

Run focused tests then `pnpm test`, `pnpm check`, `pnpm build`, `git diff --check`. Compare protected files against HEAD and central data excluding ONLY the new workshops property; assert fees, programme and other values identical. Browser-check 1920,1536,1280,375px for working route links, tab order, full images, no title/menu overflow, exact copy/capacity/fee, no register button, two originals still intact, and other-workshops placeholder. Inspect screenshots including full announcement on desktop/mobile. Mark current tasks complete and save a WebDev checkpoint. No records read/changed, form submissions, emails, DNS or production publishing.

## Completed verification

Five new tests failed with expected missing-page/data/route assertions before implementation. The new tests then passed. Full verification passed: 158 tests across eight files, TypeScript, production build and whitespace check. The running preview returned HTTP 200 for `/workshops`.

Browser QA at 1920/1536/1280/375px verified the exact Workshops tab immediately after Programme, correct route on click, footer and both programme-page links, no navigation overlap or horizontal page overflow, all confirmed workshop details, no premature Google Form button, one workshop only and additional-workshop TBA status. Desktop/mobile screenshots were visually reviewed. The complete partnership announcement opens in a new tab at full size and is explicitly distinguished from the workshop schedule.

Both lossless WebP assets retain their original normalized dimensions (logo 1463×1600; announcement 2160×2700), pixel-identical RGB content and hosted bytes. Original upload hashes remain unchanged. No assets were copied into client/public. The supplied bilingual announcement is deliberately retained as approved; all new page text and alt text are English.

A hash comparison confirmed 757 other tracked files unchanged. Exact source comparison confirmed the existing central data, all existing App routes, nav entries, footer links and programme-page content unchanged except the additive Workshops entry points and content property. Fees/payment, conference/workshop/cultural visit dates, backend, records, registration forms, admin and archive were not modified. No forms submitted, messages sent, DNS changed or production-domain verification performed in this task.
