# SCI 2027 Registration Fees and Payment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an English-only SCI 2027 Registration Fees & Payment section directly before registration, with the approved fee categories, optional publication fee, Central Bank of Egypt InstaPay payment identifier, and receipt-confirmation email instructions.

**Architecture:** Add one typed-like `registrationFees` content record to `client/src/data/sci2027Content.ts`, then render it as a public informational section in `Sci2027Home.tsx`. It is not a checkout page, payment form, receipt uploader, or payment database workflow. The site will direct users to email proof of transfer to the official conference inbox.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide icons, Vitest.

---

### Task 1: Define the red regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

1. Add one test that requires the exact three registration fees, the EGP 2,000 publication fee marked as additional and payable only after journal acceptance, the approved CBE/InstaPay identifier, confirmation email, and receipt metadata.
2. Require the homepage to render the data source before `id="registration"`, with an email action and no payment gateway/create-checkout call.
3. Run `pnpm exec vitest run client/src/data/sci2027Content.test.ts`; confirm failure because the fee record does not exist.

### Task 2: Implement source data and public fee/payment card

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

1. Add `registrationFees` with:
   - Students — EGP 300
   - Recent Graduates & Teaching Assistants — EGP 600
   - Researchers & Faculty Members — EGP 1,200
   - Optional publication fee — EGP 2,000, in addition to registration and only after journal acceptance.
2. Add the approved payment record: InstaPay, Central Bank of Egypt (CBE), `9450882167`, `sci.conf.2027@gmail.com`, receipt details, and payment-review confirmation wording.
3. Render an editorial navy-and-gold section before the existing registration forms. Use a clear visual distinction between conference registration fees and the conditional publication fee.
4. Use a `mailto:` link to the approved conference inbox; do not create a payment gateway, public receipt upload, account table, or data-collection form.

### Task 3: Verify, visually review, and checkpoint

**Files:**
- Modify: `todo.md`

1. Run focused test, all tests, `pnpm check`, `pnpm build`, and `git diff --check`.
2. Programmatically assert the payment identifier, email, exact fees, conditional publication-fee wording, and section order before registration.
3. Review full desktop and mobile screenshots for readable fee categories and payment instructions.
4. Complete the relevant checklist entries and save a WebDev checkpoint.
