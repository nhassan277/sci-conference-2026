# Vice Dean Patronage Card Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Prof. Amal Soliman as the third approved Distinguished Patronage card, directly after Prof. Sohair Ramadan Fahmy, using the supplied official portrait without altering the original image.

**Architecture:** Store the new English-only patronage record in `sci2027Content.ts`, preserving the confirmed order. Create a derived WebP copy in temporary workspace storage with EXIF orientation safely applied and no crop, upload it to managed public storage, and reference that managed URL from the content source. Use an opt-in portrait-fit field so this portrait is fully visible inside the existing 4:5 card frame while the existing cards retain their established cover treatment.

**Tech Stack:** React, TypeScript, Tailwind CSS, Pillow, managed public storage, Vitest, Vite.

---

### Task 1: Define the third patronage-card contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write failing test**

Require the patronage source to contain three entries in this order:

```ts
[
  "Prof. Mohamed Sami Abdel-Sadek",
  "Prof. Sohair Ramadan Fahmy",
  "Prof. Amal Soliman",
]
```

Require the new record to use:

```ts
{
  role: "Vice Dean for Postgraduate Studies and Research, Faculty of Science, Cairo University",
  photo: { alt: "Prof. Amal Soliman, Vice Dean for Postgraduate Studies and Research, Faculty of Science, Cairo University.", fit: "contain" },
}
```

Require the homepage to map the central patronage records and to render `object-contain` for a `contain` fit, retaining the existing `object-cover` branch.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the third record and fit-aware rendering do not exist.

### Task 2: Create and upload a non-destructive portrait derivative

**Files:**
- Source (do not modify): `/home/ubuntu/upload/IMG_0006.JPG`
- Create temporary derived asset: `/tmp/sci2027-amal-soliman-portrait.webp`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Create derivative**

Use Pillow to load a copy, apply EXIF transpose, preserve the full portrait aspect ratio, and encode an optimized WebP. Do not crop, overlay, annotate, or overwrite the original.

**Step 2: Verify asset**

Inspect the output dimensions and WebP metadata with Python. Upload the derivative using managed public storage and verify the hosted bytes match the local derivative checksum.

**Step 3: Update source**

Append the approved Prof. Amal Soliman record immediately after Prof. Sohair Ramadan Fahmy, with the managed hosted image URL and `fit: "contain"`.

### Task 3: Render and verify the card

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `todo.md`

**Step 1: Render fit-aware portrait**

Use the central `photo.fit` value to preserve the full new portrait with `object-contain`, while existing patronage portraits remain `object-cover`.

**Step 2: Verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

**Step 3: Review and checkpoint**

Review the Distinguished Patronage section at desktop and mobile widths, confirming the third card follows the Dean card and the photo is fully visible. Then run:

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Mark the focused tasks complete and save a WebDev checkpoint.
