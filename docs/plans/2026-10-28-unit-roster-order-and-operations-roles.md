# Conference Organization Unit Roster Order and Operations Roles Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorder the nine published Conference Organization Unit cards and give Prof. Azza Shoukry and Dr. Dina Amr their distinct approved operational roles.

**Architecture:** The roster is defined once in `client/src/data/sci2027Content.ts` and rendered in that array order by the `Meet the Unit` map in `Sci2027Home.tsx`. Update only the content source, then retain the map-driven UI. Extend the existing Vitest source-of-truth assertions to prevent future changes from restoring the old order or shared co-lead label.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Vitest.

---

### Task 1: Define the expected published roster behavior

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts:163-196`

**Step 1: Write the failing test**

Replace the nine-member expected order with the approved order:

1. Prof. Walid Rahouma — Director of the Unit
2. Prof. Mohamed Qarny — Secretary of the Unit
3. Mrs. Manar Mohamed — Administrative Secretary to the Unit
4. Dr. Nahla Osama — Scientific Programme Lead
5. Prof. Rania Ali — Media & Marketing Lead
6. Dr. Nourhan Hassan — Sponsorship, Funding & Conference Website Lead
7. Prof. Rasha El-Nashar — Public Relations Lead
8. Prof. Azza Shoukry — Registration & Operations Lead
9. Dr. Dina Amr — Logistics Lead

Add focused assertions that Azza’s summary covers registration, reception and participant flow, and Dina’s summary covers venue, equipment, hospitality, accommodation, transport and support needs.

**Step 2: Run the focused test to verify RED**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the source still places Azza and Dina before Rania, Nourhan and Rasha and gives them the shared co-lead role.

### Task 2: Apply the minimal content-source update

**Files:**
- Modify: `client/src/data/sci2027Content.ts:160-215`

**Step 1: Reorder records**

Keep the first four records unchanged. Move the existing Rania, Nourhan and Rasha records directly after Dr. Nahla Osama. Place Prof. Azza Shoukry eighth and Dr. Dina Amr ninth.

**Step 2: Update the two approved roles and summaries**

Use exactly:

- `Registration & Operations Lead` for Prof. Azza Shoukry.
- `Logistics Lead` for Dr. Dina Amr.

Retain their departments and titles. Narrow only their respective summaries in line with the approved scope; do not alter any other member’s title, department, role or responsibility.

**Step 3: Run the focused test to verify GREEN**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Perform release verification and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run complete verification**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Also use a TypeScript-aware script to confirm the exact nine-name order, two revised roles and expected responsibility keywords.

**Step 2: Verify the running responsive page**

Capture a desktop and mobile screenshot of the `Meet the Unit` section and verify that the cards follow the source order, with no horizontal overflow.

**Step 3: Complete checkpoint-safe logo hosting work**

The user confirmed upload of `SCI2027.png` to File Storage. Ensure `assets.sci2027Logo` uses the verified managed hosted URL and no local public copy over 1 MB remains.

**Step 4: Checkpoint**

Mark the two roster items and the managed-logo hosting item complete in `todo.md`, then save a WebDev checkpoint with the precise verification evidence.
