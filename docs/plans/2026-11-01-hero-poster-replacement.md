# Hero Poster Replacement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace only the SCI 2027 homepage Hero poster with the newly supplied official poster, keeping all image pixels, including the printed `www.scicu.net` text, and leaving all Hero copy and other poster placements unchanged.

**Architecture:** `assets.detailedPoster` is the central Hero asset read by `Sci2027Home.tsx`. Create a separate managed hosted WebP derivative from the supplied JPEG after EXIF orientation handling, preserving its full 2:3 aspect ratio without crop, text removal, retouching, overlays, or modification of the source file. Update only `assets.detailedPoster`.

**Tech Stack:** React, TypeScript, Tailwind CSS, Pillow, managed public storage, Vitest, Vite.

---

### Task 1: Define the Hero-poster contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write failing test**

Require `sci2027Content.assets.detailedPoster` to equal the new hosted URL after upload, be HTTPS, and differ from the retired poster URL. Require `Sci2027Home.tsx` to retain `assets.detailedPoster` and its current `w-full` non-cropping Hero image class.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the old Hero-poster URL remains in central assets.

### Task 2: Create and host the untouched-aspect derivative

**Files:**
- Source (do not modify): `/home/ubuntu/upload/b50e2fa1-1ae3-4e12-9f94-0ae7fb2f711c.jpg`
- Create: `/tmp/sci2027-hero-poster-full.webp`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Derive with no crop**

Use Pillow only to EXIF-transpose and encode a new WebP copy. Preserve all original pixels/aspect ratio, including printed artwork and `www.scicu.net`; do not overwrite the source.

**Step 2: Verify and upload**

Verify the original checksum is unchanged, derived dimensions remain 1024×1536, and upload the WebP to managed storage. Download once and verify hosted bytes match the local derivative.

**Step 3: Update central Hero asset**

Replace only `assets.detailedPoster` with the hosted URL.

### Task 3: Review and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

**Step 2: Responsive review**

Review the Hero at desktop and 390px width. Confirm the complete supplied poster, including its printed artwork, is visible with no crop, while the Hero layout/text remain unchanged.

**Step 3: Release checks and checkpoint**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Mark the focused tasks complete and save a WebDev checkpoint.
