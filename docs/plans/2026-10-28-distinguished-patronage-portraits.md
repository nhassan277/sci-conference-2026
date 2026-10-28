# Distinguished Patronage Portraits Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add consistent, professional 4:5 portrait crops for Prof. Mohamed Sami Abdel-Sadek and Prof. Sohair Ramadan Fahmy to their Distinguished Patronage cards while preserving the existing roles, color palette and responsive layout.

**Architecture:** Create two derived WebP files from the two user-supplied portraits. Keep the originals untouched. Store hosted portrait URLs and clear alternative text alongside each patronage record in `sci2027Content.ts`, then render a compact portrait component within each existing card.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, Pillow, managed CDN hosting.

---

### Task 1: Define the portrait contract with a failing test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

1. Require exactly two `photo` records on `sci2027Content.patronage`, each with a managed HTTPS URL and nonempty alternative text.
2. Require `Sci2027Home.tsx` to reference `patron.photo.url` and `patron.photo.alt`, use a 4:5 portrait ratio, and apply `object-cover` inside a consistent portrait frame.
3. Run `pnpm exec vitest run client/src/data/sci2027Content.test.ts`; it must fail before the metadata and UI exist.

### Task 2: Create portrait crops without changing user originals

**Files:**
- Source only: `/home/ubuntu/upload/pasted_file_xziyrn_image.png`
- Source only: `/home/ubuntu/upload/pasted_file_NhngsK_image.png`
- Temporary outputs: `/home/ubuntu/sci2027-patronage-portraits/`

1. Create a 4:5 WebP crop for Prof. Mohamed Sami Abdel-Sadek by retaining the full height and using a centered vertical crop.
2. Create a 4:5 WebP crop for Prof. Sohair Ramadan Fahmy by removing the surrounding black and white framing and retaining the central face-and-shoulder composition.
3. Inspect the two derived images once with `read`; no original image will be opened again.
4. Upload the optimized files to managed CDN hosting, verify successful HTTP response and byte checksum, then remove the temporary workspace.

### Task 3: Add portrait metadata and render it

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

1. Add `{ url, alt }` as `photo` for each patronage record.
2. Render a compact `aspect-[4/5]` portrait on the left of each card with an editorial navy-and-gold border, `object-cover`, and a center-biased crop position.
3. Retain all existing patron names and roles exactly.
4. Run the focused test to verify GREEN.

### Task 4: Full verification and checkpoint

**Files:**
- Modify: `todo.md`

1. Run `pnpm test`, `pnpm check`, `pnpm build`, and `git diff --check`.
2. Capture desktop and mobile screenshots of the homepage Patronage section.
3. Confirm that both portraits are compact, aligned, readable, and do not distort the card layout.
4. Mark the checklist tasks complete and save a WebDev checkpoint.
