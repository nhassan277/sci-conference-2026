# Conference Organization Unit Roster Update Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update the SCI 2027 `Meet the Unit` roster to reflect the confirmed withdrawal of Prof. Heba Mohamed Fahmy, addition of Prof. Azza Shoukry, Dr. Dina Amr, and Mrs. Manar Mohamed, plus confirmed title and responsibility changes for Dr. Nahla Osama Mohamed Moussa and Dr. Nourhan Hassan.

**Architecture:** Update the existing structured `conferenceOrganizationUnit.members` source-of-truth collection and preserve the existing responsive text-card UI. Keep cards text-only until the user provides individual official portraits. Use distinct concise responsibilities for the two new co-leads so the shared Registration, Operations & Logistics remit is clear.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vitest, Vite.

**Confirmed content scope:** Public English roster only. No portraits, personal contact details, meeting date, attendance, or minutes.

---

### Task 1: Create a failing roster-update regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require exactly nine roster members and prohibit `Prof. Heba Mohamed Fahmy`. Require:

- `Dr. Nahla Osama Mohamed Moussa | Scientific Programme Lead`
- `Prof. Azza Shoukry | Registration, Operations & Logistics Co-Lead` with `Chemistry`
- `Dr. Dina Amr | Registration, Operations & Logistics Co-Lead` with `Biotechnology`
- `Mrs. Manar Mohamed | Administrative Secretary to the Unit` with `Conference Organization Unit`
- `Dr. Nourhan Hassan | Sponsorship, Funding & Conference Website Lead` with a summary mentioning website design, content, user experience and ongoing updates.

Keep the established Unit Director and Secretary roles, and require all roster records to have a department and responsibility summary.

**Step 2: Run and verify the test fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the existing list contains Prof. Heba, has seven members, and retains older titles/names.

### Task 2: Update structured roster data

**Files:**
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Apply confirmed roster changes**

- Remove Prof. Heba Mohamed Fahmy.
- Change Prof. Nahla Osama Mohamed Moussa to Dr. Nahla Osama Mohamed Moussa.
- Add Prof. Azza Shoukry, Chemistry, `Registration, Operations & Logistics Co-Lead`: participant registration, reception and front-of-house coordination.
- Add Dr. Dina Amr, Biotechnology, `Registration, Operations & Logistics Co-Lead`: on-site operations, venue/equipment, hospitality, accommodation, transport and support needs.
- Add Mrs. Manar Mohamed, Conference Organization Unit, `Administrative Secretary to the Unit`: official correspondence, records, scheduling and daily administrative coordination.
- Change Dr. Nourhan Yehia Mostafa Hassan to Dr. Nourhan Hassan. Update title to `Sponsorship, Funding & Conference Website Lead` and summary to include sponsorship/funding, conference website design, content, user experience and ongoing updates.

Keep the Director, Secretary, Media & Marketing, and Public Relations entries unchanged.

### Task 3: Verify the responsive roster remains data-driven

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx` only if TypeScript or responsive rendering needs a minimal adjustment.

**Step 1: Preserve the generic member-card map**

Do not add per-person hardcoding or portraits. The existing `conferenceOrganizationUnit.members.map` rendering must serve all nine text cards without design changes unless a layout correction is required.

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

Verify exactly nine members, confirmed new roles/departments, removal of Prof. Heba, concise homepage copy, no image elements in the member-card map, and no personal contacts or meeting-record content.

**Step 2: Visual review**

Capture desktop and mobile homepage screenshots. Confirm all nine text cards render in the responsive grid without horizontal overflow.

**Step 3: Checkpoint**

Mark checklist items complete and save a WebDev checkpoint only after all checks pass.
