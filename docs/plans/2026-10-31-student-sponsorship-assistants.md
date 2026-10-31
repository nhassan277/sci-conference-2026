# Student Sponsorship Assistants Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Recognize Youssef Saher Sayed and Ziad Ahmed as Student Sponsorship Assistants in the SCI 2027 Partnerships & Sponsorship page, without adding them to the Conference Organization Unit or Organizing Committee rosters.

**Architecture:** Store the short, organizer-approved acknowledgement in `sci2027Content.sponsorship` alongside other sponsorship-page data. Render one small, responsive recognition card after the special opportunities section and before the sponsorship contact call to action. The card presents only the title, an approved general support statement, and the two names—no email, phone, portrait, role inflation, or duplicate homepage/Unit content.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Vitest.

---

### Task 1: Define the acknowledgement contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Add a test that requires:
- `sci2027Content.sponsorship.studentSponsorshipAssistants`;
- title `Student Sponsorship Assistants`;
- description `Supporting sponsor outreach and partner coordination for SCI 2027.`;
- members `Youssef Saher Sayed` and `Ziad Ahmed` in the organizer-provided order;
- the sponsorship page to map the central `members` array; and
- the Unit page source not to contain either name.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the acknowledgement record and page card do not exist.

### Task 2: Render the sponsorship acknowledgement

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Sponsorship.tsx`

**Step 1: Add the central record**

Add the exact approved title, support statement, and the two member names under `sponsorship.studentSponsorshipAssistants`.

**Step 2: Add the page card**

Add one restrained, responsive card between Special opportunities and Start the conversation. Use the central record and map the names as simple visual tokens. Keep all copy English-only and preserve the existing contact action and sponsorship-package content.

**Step 3: Verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Review and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 2: Review responsive presentation**

Confirm the acknowledgement appears once on the sponsorship page, with both names clearly displayed on desktop and narrow mobile. Confirm the Conference Organization Unit page does not include either name.

**Step 3: Checkpoint**

Mark the tracked tasks complete and save a WebDev checkpoint.
