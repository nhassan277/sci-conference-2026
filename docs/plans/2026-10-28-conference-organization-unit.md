# Conference Organization Unit Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an English-only, evidence-based Conference Organization Unit section to the SCI 2027 homepage, using the Faculty of Science’s official public copy and linking visitors to both the Faculty website and Unit page.

**Architecture:** Extend the existing `sci2027Content` source of truth with a `conferenceOrganizationUnit` block. Render that block as a homepage institutional section immediately after the conference overview, without adding individual names, member responsibilities, unit contacts, or a new route. Those profiles will be added only after the user provides them.

**Tech Stack:** React 19, TypeScript, Wouter, Tailwind CSS, Lucide, Vitest, Vite.

**Official source:** `https://scicu.net/Important%20Links/conference-organization` accessed 28 October 2026.

---

### Task 1: Create a failing content-and-rendering regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require the content source to contain:

```ts
expect(sci2027Content.conferenceOrganizationUnit.title).toBe("Conference Organization Unit");
expect(sci2027Content.conferenceOrganizationUnit.unitUrl).toBe(
  "https://scicu.net/Important%20Links/conference-organization",
);
expect(sci2027Content.conferenceOrganizationUnit.facultyUrl).toBe("https://scicu.net/");
expect(sci2027Content.conferenceOrganizationUnit.objectives).toHaveLength(4);
```

Require homepage source to render `conferenceOrganizationUnit`, use the two external links with `target="_blank"` and `rel="noreferrer"`, and label the planned member-profiles status without publishing names.

**Step 2: Run and verify the test fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because `conferenceOrganizationUnit` does not exist.

### Task 2: Add approved official Unit content

**Files:**
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Add a source-of-truth block**

Use the following source-grounded English content:

- Title: `Conference Organization Unit`
- Institution: `Faculty of Science, Cairo University`
- Description: `The Conference Organization Unit at the Faculty of Science, Cairo University supports the planning, coordination, and professional management of scientific conferences and events, fostering academic and research collaboration locally and internationally.`
- Objectives: Organizational Excellence, Scientific Excellence, Partnerships and International Collaboration, Sustainability and Development.
- Faculty URL: `https://scicu.net/`
- Unit URL: `https://scicu.net/Important%20Links/conference-organization`
- Member status: `Meet the Unit: member profiles and responsibilities will be introduced soon.`

Do not add contact email, phone, individual names, or unverified details.

### Task 3: Render the institutional section on the homepage

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Add a visual institutional section**

- Render immediately after the existing `#about` section and before the conference-at-a-glance band.
- Use the supplied Conference Organization Unit logo in the content asset map.
- Present a concise official description, four compact objective cards, and the future member-profile notice.
- Add two `target="_blank" rel="noreferrer"` links: `Visit the Faculty of Science Website` and `Learn More About the Unit`.
- Preserve English-only public rendering, responsive layout, and the current SCI 2027 editorial visual system.

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

Additionally verify the official Unit and Faculty URLs return successfully, the homepage contains the two exact links, the content has four objectives, and no `info@sci.cu.edu.eg` or phone number is introduced into the new public Unit section.

**Step 2: Visual review**

Capture desktop and mobile screenshots of the homepage showing the new Unit section, its two calls to action, and member-profile placeholder.

**Step 3: Checkpoint**

Mark the checklist complete and save a WebDev checkpoint only after all checks pass.
