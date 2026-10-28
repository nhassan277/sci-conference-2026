# SCI 2027 Call for Abstracts Submission Routes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the SCI 2027 Call for Abstracts copy with the approved English requirements and route abstract submissions through the existing Speaker and Student Research forms on the homepage only.

**Architecture:** Update the `abstractCall` and registration content records in `client/src/data/sci2027Content.ts`; use an array of submission options rather than a third submission form. Replace the current publication-oriented companion card in `Sci2027Home.tsx` with two safe external submission buttons. No deadline, backend submission route, database workflow, or preliminary-programme change is included.

**Tech Stack:** React, TypeScript, Tailwind CSS, Wouter, Lucide, Vitest.

---

### Task 1: Write the red regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

1. Require the approved title, eligibility sentence, five abstract requirements, and the status that abstracts are submitted through the relevant SCI 2027 form below.
2. Require two routes: `Submit a Speaker Abstract` using the existing speaker form, and `Submit Student Research / Thesis / Project` using the existing student-research form.
3. Require the speaker registration card to read `Speaker & Abstract Submission` and describe the approved researcher, academic, and industry-professional audience.
4. Require the homepage to render both call-to-action links and retain external-link safety attributes.
5. Run `pnpm exec vitest run client/src/data/sci2027Content.test.ts`; confirm failure due to the former abstract wording and missing submission routes.

### Task 2: Implement source data and homepage presentation

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

1. Replace `abstractCall` with the approved English copy:
   - title: `Share your research. Shape the future.`
   - eligibility: researchers, academics, postgraduate and undergraduate students, and industry professionals.
   - requirements: English, 300-word maximum, author/affiliation/contact details, 3–5 keywords, and the requested structured summary.
   - status: `Abstract submissions are accepted through the relevant SCI 2027 form below.`
2. Add two submission options using the existing Google Forms, no new form URLs.
3. Rename the display name of the existing speaker form to `Speaker & Abstract Submission` and explain its audience.
4. Replace the former companion card with a dark, high-contrast submission panel containing the two buttons. Keep the Call for Abstracts on the homepage only.

### Task 3: Verify, review, and checkpoint

**Files:**
- Modify: `todo.md`

1. Run focused Vitest coverage, all tests, `pnpm check`, `pnpm build`, and `git diff --check`.
2. Assert exact title, both existing URLs, button labels, homepage-only scope, and the absence of a deadline.
3. Review full-page desktop and mobile screenshots for readable requirements and unambiguous form routing.
4. Complete the relevant checklist entries and save a WebDev checkpoint.
