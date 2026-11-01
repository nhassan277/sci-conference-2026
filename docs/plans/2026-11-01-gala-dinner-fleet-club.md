# Gala Dinner at Fleet Club El Gezira Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an English-only Gala Dinner on the Nile section for the existing EGP 650 optional add-on, introducing Fleet Club El Gezira with a location action, date/time-to-be-announced status, and a manually navigated image gallery.

**Architecture:** Add a central `galaDinner` record to `sci2027Content.ts`, preserving the existing `registrationFees.addOns` price source. Convert only the seven approved venue/promotional photos to optimized WebP derivatives in temporary storage; do not include, upload, or reference the Facebook screenshot. Upload to managed public storage and keep original uploads unmodified. Render a section between fees and the registration forms, using a semantic gallery with manual Previous/Next buttons, page dots, visible image alt text, and no automatic motion.

**Tech Stack:** React, TypeScript, Tailwind CSS, lucide-react, Pillow, managed public storage, Vitest, Vite.

---

### Task 1: Define the public content and placement contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write failing test**

Require a central `galaDinner` record with:

```ts
{
  title: "Gala Dinner on the Nile",
  venue: "Fleet Club El Gezira",
  addOnAmount: "EGP 650",
  dateTimeStatus: "Date and time to be announced",
  location: "Zamalek, close to Opera Square, 4th of Maglis Qeyadit El Thawra St., Cairo, Egypt",
  images: /* seven HTTPS records */,
}
```

Require the section ID `gala-dinner` to appear after `id="registration-fees"` and before `id="registration"`, use the central `galaDinner.images`, have labeled manual gallery controls and dots, preserve `registrationFees.addOns`, and contain no Fleet Club phone, Instagram handle, or Facebook screenshot filename.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because no gala-dinner record or section exists.

### Task 2: Create managed image derivatives without altering originals

**Files:**
- Sources (do not modify):
  - `/home/ubuntu/upload/IMG_0013.JPG`
  - `/home/ubuntu/upload/IMG_0012.JPG`
  - `/home/ubuntu/upload/IMG_0011.JPG`
  - `/home/ubuntu/upload/IMG_0010.JPG`
  - `/home/ubuntu/upload/IMG_0008.JPG`
  - `/home/ubuntu/upload/1916327e-a32d-4ab0-bb03-7217886e6e58.jpg`
  - `/home/ubuntu/upload/IMG_0007.JPG`
- Exclude: `/home/ubuntu/upload/IMG_0014.PNG`
- Create: `/tmp/sci2027-gala-dinner/*.webp`

**Step 1: Convert copies**

Use Pillow to apply EXIF transpose and encode each approved source as WebP. Preserve original aspect ratios and pixels without crop, overlay, generated editing, or overwrite.

**Step 2: Verify and upload**

Record local dimensions and checksums, upload all seven derivative WebPs via managed public storage, download each hosted result once, and prove byte-level equality with its local derivative.

### Task 3: Implement the responsive section and manual gallery

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Add central data**

Create a source record containing the approved English copy, EGP 650, date/time-to-be-announced label, exact address, Google Maps search action, primary image, and six gallery records with descriptive English alt text. Do not include a telephone number, Instagram handle, Facebook screenshot, booking, payment, or reservation workflow.

**Step 2: Add the section**

Insert `id="gala-dinner"` after registration fees and before registration forms. Render one primary image and a manual gallery that shows one image at a time with accessible Previous/Next buttons, dots, image position status, and no automatic cycling. Use `object-contain` where needed so supplied text-bearing promotional art is never cropped.

**Step 3: Verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 4: Review and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Visual review**

Review desktop and 390px views. Confirm the section location, EGP 650 optional add-on, location action, to-be-announced status, primary image, all seven images reachable manually, no Facebook screenshot, and no automatic cycling.

**Step 2: Release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 3: Checkpoint**

Mark the focused tasks complete and save a WebDev checkpoint.
