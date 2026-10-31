# Registration Fee Matrix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the SCI 2027 registration-fee cards with the approved three-by-three registration matrix, clarify the conditional combined GJSR publication option, and add the optional Gala dinner and Museum visit add-ons while retaining the existing payment-proof workflow.

**Architecture:** Replace the old category-plus-separate-publication-fee model in `sci2027Content.registrationFees` with a semantic pricing matrix: registration options as rows and attendee groups as columns. Preserve payment data and confirmation instructions unchanged. Render the matrix as an accessible horizontally scrollable table on narrow viewports and update the separate Publication Opportunity callout to reference the new combined registration pathway, not an obsolete additional flat fee.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Vitest.

---

### Task 1: Define the approved fee-matrix regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Replace the former fee assertions with a contract that requires:
- three attendee groups: Undergraduate, Postgraduate, and Prof. & Faculty / Researchers;
- the exact registration-option matrix: Attendance (EGP 250 / 400 / 1,000), Attendance + presenting (EGP 350 / 500 / 1,500), and Attendance + GJSR publication (Not available / EGP 750 / EGP 2,000);
- a condition that the publication pathway is a combined attendance option and remains subject to GJSR acceptance;
- optional add-ons: Gala dinner (EGP 650; every category) and Museum visit (Price to be announced); and
- the payment record and email-confirmation workflow remaining unchanged.

Require source evidence for accessible `<table>` rendering, the matrix mapping, the no-longer-additional publication wording, and the two add-on cards.

**Step 2: Run focused test to confirm RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the current source still publishes the retired EGP 300 / 600 / 1,200 category cards and a separate additional publication fee.

### Task 2: Update central fee data and the GJSR callout

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Replace data model**

Create column metadata and three exact registration-option rows in `registrationFees`. Add an explicit publication condition explaining that the `Attendance + GJSR publication` totals include attendance and remain conditional on GJSR editorial and peer-review acceptance. Add approved optional add-ons, without altering `payment`, `receiptDetails`, `confirmationNote`, or `confirmationEmail`.

**Step 2: Update presentation**

Replace category cards and the separate flat-fee publication card with:
- a responsive semantic fee matrix with visible row and column headers;
- a concise publication-acceptance notice and link to the GJSR opportunity; and
- two optional-add-on cards for the Gala dinner and Museum visit.

Update the GJSR opportunity callout to point to the combined registration path rather than presenting an obsolete additional publication fee. Retain the official journal link and editorial/peer-review notice.

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

**Step 2: Review responsive presentation**

At desktop and narrow-mobile widths, verify the table headers, three fee rows, Not available cell, GJSR acceptance wording, both optional add-ons, and unchanged payment-proof action.

**Step 3: Save checkpoint**

Mark the three tracked tasks complete and save a descriptive WebDev checkpoint.
