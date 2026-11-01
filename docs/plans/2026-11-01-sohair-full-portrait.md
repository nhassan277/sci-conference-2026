# Sohair Full Portrait Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the cropped Prof. Sohair Ramadan Fahmy portrait in Distinguished Patronage with a managed hosted derivative of the original portrait that preserves all source pixels and displays it fully in the existing card.

**Architecture:** Locate the confirmed original upload `pasted_file_NhngsK_image.png` without modifying it. Create a separate WebP derivative after EXIF orientation handling with no crop, no overlay, and no content additions. Upload the derivative to managed storage, replace only Prof. Sohair’s central photo URL, and change that record to `fit: "contain"`; no other patronage record or page copy changes.

**Tech Stack:** React, TypeScript, Tailwind CSS, Pillow, managed public storage, Vitest, Vite.

---

### Task 1: Define the non-cropped portrait contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write failing test**

Extend the patronage test to require Prof. Sohair’s portrait to:

```ts
{
  alt: "Prof. Sohair Ramadan Fahmy, Dean of the Faculty of Science, Cairo University.",
  fit: "contain",
}
```

Require its URL to differ from the retired cropped URL `bMRokNwXdByfPRny.webp`. Keep the expected card order and Amal’s `fit: "contain"` assertion unchanged.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because Prof. Sohair still points to the cropped asset and uses `fit: "cover"`.

### Task 2: Create and host the full portrait derivative

**Files:**
- Source (do not modify): `/home/ubuntu/upload/pasted_file_NhngsK_image.png`
- Create temporary derivative: `/tmp/sci2027-sohair-ramadan-fahmy-full-portrait.webp`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Inspect and derive without crop**

Use Pillow to inspect source metadata and create an EXIF-transposed RGB WebP derivative. Preserve the original dimensions/aspect ratio—do not crop, pad, apply AI editing, or overwrite the input.

**Step 2: Verify and upload**

Verify dimensions, image format, and checksum locally; upload the derivative to managed public storage. Download it once to prove hosted bytes exactly match the local derivative.

**Step 3: Update central patronage data**

Update only Prof. Sohair’s `photo.url` to the new managed URL and `photo.fit` to `"contain"`.

### Task 3: Review and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

**Step 2: Responsive review**

Review Distinguished Patronage at desktop and 390px width. Confirm the full portrait is visible, the original is untouched, and the two other patronage cards are unchanged.

**Step 3: Release checks and checkpoint**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Mark the three focused tasks complete and save a WebDev checkpoint.
