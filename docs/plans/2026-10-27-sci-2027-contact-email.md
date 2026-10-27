# SCI 2027 Contact Email Replacement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `sci.conf.2027@gmail.com` the sole public contact email for the new SCI 2027 experience, including general enquiries and sponsorship, without changing SCI 2026 archive-specific content.

**Architecture:** Update the SCI 2027 content source of truth so shared public components consume the new address automatically. Add a regression assertion that the general contact and sponsorship contact addresses match. The runtime owner-notification email is not set and the project has no separate hardcoded recipient email configuration, so no internal recipient record can be safely changed through code.

**Tech Stack:** React 19, TypeScript, Vitest, Vite.

---

### Task 1: Lock the approved public contact address in a regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Add an assertion that requires the public SCI 2027 general contact address to equal the approved sponsorship inbox:

```ts
expect(sci2027Content.contact.email).toBe("sci.conf.2027@gmail.com");
expect(sci2027Content.contact.email).toBe(sci2027Content.sponsorship.contactEmail);
```

**Step 2: Run test to verify it fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the general contact source still contains the former address.

### Task 2: Replace the SCI 2027 general contact source

**Files:**
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Implement the minimal change**

Change only `sci2027Content.contact.email` to `sci.conf.2027@gmail.com`. Do not change SCI 2026 archive-specific data or unrelated historical planning documents.

**Step 2: Run test to verify it passes**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Verify public use and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Verify all current public SCI 2027 email paths**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
grep -RIn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git 'nyehia@sci.cu.edu.eg' client/src
```

Expected: tests, typecheck, build, and whitespace checks pass; no former address remains in current public client source.

**Step 2: Visual review**

Capture the homepage and sponsorship page to verify the footer, general enquiry path, and sponsorship CTA point to the approved inbox.

**Step 3: Save and track**

Mark the replacement task complete in `todo.md` and save a WebDev checkpoint after verification.
