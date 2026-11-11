# Media Registration Card Relocation Implementation Plan

**Goal:** Remove the Press & media / Media Registration card from the SCI 2027 homepage and show the same English text beside Sponsor & Partner Registration on the sponsorship page.

**Architecture:** Keep existing Wouter routes, request forms, APIs, database and admin behavior untouched. Remove only the homepage card. Add a two-card registration area to the sponsorship page, showing sponsor/partner registration first and media registration second; use one column on mobile and two from the medium breakpoint. Retain existing sponsor links in the hero and prospectus email actions.

**Tech Stack:** React, TypeScript, Wouter, Tailwind, Vitest and Puppeteer. No additional dependencies.

## Tasks

1. Update `client/src/data/sci2027RequestNavigation.test.ts` before implementation: assert no media card/link on homepage, preserve the three official forms, and require a sponsorship-page two-card area with unchanged media text and route. Run focused tests to confirm RED.
2. Remove the single media `<article>` from `client/src/pages/Sci2027Home.tsx`.
3. In `client/src/pages/Sci2027Sponsorship.tsx`, move the contact-area sponsor link into a matching sponsor card next to the relocated media card, with `grid gap-5 md:grid-cols-2`. Keep both sponsor entry links, email actions, packages and official content unchanged.
4. Run focused and full tests, `pnpm check`, `pnpm build`, and `git diff --check`. Compare every other tracked source file against HEAD. Review desktop and narrow-mobile cards, click both routes, confirm the forms load without submitting anything, and inspect homepage absence.
5. Mark only the current relocation checklist complete and save a WebDev checkpoint.

## Boundaries

No changes to forms, request records, authentication, database, backend, official Google Forms, content data, archive, fees or email destinations. No publishing/DNS changes are part of this move.

## Verification completed

The test-first RED run failed in three expected assertions: the homepage still contained the media link, the new sponsorship card area did not exist, and the earlier visual-merge test still expected the old location. After implementation, all **153 tests passed** across seven files, `pnpm check` and `pnpm build` passed, and `git diff --check` was clean.

Browser checks at 1920px, 768px and 375px verified side-by-side cards from the medium breakpoint and sponsor-then-media stacking on narrow mobile. Both links were clicked and loaded their original forms without submitting requests. Homepage absence, all three official Google Forms, both existing sponsor entry points, all three prospectus email actions, and no horizontal page overflow were verified. Desktop and mobile screenshots of the two-card area were reviewed.

Hash comparison against the previous checkpoint confirmed **757 other tracked files unchanged**, including form components, routes, backend, schema/migrations, admin, central content, archive and assets. No database records were read or modified, and no forms or emails were sent.
