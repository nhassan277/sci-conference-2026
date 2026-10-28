# Conference Organization Unit Short Display Names Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Display the confirmed two-part English names, with titles retained, for all nine Conference Organization Unit members and the public Unit Head line.

**Architecture:** Change only the `name` values in the structured `conferenceOrganizationUnit.members` array and the related `organizer.head.en` string in the existing source-of-truth content file. Do not alter departments, roles, responsibility summaries, text-card layout, contact boundaries or portraits.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vitest, Vite.

**Confirmed display roster:**

1. Prof. Walid Rahouma
2. Prof. Mohamed Qarny
3. Mrs. Manar Mohamed
4. Dr. Nahla Osama
5. Prof. Azza Shoukry
6. Dr. Dina Amr
7. Prof. Rania Ali
8. Prof. Rasha El-Nashar
9. Dr. Nourhan Hassan

---

### Task 1: Create a failing display-name regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require the exact nine confirmed short display names in roster order and `Unit Head: Prof. Walid Rahouma`. Assert the former longer display names are absent while departments, roles and summaries remain present.

**Step 2: Run and verify the test fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the existing roster still has longer display names for Walid, Mohamed, Nahla and Rania.

### Task 2: Update only display-name source content

**Files:**
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Apply exact confirmed names**

Replace only the four longer names and the Unit Head line:

- `Prof. Walid Ali Rahouma` → `Prof. Walid Rahouma`
- `Prof. Mohamed Qarny Ismail` → `Prof. Mohamed Qarny`
- `Dr. Nahla Osama Mohamed Moussa` → `Dr. Nahla Osama`
- `Prof. Rania Ali Hassan` → `Prof. Rania Ali`
- `Unit Head: Prof. Walid Ali Rahouma` → `Unit Head: Prof. Walid Rahouma`

Keep all other approved display names unchanged.

### Task 3: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Verify the exact confirmed roster order, unchanged role/department/summary values, exact Unit Head line, and absence of all superseded longer display names from public client code.

**Step 2: Visual review**

Capture desktop and mobile homepage screenshots. Confirm all cards remain text-only, readable and free of horizontal overflow.

**Step 3: Checkpoint**

Mark checklist items complete and save a WebDev checkpoint only after all checks pass.
