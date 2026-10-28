# Conference Organization Unit Members Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an English-only `Meet the Unit` roster of the seven published Conference Organization Unit roles to the SCI 2027 homepage, with role-specific, concise professional summaries and no personal contact details or meeting-record content.

**Architecture:** Extend the existing `conferenceOrganizationUnit` data source with a seven-person `members` array. Replace the temporary members-to-be-announced notice with a responsive roster in the existing Unit homepage section. Use text-only cards now and retain a documented pathway for adding portraits later.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide, Vitest, Vite.

**Authoritative source:** Public Google Drive meeting record, `https://drive.google.com/file/d/1E5gaGYzuAansmLTbfuljRFgHvcZtF-Y3/view?usp=drivesdk`, reviewed 28 October 2026. Use only the page-3 organizational structure and responsibilities; do not publish minutes, meeting date, attendance, apologies, or contact data.

---

### Task 1: Create a failing roster-and-rendering regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require exactly seven Unit member records, in the published order, with the approved English titles and roles. Assert that the roster includes `Prof. Walid Ali Rahouma` as `Director of the Unit` and `Dr. Nourhan Yehia Mostafa Hassan` as `Sponsorship & Funding Lead`, that each member has a department and summary, and that the former member-profile placeholder is absent. Require homepage source to map `conferenceOrganizationUnit.members` and display the `Meet the Unit` heading without portrait image elements or unapproved contact details.

**Step 2: Run and verify the test fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the temporary status remains and no `members` collection exists.

### Task 2: Add the seven official roster entries

**Files:**
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Replace temporary member status with structured roster data**

Publish these records, using role summaries faithful to the source:

1. `Prof. Walid Ali Rahouma` — `Astronomy & Space Sciences` — `Director of the Unit` — strategic direction, plan, coordination with Faculty leadership and stakeholders, final outputs.
2. `Prof. Mohamed Qarny Ismail` — `Geology` — `Secretary of the Unit` — meeting agendas/minutes, decision follow-up, official documentation, administrative coordination.
3. `Prof. Nahla Osama Mohamed Moussa` — `Biotechnology` — `Scientific Programme Lead` — programme, speaker coordination, abstracts, research papers and scientific review quality.
4. `Prof. Heba Mohamed Fahmy` — `Biophysics` — `Registration, Operations & Logistics Lead` — registration, participant reception, venue/equipment/hospitality/accommodation/transport coordination.
5. `Prof. Rania Ali Hassan` — `Botany` — `Media & Marketing Lead` — communications plan, digital platforms, promotional materials, media coordination.
6. `Prof. Rasha Mohamed El-Nashar` — `Chemistry` — `Public Relations Lead` — institutional outreach, guests/speakers/delegations, protocol and reception.
7. `Dr. Nourhan Yehia Mostafa Hassan` — `Biotechnology` — `Sponsorship & Funding Lead` — sponsor and funder engagement, sponsorship proposals, commitments and benefits in line with Faculty/University policy.

Do not add portraits, personal contact details, meeting minutes, attendance, or any details outside these roles.

### Task 3: Render the Meet the Unit roster

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Replace temporary status card**

- Replace `memberStatus` with a `Meet the Unit` heading and a responsive text-card roster.
- Feature the Unit Director in the first/dark card and use editorial cards for the remaining six roles.
- Render the name, department, role, and one concise responsibility summary per card.
- Keep the section English-only and do not use portraits or public contact details.

### Task 4: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Check that the roster has exactly seven members, all names/roles match the structured source, no `memberStatus` placeholder remains, and no personal contact details or meeting-record text are introduced.

**Step 2: Visual review**

Capture desktop and mobile homepage screenshots. Verify the first card is visually prominent, all seven cards are readable, and no horizontal overflow appears on mobile.

**Step 3: Checkpoint**

Mark checklist items complete and save a WebDev checkpoint after all checks pass.
