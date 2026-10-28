# SCI 2027 Final English Brochure Replacement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace every public English-brochure reference with the user-supplied final PDF, retain the Arabic brochure, and identify brochure-content differences requiring explicit editorial confirmation.

**Architecture:** Host the final English PDF through managed public storage rather than retaining another large local public asset. Update the central `assets.brochureEnglish` URL so all existing buttons automatically resolve to the replacement. Remove the previous local English PDF while retaining the Arabic PDF. Keep current website facts unchanged where the new brochure conflicts with later user-approved website instructions, pending confirmation.

**Tech Stack:** React/TypeScript source-of-truth content, managed public storage, PDF text extraction, Vitest.

---

### Task 1: Compare brochures and record editorial differences

**Files:**
- Read: `client/public/sci-2027/documents/SCI2027-Trifold-Brochure-EN.pdf`
- Read: `/home/ubuntu/upload/SCI2027_Trifold_Brochure_EN_3.pdf`

1. Extract text from both two-page PDFs with `pdftotext -layout`.
2. Compare fee, payment, important-date, workshop, committee and contact statements.
3. Record only factual differences that require a separate user decision: the new PDF includes abstract-submission opening and deadline dates, a final registration deadline, and organizational wording that can conflict with later website-specific approvals.

### Task 2: Red regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

1. Require `assets.brochureEnglish` to be a hosted HTTPS resource.
2. Require the Arabic brochure to remain a local public asset.
3. Require the prior local English PDF path to no longer exist.
4. Run the focused test and confirm failure before implementation.

### Task 3: Managed asset replacement

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Delete: `client/public/sci-2027/documents/SCI2027-Trifold-Brochure-EN.pdf`

1. Upload the supplied final English PDF to managed public storage.
2. Verify that the hosted bytes match the user-supplied PDF.
3. Update `assets.brochureEnglish` to the hosted URL, preserving every existing brochure action through the central source of truth.
4. Delete the old public English PDF only; preserve the Arabic PDF.

### Task 4: Verification and checkpoint

**Files:**
- Modify: `todo.md`

1. Run focused Vitest coverage, all tests, TypeScript check, production build and whitespace check.
2. Verify the final PDF metadata, checksum, public URL response, absence of the retired English local asset, and presence of the Arabic local asset.
3. Inspect all in-code brochure references for the central English-asset use.
4. Save a WebDev checkpoint. Report the identified content differences separately for user confirmation before changing any current deadlines or organizational information.
