# SCI 2027 Logo Containment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure the official high-resolution SCI 2027 logo is fully visible within circular treatments in the header, homepage hero and footer, without any content being cropped.

**Architecture:** Retain the existing hosted official `sci2027Logo` source. Replace `object-cover` with `object-contain` for every public circular SCI 2027-logo treatment, add a white circular base and safe inner padding, and keep the separate `SCI 2027` wordmark in the header for legibility.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vitest, Vite.

**Confirmed scope:** Apply to the public header, homepage hero and footer only. Do not use the low-resolution uploaded screenshot as a replacement source. Do not change Conference Organization Unit, Cairo University, poster, or other branding.

---

### Task 1: Create a failing logo-containment regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require all three public uses of `sci2027Logo` (header, homepage hero and footer) to include `object-contain`, a white base and inner padding. Assert they do not retain `object-cover` on the SCI 2027 logo image. Preserve the existing assertion that this official logo remains a hosted public asset.

**Step 2: Run and verify the test fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the three current treatments use `object-cover` and can crop the logo.

### Task 2: Apply the full-logo circular treatment

**Files:**
- Modify: `client/src/components/Sci2027Header.tsx`
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/components/Sci2027Footer.tsx`

**Step 1: Replace cropping behavior**

For the three existing `<img>` elements sourcing `sci2027Logo`:

- retain their existing width/height emphasis;
- use `rounded-full bg-white p-1 object-contain` rather than `object-cover`;
- retain appropriate border/shadow styling per placement;
- keep descriptive `alt="SCI 2027"` or `alt="SCI 2027 logo"` text;
- do not change adjacent text, navigation or other visual assets.

### Task 3: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Verify the official hosted SCI 2027 logo remains unchanged, every public circular treatment uses `object-contain`, and no `object-cover` remains on the three logo elements.

**Step 2: Visual review**

Capture desktop and mobile screenshots. Confirm the entire SCI 2027 mark is legible inside its circle in the header, hero and footer without clipping.

**Step 3: Checkpoint**

Mark checklist items complete and save a WebDev checkpoint only after all checks pass.
