# Committee, Programme Day Count and Official Email Implementation Plan

**Goal:** Apply the user-confirmed Hoda-card removal, four-day programme statistic and two-recipient institutional email routing to the SCI 2027 website.

**Architecture:** Keep the existing central content and dynamic card renderer. Remove only Hoda's active `members` and `leaders` entries; preserve the dormant sponsorship acknowledgement and all other people. Centralize the institutional addresses and their comma-separated mailto recipient list. Show only the two institutional addresses in the shared footer, each opening the same two-recipient message.

**Tech stack:** React, TypeScript, Wouter, Tailwind, Vitest, Puppeteer; no new dependencies.

## Implementation

1. Update regression tests in `client/src/data/sci2027Content.test.ts` and `client/src/data/sci2027VisualMerge.test.ts`, and add a focused approved-update contract; confirm expected failures before production changes.
2. Edit `client/src/data/sci2027Content.ts`: remove Hoda's active card/member entries, set the final impact value to `4` with label `Conference & Workshop Days`, and route contact, sponsorship and payment email actions to both institutional addresses.
3. Edit `client/src/components/Sci2027Footer.tsx` to remove the former Gmail row and retain two visible institutional addresses, with both links addressed to both mailboxes.
4. Verify that every other member/portrait/role/order, conference dates, workshop dates, museum visit, fees, bank identifier, official Google Forms, archive, PDF and runtime backend files remain unchanged. Inspect mailto destinations without sending email.
5. Run `pnpm test`, `pnpm check`, `pnpm build`, and `git diff --check`. Check homepage, committee, sponsorship and shared footer on desktop/mobile. Save a WebDev checkpoint after success.

## Scope boundaries

No DNS, mailbox creation, external Google Form/PDF editing, archive changes, database records, backend behavior, registration fee changes or new automatic email sending. Actual workshop days remain 6 and 10 April, conference days 7 and 8 April, and the optional 9 April museum visit is excluded from the four-day scientific count.

## Verification evidence

- Expected RED: the four new focused tests failed before production edits. The updated existing content/visual contracts failed for the previous nine-member roster, two-day statistic and Gmail destinations.
- Removing the only empty-photo leader exposed TypeScript `TS2339` in an unreachable placeholder branch. Capturing `leader.name` before the photo conditional preserved the same accessibility description without widening types or changing visible cards. `pnpm check` then passed.
- Final suite: **152 tests passed**, TypeScript check passed, production build passed, and `git diff --check` passed. The public SCI 2027 source scan found no retired Gmail address.
- Browser checks passed for ten routes at both 1920px and 375px: homepage, committee, sponsorship, programme, programme/workshops, venue, gala dinner, videos and both SCI 2027 request forms. Every mailto action addresses both institutional mailboxes; the footer contains exactly two visible email links. The committee renders eight names in the original relative order and no Hoda card/placeholder.
- Whole-content comparison against the previous checkpoint confirmed that the only data changes are Hoda's two active entries, the final impact-card value/label, and the three email destination fields. **754 other tracked files** were byte-identical, including backend, schema/migrations, forms/admin, assets, archive and configuration.
- Screenshots reviewed: committee grid, four-day statistic, institutional footer addresses and retained Azza card. No mail sent, form submitted, database operation or DNS action.

The final source change is limited to central content, the footer and the one accessibility-variable/type correction on the committee page. Regression tests, this plan and the checklist are included in the checkpoint. PDFs and external Google Forms remain unchanged, as approved.
