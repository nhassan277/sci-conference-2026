# SCI 2027 Venue & Halls Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a polished English-only Venue & Halls section directly after Distinguished Patronage, showing the supplied conference-center photograph without crop and linking visitors to the approved Google Maps directions.

**Architecture:** Process the supplied PNG only as a lossless-content WebP web derivative, preserving its 3:2 composition and keeping the original untouched. Store its hosted URL, descriptive alt text, source label, caption, and reused map action in `sci2027Content.ts`; render the section from that central data so the image and directions remain consistent with the hero and programme.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, Lucide icons, PIL/Pillow, Manus managed file hosting.

---

### Task 1: Specify the venue visual contract test-first

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Write the failing test**

Add a focused test requiring `identity.location.venueVisual` to provide a hosted HTTPS URL, the source label `SCI 2027 venue photograph`, descriptive English alt text, and the caption `Main auditorium and meeting facilities at the Conference Center - Cairo University.` Require `Sci2027Home.tsx` to render a `venue` section after `Distinguished patronage` and before the existing introduction, using both visual fields and the safe existing map action.

**Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: failure because venue image source data and the public section do not yet exist.

**Step 3: Create and verify the managed image derivative**

- Create `/home/ubuntu/sci2027-venue-halls/venue-halls.webp` from `/home/ubuntu/upload/pasted_file_jlCmMY_image.png` using PIL.
- Preserve the full 3:2 frame, do not crop, annotate, or overwrite the original.
- Upload the WebP to managed hosting, then verify HTTP success, SHA-256 equality and 3:2 dimensions against the local derivative.
- Add only the hosted URL and metadata to the central source.

**Step 4: Run the focused test and confirm it passes**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: pass.

### Task 2: Render the Venue & Halls section

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Render immediately after Distinguished Patronage**

Add `<section id="venue">` after the patronage section. Use a two-column desktop layout with a clear, single-column mobile stack:

- Eyebrow: `Venue & Halls`
- Heading: `A setting designed for scientific exchange.`
- Body: `Explore the Conference Center - Cairo University, including its main auditorium and supporting meeting facilities.`
- Gold-accented `Get directions` action, opening the verified map link in a new tab with `rel="noreferrer"`.
- Full 3:2 image panel with `object-contain` or an uncropped responsive image treatment, no overlay text.
- Caption below, never on top of the image.

**Step 2: Preserve visual consistency**

Use the existing navy, gold, warm-neutral palette, with a restrained border and shadow only. Do not add an image gallery or a lightbox, per the approved recommendation.

### Task 3: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run release verification**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Verify hosted-asset status, byte equality and image dimensions using a short Python script. Confirm no local oversized venue image entered `client/public`.

**Step 2: Review responsive presentation**

Capture `/` at desktop and 390px mobile viewports. Ensure all four venue photos in the composite are visible, no overlay text obscures the image, and the directions action is usable.

**Step 3: Save a WebDev checkpoint**

Save a descriptive checkpoint after all verification is complete.
