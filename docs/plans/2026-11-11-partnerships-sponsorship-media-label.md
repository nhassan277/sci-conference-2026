# Partnerships, Sponsorship & Media Label Implementation Plan

**Goal:** Use the approved shorter name across SCI 2027 desktop/mobile navigation, page identity and links, preserving /sponsorship and all substantive content/forms.

**Architecture:** Update only the existing page-identity string in central content and visible navigation/link labels. On the sponsorship page use the new identity as h1 and retain the original marketing headline as the eyebrow, so no substantive copy is lost. Keep route paths, sponsorship offers, media invitation, form titles, email actions, backend and archive untouched.

**Tech Stack:** React, TypeScript, Tailwind, Wouter, Vitest and Puppeteer.

## Steps

1. Modify the relevant test in `client/src/data/sci2027Content.test.ts` to require the new header label, central identity, homepage/footer link names, sponsorship h1 and intact existing content/registration targets. Run focused Vitest and verify expected RED.
2. Change `sponsorship.eyebrow` in `client/src/data/sci2027Content.ts` to `Partnerships, Sponsorship & Media`. Update the header label, footer link and homepage CTA. Swap the existing sponsorship hero eyebrow and h1 data expressions to display the new name as h1 while retaining `Move science from insight to impact.` above it.
3. Run all tests, typecheck, build, whitespace checks. Verify desktop and mobile menu/page identity, unchanged route destinations, no overlap/horizontal overflow, and other tracked files unchanged. Check central-data diff permits only the identity value.
4. Mark these scoped tasks complete and save a WebDev checkpoint. No publishing/DNS or database operations.

## Verification evidence

The focused RED test failed for the previous header label. All 153 tests across seven test files passed after implementation; TypeScript, production build and whitespace checks passed. Desktop navigation was checked at 1920px and 1536px, collapsed navigation at 1280px and mobile at 375px. The exact new label was verified in both menus, homepage CTA, footer link and page h1, with no overlap or horizontal page overflow. Menu links were clicked and led to unchanged `/sponsorship`. Existing sponsor/media form links and three prospectus email actions remained intact. Desktop/mobile screenshots were reviewed.

A source hash comparison confirmed 756 other tracked files unchanged. Central conference content changed only in the existing sponsorship identity string, with all offers, prices, dates, contacts and substantive text unchanged. The original marketing headline remains visible above the new page h1. Static global browser metadata and legacy SCI 2026 UI remain unchanged; this rename covers current SCI 2027 public page entry points only. No messages or form submissions were sent and no DNS/database/backend changes were made.
