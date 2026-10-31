# Updated English Brochure Google Drive Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish the organizer-supplied `SCI2027_Trifold_Brochure_EN.pdf` through a public, direct Google Drive download URL and replace the English SCI 2027 brochure link in every existing public location, while preserving the Arabic brochure unchanged.

**Architecture:** Upload the provided binary to the authorized Google Drive account with the original filename and grant non-discoverable public reader access. Store only the new direct-download URL in the central `sci2027Content.assets.brochureEnglish` record; existing homepage, programme and footer actions already resolve through that source. The brochure is an updated attachment, not an authorization to overwrite separately confirmed public-page content that conflicts with it.

**Tech Stack:** Google Workspace CLI (`gws`), React, TypeScript, Vitest, Poppler PDF utilities.

---

### Task 1: Inspect, compare and host the supplied brochure

**Files:**
- Read: `/home/ubuntu/upload/SCI2027_Trifold_Brochure_EN.pdf`
- Modify externally: Google Drive file storage

**Step 1: Validate the supplied PDF**

Run `pdfinfo`, `pdftotext -layout`, and a SHA-256 checksum. Confirm the file is a readable two-page A4 PDF and identify key content for an audit.

**Step 2: Compare key information to confirmed web content**

Compare date, registration-fee, publication, venue, contact, and add-on statements against the current central site source. Preserve explicitly confirmed site data in the presence of a contradictory brochure statement; document discrepancies in the checkpoint message.

**Step 3: Upload and share the binary**

Use `gws drive files create --upload` with `application/pdf`, then create a `type: anyone`, `role: reader`, `allowFileDiscovery: false` permission. Record the returned Drive file ID and use `https://drive.google.com/uc?export=download&id=<fileId>` as the public direct-download endpoint.

**Step 4: Verify remote asset identity**

Download the new direct endpoint outside the project and compare the SHA-256 checksum with the supplied attachment. Confirm a PDF response and that the file does not reside on Manus CDN.

### Task 2: Test and update the central brochure URL

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Write the failing regression test**

Replace the old Drive file ID assertion with the newly uploaded file ID. Require a direct Google Drive download URL, prohibit the retired file ID and Manus CDN URL, retain the existing local Arabic asset assertion, and retain proof that homepage, programme and footer consume `brochureEnglish` centrally.

**Step 2: Run focused test to confirm RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the source still points to the retired Drive file ID.

**Step 3: Update the central English brochure record**

Replace only `assets.brochureEnglish` with the verified new direct-download URL. Do not change `brochureArabic` or any consuming component.

**Step 4: Run focused test to confirm GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Release verification and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Verify the site and asset**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Use a fresh browser or HTTP fetch to confirm the homepage, programme and footer links resolve to the exact central new URL. Confirm remote bytes match the supplied PDF checksum.

**Step 2: Complete tracking and checkpoint**

Mark the three brochure-update tasks complete and save a descriptive WebDev checkpoint. Include the single discrepancy retained for organizer review: the supplied PDF mentions a Grand Egyptian Museum visit on Friday, 9 April, but the website retains the previously confirmed Saturday, 10 April programme text.
