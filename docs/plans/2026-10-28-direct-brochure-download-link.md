# Direct English Brochure Download Link Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the English SCI 2027 brochure’s Manus-hosted URL with the organizer-supplied public Google Drive direct-download URL across every existing English brochure action, while retaining the Arabic brochure unchanged.

**Architecture:** The conference’s `assets.brochureEnglish` record is the shared source of truth for homepage, programme and footer actions. Update only that record to the exact `uc?export=download&id=` Google Drive endpoint derived from the organizer’s public file ID. No UI labels, Arabic asset, local public documents or external action markup change.

**Tech Stack:** TypeScript, React, Vitest.

---

### Task 1: Define the direct-download URL regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Update the brochure test to require:
- `assets.brochureEnglish` equals `https://drive.google.com/uc?export=download&id=1cw1EwBsOOfSzEHs9nIRPiOahzDZLVfp_`;
- it does not contain `files.manuscdn.com`;
- the retired local English brochure is absent; and
- the existing Arabic brochure remains a local, existing asset.

**Step 2: Run the focused test and confirm it fails**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the source of truth still uses the former Manus-hosted English brochure URL.

### Task 2: Replace the shared English brochure URL

**Files:**
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Update only the English asset**

Set `assets.brochureEnglish` to:

```ts
"https://drive.google.com/uc?export=download&id=1cw1EwBsOOfSzEHs9nIRPiOahzDZLVfp_"
```

Leave `assets.brochureArabic` and every UI label untouched. Because homepage, programme and footer read the shared English asset, no duplicated URLs should be added to components.

**Step 2: Run the focused test**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Confirm the direct endpoint responds**

Request the exact URL and confirm it redirects or responds as a downloadable Google Drive resource without a Manus CDN hostname.

**Step 2: Run complete release verification**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 3: Review the three existing actions**

Confirm the homepage, programme page and footer obtain their English brochure action from `assets.brochureEnglish`; Arabic remains unchanged.

**Step 4: Save a WebDev checkpoint**

Mark the checklist items complete only after the verification above, then save a descriptive checkpoint.
