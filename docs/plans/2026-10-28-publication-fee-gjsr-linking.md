# SCI 2027 Publication Fee and GJSR Linking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a clear, bidirectional on-page connection between the optional EGP 2,000 publication fee and the Global Journal of Scientific Research (GJSR) publication opportunity.

**Architecture:** Retain one source of truth for the fee at `registrationFees.publicationFee`. Add only two label records in the content model, then expose internal-anchor navigation in `Sci2027Home.tsx`: fee card → GJSR opportunity and GJSR fee callout → payment details. The editorial and peer-review requirement remains visible; no payment action, acceptance promise, or new form is added.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Red regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

1. Require the fee-to-opportunity and opportunity-to-payment labels.
2. Require `publication-opportunity` and `registration-fees` IDs, both corresponding internal anchors, the EGP 2,000 figure, and conditional-acceptance wording in the GJSR section.
3. Run `pnpm exec vitest run client/src/data/sci2027Content.test.ts`; confirm failure because no bidirectional anchors or GJSR fee callout exist.

### Task 2: Content and UI implementation

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

1. Add the approved internal-link labels to the relevant content records.
2. Apply `id="publication-opportunity"` to GJSR and `id="registration-fees"` to payment.
3. Add a small GJSR fee callout reusing `registrationFees.publicationFee.amount` and description, followed by a `View payment details` internal link.
4. Add `Learn about the publication opportunity` in the fee card, leading to GJSR.
5. Preserve external journal link, editorial/peer-review notice, and payment confirmation workflow unchanged.

### Task 3: Verify, review, and checkpoint

**Files:**
- Modify: `todo.md`

1. Run focused test, all tests, TypeScript check, build, and whitespace check.
2. Assert both anchors, exact EGP 2,000 value, existing conditional fee wording, and unchanged external journal action.
3. Capture full desktop/mobile pages and inspect the link and fee-callout hierarchy.
4. Complete checklist entries and save a WebDev checkpoint.
