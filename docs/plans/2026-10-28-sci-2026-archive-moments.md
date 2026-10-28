# SCI 2026 Archive Moments Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the public SCI 2026 certificate-request experience and replace it with an English-only `SCI 2026 in Moments` archive gallery of real conference photographs, with a click-to-expand viewer and a route to the full archive.

**Architecture:** Preserve the certificate records, server procedures, and existing admin certificate tools. Remove only the public `/certificate-request` route and all SCI 2027 public references. Reuse ten curated CDN image URLs from `GALLERY_PHOTOS` rather than copying media, and render them in the SCI 2026 archive page with a small client-side lightbox.

**Tech Stack:** React 19, TypeScript, Wouter, Tailwind CSS, Lucide, Vitest, Vite.

---

### Task 1: Define public archive and certificate-removal requirements in a failing test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write a failing test**

Require that:

```ts
expect(sci2027Content.archive.description.en).not.toContain("certificate");
expect("certificateUrl" in sci2027Content.archive).toBe(false);
```

Require the archive source to include `SCI 2026 in Moments`, `GALLERY_PHOTOS`, a ten-image `featuredGalleryIndices` collection, a full-gallery route, and interactive selected-photo state. Require neither the archive nor router source to retain public `/certificate-request` or `CertificateRequest` strings.

**Step 2: Run the test and verify it fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because public certificate references and the old archive card remain.

### Task 2: Remove public certificate-request references without deleting records

**Files:**
- Modify: `client/src/App.tsx`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Remove public route and data reference**

- Remove the `CertificateRequest` page import and `/certificate-request` public route.
- Remove `certificateUrl` from the SCI 2027 archive content and revise the archive description to photo-only language.
- Do not alter `server/routers.ts`, certificate database tables, admin certificate pages, or historical records.

### Task 3: Rebuild the archive resource area around a curated photo gallery

**Files:**
- Modify: `client/src/pages/Sci2026Archive.tsx`

**Step 1: Add curated archive media**

- Import `GALLERY_PHOTOS`.
- Use gallery indices `1, 29, 110, 150, 178, 209, 238, 338, 353, 421` as zero-based JavaScript indices adjusted to the source array, covering awards, participants, hands-on learning, speaker sessions, posters, audience, and collaboration.
- Keep image URLs hosted on their original conference CDN.

**Step 2: Replace certificate card with `SCI 2026 in Moments`**

- Retain one clear link to the full gallery.
- Add a visual editorial gallery with ten event photos, dense on desktop and readable on mobile.
- Open any selected photo in an accessible full-size overlay with close control, Escape support, and descriptive alternative text.
- Use English-only copy throughout.

### Task 4: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Complete release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Use grep to prove no public route or public archive reference exposes `/certificate-request`; preserve certificate backend and admin source files.

**Step 2: Review the archive page visually**

Capture desktop and mobile screenshots of `/archive-2026`. Open an image, confirm full-size view, and close it with Escape.

**Step 3: Checkpoint**

Mark checklist items complete and save a WebDev checkpoint after verification succeeds.
