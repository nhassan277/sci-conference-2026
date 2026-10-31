# Register Now to Registration Fees Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Direct the public SCI 2027 Register now / Register calls to action to the Registration Fees & Payment section, so visitors review participation options before opening an official registration form.

**Architecture:** Keep `#registration-fees` as the single internal destination already used by the publication section. Update only the homepage Hero Register now action, shared-header desktop Register now action, shared-header mobile Register now action, and shared navigation Register item. The registration forms inside the `#registration` section retain their current official external URLs and new-tab behaviour.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Define the registration-entry contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write a failing test**

Add a test requiring:
- the Hero Register now anchor to use `#registration-fees`;
- the navigation Register item to use `/#registration-fees`;
- both shared-header Register now actions to use `/#registration-fees`, not the general Google Form;
- the `#registration-fees` target to remain before `#registration`; and
- official registration-form source URLs to remain in the form section.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because existing entry actions still target the external general form or the lower form section.

### Task 2: Redirect public entry actions

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/components/Sci2027Header.tsx`

**Step 1: Update internal targets**

Change the Hero button `href` to `#registration-fees`. Change the header navigation Register item and both Header Register now anchors to `/#registration-fees`. Remove `target`/`rel` only from those now-internal Header anchors.

**Step 2: Preserve form actions**

Do not alter the existing general, speaker, or student external registration actions in the registration section.

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

**Step 2: Review in browser**

On desktop and mobile, click each header and Hero registration entry action. Confirm it lands on `#registration-fees`, shows the fee table and add-ons, and leaves the lower external form actions intact.

**Step 3: Checkpoint**

Mark the tracked tasks complete and save a WebDev checkpoint.
