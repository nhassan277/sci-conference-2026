# Venue Montage Slides Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the two approved complete venue montages after the two existing 4-photo carousel slides.

**Architecture:** Keep the eight original image records unchanged. Add `identity.location.venueMontages` with two hosted lossless WebP records. Form four carousel pages (4, 4, 1, 1); render single-image pages at native aspect ratio rather than within square grid tiles. Keep arrows/dots manual, no captions, existing text/directions untouched.

**Tech Stack:** React, TypeScript, Tailwind, Vitest, Pillow, managed file storage.

---

### Task 1: Write failing tests

**Files:** `client/src/data/sci2027Content.test.ts`.

1. Add contract requiring two hosted montage records, original dimensions 1536×1024 and 1254×1254, descriptive English alt text, no caption.
2. Retain original eight-photo grouping contract and require montage pages after the slices, full-image `block h-auto w-full` rendering, four pages total, no timers/captions.
3. Run `pnpm exec vitest run client/src/data/sci2027Content.test.ts` and verify expected failure for missing montage data/branch.

### Task 2: Prepare full-image assets and update rendering

**Files:** `client/src/data/sci2027Content.ts`, `client/src/pages/Sci2027Home.tsx`.

1. Create full-resolution lossless WebP derivatives in a temporary folder, preserving original pixels and all uploaded originals.
2. Upload via managed storage; verify returned bytes, dimensions and original checksums.
3. Add `venueMontages` records with verified remote URLs, dimensions, source and alt; do not change `venueGallery` or dormant `venueVisuals`.
4. Append `...identity.location.venueMontages.map((montage) => [montage])` to `venueGalleryPages`.
5. Render a full-width natural-height image if active page has one image; otherwise retain current 2×2 layout. Existing arrows/dots automatically use four-page bounds.
6. Run focused tests, expect PASS.

### Task 3: Verify and checkpoint

1. Run `pnpm test && pnpm check && pnpm build && git diff --check`.
2. In local Chromium at desktop 1440×1000 and mobile 375×900, verify four dots, counts 4/4/1/1, exact montage URLs and native ratios, no captions/overflow/autoplay, manual arrows/dots and disabled end bounds.
3. Capture and inspect both montage slides on both viewport sizes. Confirm venue copy/directions, old records and unrelated conference data unchanged versus Git HEAD.
4. Mark only current montage checklist complete and save a WebDev checkpoint.
