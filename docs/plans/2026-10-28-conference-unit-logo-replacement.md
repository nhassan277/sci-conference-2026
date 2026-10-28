# Conference Organization Unit Logo Replacement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current Conference Organization Unit logo in the SCI 2027 homepage Unit section with the approved attached circular `logo.png`, displayed more prominently inside a white rounded container.

**Architecture:** Store the user-provided official logo as a locally served, content-hashed public asset. Update the `conferenceUnitLogo` source-of-truth path and modify only the Unit-section logo container. Do not alter the SCI 2027 logo, Cairo University logo, header identity, or any other public mark.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vitest, Vite.

**Source asset:** User-provided `/home/ubuntu/upload/logo.png`, confirmed for use in the Conference Organization Unit section only on 28 October 2026.

---

### Task 1: Add a failing logo-asset and UI regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require `conferenceUnitLogo` to be a local hashed path under `/sci-2027/logos/conference-unit-logo.<hash>.png`, require the file to exist in `client/public`, and require the homepage source to retain the Unit logo binding while using an enlarged white rounded container (`h-20 w-20`). Move the asset key from the hosted-asset expectation to the local-asset expectation.

**Step 2: Run and verify the test fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the old Unit logo is currently hosted and its existing container is smaller.

### Task 2: Store and reference the approved circular logo

**Files:**
- Create: `client/public/sci-2027/logos/conference-unit-logo.<hash>.png`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Copy without modifying the original**

Calculate the SHA-256 digest, use its first eight lowercase hex characters in the public filename, and copy the exact user-provided PNG. Do not crop, edit, or overwrite the user source image.

**Step 2: Update source-of-truth asset path**

Point `assets.conferenceUnitLogo` to the new local public PNG path.

### Task 3: Refine only the Unit-section logo treatment

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Update display container**

Change only the Unit logo’s container to an approximately 80px white, rounded rectangle with measured padding. Keep `object-contain` so the full circular logo remains visible, and retain the descriptive alternative text.

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

Verify the new logo asset hash matches the user-provided source bytes and that no other logo source path changed.

**Step 2: Visual review**

Capture desktop and mobile homepage screenshots to confirm the Unit logo is clear and fully visible in its larger rounded white container.

**Step 3: Checkpoint**

Mark checklist items complete and save a WebDev checkpoint only after all checks pass.
