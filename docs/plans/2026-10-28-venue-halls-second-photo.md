# SCI 2027 Venue & Halls Second Photograph Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the second supplied Conference Center composite alongside the existing Venue & Halls image and publish the eight additional venue photographs in a responsive gallery, preserving every supplied image composition without crop or overlays.

**Architecture:** Replace the single `venueVisual` record in the central SCI 2027 location data with a two-item `venueVisuals` array, and add a separate eight-item `venueGallery` array. Each record carries its hosted URL and accessible text, while the two hero venue images also carry captions. The homepage maps the primary visuals into a two-column desktop grid and the gallery into a four-column desktop, two-column mobile grid, while reusing the existing venue description and Google Maps action.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, PIL/Pillow, Manus managed file hosting.

---

### Task 1: Test the two-image Venue & Halls contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Write the failing test**

Replace the current singular venue-image expectation with a two-item `venueVisuals` array. Require both URLs to be HTTPS, both source labels to be `SCI 2027 venue photograph`, and captions for the auditorium facilities and the entrance, registration lobby, meeting room and auditorium facilities. Require the homepage to map the visuals and use `sm:grid-cols-2` without an image crop class.

**Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: failure because the second record and grid rendering are absent.

**Step 3: Create and host the web derivative**

- Create `/home/ubuntu/sci2027-venue-halls-second/venue-halls-entrance.webp` from `/home/ubuntu/upload/pasted_file_cB6PbF_image.png`.
- Preserve the original 1254×1254 square composition; do not crop, resize, annotate or overwrite the source.
- Upload the derivative to managed hosting.
- Verify HTTP success, byte equality against the local derivative, and square dimensions.

**Step 4: Add central data and rerun focused tests**

Add both venue records to `identity.location.venueVisuals`, then rerun the focused test until it passes.

### Task 2: Render the responsive two-image gallery

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Render the visual array**

Map `identity.location.venueVisuals` into `grid gap-5 sm:grid-cols-2`. Preserve each image’s natural aspect ratio with `className="block h-auto w-full"`; no `object-cover`, fixed image height or text overlay.

**Step 2: Render captions below each image**

Keep both captions below their image panels and retain the section’s current text and safe `Get directions` action unchanged.

### Task 3: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run full release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Verify both hosted assets byte-for-byte against local WebP derivatives and confirm no venue image is in `client/public`.

**Step 2: Review visual result**

Review desktop and mobile renderings to confirm two columns at desktop, one column at mobile, both composite images complete, captions below, and no overlay/cropping.

**Step 3: Save checkpoint**

Create a WebDev checkpoint after successful verification, then remove only temporary image-processing files.

### Task 4: Add the eight-image venue gallery

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Write the failing test**

Require an eight-item `venueGallery` array with managed HTTPS URLs, descriptive alternate text and the SCI 2027 venue-photograph source. Require `Explore the Venue`, `identity.location.venueGallery.map`, and a two-column mobile/four-column desktop grid in the homepage.

**Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: failure because the gallery record and mapped gallery do not exist.

**Step 3: Create and host eight uncropped WebP derivatives**

- Extract the eight JPEGs from `/home/ubuntu/upload/WhatsAppUnknown2026-10-28at19.45.22.zip` safely into a temporary workspace.
- Re-encode each image as WebP at its original dimensions, without crop, resize, annotation or source overwrite.
- Upload each WebP to managed hosting and verify byte equality and retained dimensions.

**Step 4: Implement the gallery and rerun focused tests**

Add the eight hosted records to `identity.location.venueGallery`. Render them after the two primary images under `Explore the Venue` in a `grid-cols-2 lg:grid-cols-4` responsive grid. Each image must retain `h-auto w-full`, use a meaningful `alt`, and have no text or controls over the image.

**Step 5: Run full verification and save checkpoint**

Run the complete test suite, TypeScript check, production build and whitespace check. Review desktop and mobile visual output, remove only temporary files, update `todo.md`, then save a WebDev checkpoint.
