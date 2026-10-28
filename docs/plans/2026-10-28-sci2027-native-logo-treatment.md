# SCI 2027 Native Logo Treatment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Use the user-approved SCI2027.png as the official public conference logo in its complete native rectangular form, with no circular mask, crop or edge clipping in the header, homepage hero or footer.

**Architecture:** Copy the supplied official PNG unchanged into the public logo assets with a content-hashed filename. Update `assets.sci2027Logo` to that local source. Change the existing header, hero and footer logo image treatments to preserve its natural aspect ratio with `w-auto` and `object-contain`, no rounding, no extra white base and no crop. Keep the separate SCI 2027 header wordmark and all other brands unchanged.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vitest, Vite.

**Confirmed scope:** Public SCI 2027 logo in the header, homepage hero and footer only. The updated logo will be slightly larger in the hero and footer for legibility. Do not alter the Conference Organization Unit mark, Cairo University mark, posters, copy, navigation or card layouts.

---

### Task 1: Create a failing native-logo regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require `assets.sci2027Logo` to resolve to a local content-hashed `/sci-2027/logos/sci2027-logo.<hash>.png` path that exists under `client/public`. Move it from the hosted-asset test set to the local-asset test set. Require the three public logo elements to use `object-contain` and `w-auto`, and prohibit `rounded-full`, `bg-white`, `p-1`, or `object-cover` on the logo element itself.

**Step 2: Run and verify the test fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the existing logo source is hosted and its three current treatments still use a white padded circular form.

### Task 2: Add the official supplied logo unchanged

**Files:**
- Source: `/home/ubuntu/upload/SCI2027.png`
- Create: `client/public/sci-2027/logos/sci2027-logo.<8-char-sha256>.png`

**Step 1: Preserve the original pixels**

Compute the source SHA-256. Copy the image without transformation to a filename containing its first eight hex characters. Verify the target is byte-identical to the uploaded original. Do not use the visual file viewer for the user-provided image.

### Task 3: Apply the native logo treatment

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/components/Sci2027Header.tsx`
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/components/Sci2027Footer.tsx`

**Step 1: Change the data source**

Point `assets.sci2027Logo` to the new hashed local public file.

**Step 2: Update the three public display treatments**

- Header: `h-11 w-auto object-contain`, no circle, no white base, no clipping.
- Homepage hero: larger `h-24 w-auto object-contain`, no circle, no white base, no clipping.
- Footer: larger `h-20 w-auto object-contain`, no circle, no white base, no clipping.

Preserve meaningful alt text. Keep the separate header text label.

### Task 4: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Verify the local public logo file is byte-identical to `/home/ubuntu/upload/SCI2027.png`, all three display elements have native non-circular containment, and none uses crop/rounded/white-pad classes.

**Step 2: Visual review**

Capture desktop and mobile header/hero screenshots and inspect the footer. Confirm the entire molecule, SCI 2027 wordmark and Science at the Core of Innovation line are visible in all three locations.

**Step 3: Checkpoint**

Mark checklist items complete and save a WebDev checkpoint only after all checks pass.

### Task 5: Checkpoint-safe managed hosting for the approved logo

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`
- Delete after verified upload: `client/public/sci-2027/logos/sci2027-logo.<8-char-sha256>.png`

**Context:** The approved PNG is larger than the WebDev checkpoint limit for local public media. The user has confirmed that the original has been uploaded to the project File Storage panel. Use a managed public upload of the byte-identical source for the runtime website, then remove the oversized local copy that blocks checkpoint saving.

**Step 1: Write a failing hosted-asset regression test**

Move `sci2027Logo` back to the hosted asset set. Require an `https://` URL, retain all native-aspect display requirements, and assert that the former local content-hashed copy is absent from `client/public`.

**Step 2: Verify the test fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the running source currently references the local public PNG.

**Step 3: Host and verify the source**

Upload `/home/ubuntu/upload/SCI2027.png` with `manus-upload-file`, validate HTTP success and SHA-256 equality between the source and hosted bytes, then point `assets.sci2027Logo` to the hosted URL.

**Step 4: Remove only the checkpoint-blocking local generated copy**

Remove the local public copy and stale `dist` output. Rebuild `dist` after the source change. Do not modify the original user upload or the user’s File Storage copy.

**Step 5: Re-run release checks and checkpoint**

Run the Task 4 validation, ensure no public local PNG over 1 MB remains, then save a WebDev checkpoint.
