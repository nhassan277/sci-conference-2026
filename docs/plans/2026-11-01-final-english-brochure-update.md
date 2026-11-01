# Final English Brochure Update Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace every public SCI 2027 English brochure download with the user-supplied final PDF while retaining the Arabic brochure unchanged.

**Architecture:** The central `sci2027Content.assets.brochureEnglish` field supplies the homepage, programme page and footer. Upload the supplied final PDF as a new public-read Google Drive file and use its direct-download URL in that one field; do not delete or overwrite previously uploaded files.

**Tech Stack:** React, TypeScript, Google Drive via gws, PDF metadata/text extraction, Vitest, Vite.

---

### Task 1: Validate the incoming brochure and define a failing contract

**Files:**
- Source (do not modify): `/home/ubuntu/upload/SCI2027_Trifold_Brochure_EN.pdf`
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Inspect the PDF safely**

Record page count, basic metadata, SHA-256 and searchable text with `pypdf`/`pdftotext`; do not alter the supplied PDF.

**Step 2: Write the failing test**

Require a newly created Google Drive direct-download file ID in `brochureEnglish`, reject the retired Drive ID, retain `brochureArabic`, and preserve central consumption by homepage, programme and footer.

**Step 3: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the old direct-download file ID remains in central content.

### Task 2: Upload and publish the final English PDF

**Files:**
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Upload**

Use the session’s preconfigured `gws drive files create` with correct PDF metadata. Create a new file—do not delete or mutate the prior brochure file.

**Step 2: Grant public read access**

Create an `anyone` / `reader` permission and build a direct-download URL from the returned file ID.

**Step 3: Verify exact bytes**

Download the public direct endpoint once and compare its SHA-256 against the supplied PDF. Confirm the Drive file metadata and public permission.

**Step 4: Update source of truth**

Replace only `assets.brochureEnglish`; preserve `assets.brochureArabic` unchanged.

### Task 3: Verify public actions and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

**Step 2: Inspect visible link actions**

Verify homepage, programme and footer resolve through the same new direct-download URL and retain the `download` attribute.

**Step 3: Release checks and checkpoint**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Mark the focused tasks complete and save a WebDev checkpoint.

### Task 4: Align the public schedule and abstract milestones with the confirmed brochure

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/pages/Sci2027Programme.tsx`
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write failing contracts**

Require the four confirmed dates: abstract submission opens 1 November 2026; abstract deadline 7 March 2027; abstract review results 15 March 2027; attendee registration deadline 25 March 2027. Require the optional Grand Egyptian Museum visit on Friday 9 April 2027 and post-conference workshops on Saturday 10 April 2027.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the source still shows provisional deadlines and assigns the cultural visit to 10 April.

**Step 3: Minimal implementation**

Replace the provisional milestone list and submission notices with the four confirmed dates. Retain the four programme days (6, 7, 8 and 10 April), add a distinct `culturalVisit` record for Friday 9 April, remove the museum visit from the 10 April workshop schedule, and render the optional visit beside the workshop details on the homepage and Programme page. Update the museum add-on detail to state Friday 9 April.

**Step 4: Verify GREEN and visual presentation**

Re-run the focused test. Review the Important Dates section and the programme/workshop cards on desktop and mobile to confirm clear separation of 9 April cultural visit and 10 April workshops.
