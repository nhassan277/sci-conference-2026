# Unit Public Relations & Sponsorship Roles Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the three organizer-approved updates to Hoda Abu Shady, Azza Shoukry, Manar Mohamed and the names-only committee heading.

**Architecture:** Keep all member records in `client/src/data/sci2027Content.ts`. The existing Unit and Sponsorship pages already render central data; no route, component or layout changes are needed. Preserve all unaffected records, the student-assistant acknowledgement, public English-only content and archived material.

**Tech Stack:** TypeScript, React, Tailwind, Vitest, Vite.

---

### Task 1: Define the approved content contract

**Files:** Modify `client/src/data/sci2027Content.test.ts`.

1. Change the Unit contract from eight to nine members, inserting Prof. Hoda Abu Shady (Physics) immediately before Prof. Azza Shoukry (Chemistry).
2. Require both roles to equal `Public Relations & Sponsorship Committee`, not Lead, and use summary `Supports public relations, institutional outreach and sponsor engagement for the Unit’s scientific conferences and events.`
3. Require Manar's role `Administrative & Media Officer` and summary `Supports the Unit’s administration through correspondence, records, scheduling and follow-up, and assists with media materials, announcements and communications.`
4. Require the sponsorship committee title `Public Relations & Sponsorship Committee` and members `Prof. Hoda Abu Shady`, `Prof. Azza Shoukry`, still before student assistants and names-only.
5. Run `pnpm exec vitest run client/src/data/sci2027Content.test.ts`; expect assertion failures for old roster/roles/title.

### Task 2: Apply central content changes

**Files:** Modify `client/src/data/sci2027Content.ts`.

1. Update Manar's role and summary with the text specified in Task 1.
2. Insert Hoda's Physics member record before Azza, with the committee role/summary specified above.
3. Replace only Azza's role and summary; retain her department and name.
4. Rename the sponsorship committee heading and use Hoda's approved Prof. title consistently.
5. Re-run the focused tests; expect PASS.

### Task 3: Verify and checkpoint

1. Run `pnpm test && pnpm check && pnpm build && git diff --check`.
2. Use the running local preview to verify both pages at 1440px and 375px: nine Unit cards, correct departments, committee roles with no Lead, revised Manar text, names-only committee before student assistants, and no horizontal page overflow.
3. Capture desktop/mobile screenshots and inspect them. Verify the remaining member records are unchanged against the pre-change Git content.
4. Mark only these active tasks complete in `todo.md` and save a managed WebDev checkpoint.

**Scope boundaries:** No modification to fees, brochure, dates, images, student assistants, other member roles or historical todo items.
