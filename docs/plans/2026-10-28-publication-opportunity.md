# Global Journal of Scientific Research Publication Opportunity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an English-only SCI 2027 Publication Opportunity section after Scientific Tracks, directing interested conference researchers to the Global Journal of Scientific Research (GJSR) without representing publication as guaranteed.

**Architecture:** Store the approved editorial copy and official GJSR URL in `sci2027Content.ts`. Render one information card after the tracks section and before the preliminary programme, using an external button and the supplied qualification statement. No interest data will be collected and no publishing workflow will be created.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide icons, Vitest.

---

### Task 1: Add the publication opportunity regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

1. Require the exact `Global Journal of Scientific Research (GJSR)` title, official URL, CTA, approved interest sentence, and editorial/peer-review notice.
2. Require `Sci2027Home.tsx` to render the content source after the tracks text and before the preliminary programme section.
3. Run `pnpm exec vitest run client/src/data/sci2027Content.test.ts`; expect failure because no publication record or rendering exists.

### Task 2: Add the approved source record and information card

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

1. Add a `publicationOpportunity` record with approved copy, peer-review notice, CTA, and `https://gjsr.journals.ekb.eg`.
2. Add an editorial navy-and-gold publication card after the Scientific Tracks section and before the programme section.
3. Open the journal link in a new tab using safe `noreferrer` handling.
4. Do not collect personal data or present the opportunity as an acceptance or submission workflow.

### Task 3: Verify and checkpoint

**Files:**
- Modify: `todo.md`

1. Run focused and full Vitest suites, TypeScript check, production build, and `git diff --check`.
2. Verify the journal URL returns an accessible response or record bot protection accurately without changing the link.
3. Capture desktop and mobile views; confirm track → publication opportunity → preliminary programme order and readable copy.
4. Complete checklist entries and save a WebDev checkpoint.

## External-link verification note

On 28 October 2026, the official URL provided by the organizer (`https://gjsr.journals.ekb.eg`) was retained exactly. Search indexing identifies it as **Global Journal of Scientific Research**. The Sandbox HTTP client encountered `SSLEOFError: UNEXPECTED_EOF_WHILE_READING`, and the Sandbox browser received `ERR_CONNECTION_CLOSED`; an earlier text extraction reached the same domain but displayed an anti-bot rejection message. These remote-server responses do not change the approved URL or the on-site external-link markup.
