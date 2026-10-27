# SCI 2027 Conference Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the existing SCI 2026 public website into the official SCI 2027 international conference site, using the supplied Drive folder as the authoritative source for identity, dates, tracks, programme outline, brochures, posters, and registration forms.

**Architecture:** Retain the existing React/Vite application and its database-backed legacy infrastructure, but replace the public-facing entry experience with a new, self-contained SCI 2027 information architecture. New static conference content will live in a typed data module, local official assets will be served from `client/public/sci-2027`, and visible navigation will route only to the SCI 2027 home, programme, and a clearly labelled SCI 2026 archive. The old database and certificate tooling will remain untouched and available only from archive routes.

**Tech Stack:** React 19, TypeScript, Wouter, Tailwind CSS 4, Lucide React, Vitest, Vite.

---

## Source-of-truth content reconciliation

- **Conference:** SCI 2027, *Science at the Core of Innovation*.
- **Status:** The first international conference of the Faculty of Science, Cairo University.
- **Theme:** *Towards Effective Partnership and Sustainable Impact* / *نحو شراكات فعالة وأثر مستدام*.
- **Dates and venue:** 7–8 April 2027, Cairo University Conference Center, University City, Cairo, Egypt. Workshops and an optional cultural visit are planned for 9 April.
- **Patronage:** Prof. Mohamed Sami Abdel-Sadek, President of Cairo University; Prof. Sohair Ramadan Fahmy, Dean, Faculty of Science, Cairo University.
- **Organizer:** Conference Organization Unit, Faculty of Science, Cairo University; Unit head Prof. Walid Rahouma.
- **Six tracks:** Life Sciences and Biodiversity; Environment and Earth Sciences; Materials and Chemistry; Physics, Energy and Space Sciences; AI, Data Science and Computational Science; Innovation, Entrepreneurship and Science for Society.
- **Important dates:** Early abstract submission, 30 January 2027; late abstract submission, 1 March 2027; registration, 1 March 2027; final abstract deadline, 15 February 2027; abstract results, 15 March 2027; final registration (250-word abstract), 25 March 2027.
- **Published registration forms:** General attendee form and speaker registration form from the supplied Drive folder. No public abstract-submission form URL has been supplied, so the site must not invent one.
- **Contact:** `nyehia@sci.cu.edu.eg`, per current organizer instruction. The site should identify it as an inquiry address only, not as an abstract-submission portal.

## Design direction

**Editorial scientific institutional:** A clear, information-first design based on deep Cairo-blue, sandstone white, and the SCI gold accent. The visual signature is a fine “research network” constellation field over the hero and compact gold rules taken from the official brochure. It will use an elegant editorial serif for display headings, a readable Arabic-friendly sans for body copy, strong bidirectional layout treatment, and intentionally measured motion. The official SCI 2027 poster and logo suite will be used as real identity assets, rather than simulated graphics.

## Task 1: Create the data contract for official SCI 2027 facts

**Files:**
- Create: `client/src/data/sci2027Content.test.ts`
- Create: `client/src/data/sci2027Content.ts`

**Step 1: Write the failing test**

Create a pure TypeScript test asserting that the public content has the correct 2027 dates, six tracks, final registration links, and no SCI 2026 date or closed-registration status in public-facing constants.

**Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: FAIL because `sci2027Content.ts` does not exist.

**Step 3: Implement the minimal content module**

Create typed constants for the conference identity, dual-language labels, six research tracks, milestones, programme-at-a-glance, workshop list, patronage, official form URLs, brochure assets, and archive links. Include a `sourceNote` field so content provenance remains explicit.

**Step 4: Run the test to verify it passes**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add client/src/data/sci2027Content.ts client/src/data/sci2027Content.test.ts
git commit -m "feat: add verified SCI 2027 conference content"
```

## Task 2: Add and verify the official local asset set

**Files:**
- Create: `client/public/sci-2027/detailed-poster.png`
- Create: `client/public/sci-2027/simple-poster.png`
- Create: `client/public/sci-2027/logos/cairo-university.jpg`
- Create: `client/public/sci-2027/logos/conference-unit-horizontal.png`
- Create: `client/public/sci-2027/logos/conference-unit-vertical.png`
- Create: `client/public/sci-2027/logos/sci-2027.png`
- Create: `client/public/sci-2027/logos/sci-master-logo.jpg`
- Create: `client/public/sci-2027/documents/SCI2027-Trifold-Brochure-EN.pdf`
- Create: `client/public/sci-2027/documents/SCI2027-Brochure-AR.pdf`

**Step 1: Write the failing test**

Extend `sci2027Content.test.ts` to assert that every local image and brochure path referenced by `sci2027Content.ts` exists in `client/public`.

**Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: FAIL because asset files are not yet present.

**Step 3: Copy approved assets from `/home/ubuntu/sci2027-source`**

Copy the supplied public Drive assets without altering their content. Keep the source-format extension correct, even when Drive’s display filename uses a different extension.

**Step 4: Run the test to verify it passes**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add client/public/sci-2027 client/src/data/sci2027Content.test.ts
git commit -m "feat: add official SCI 2027 visual and brochure assets"
```

## Task 3: Build the SCI 2027 public homepage and shared shell

**Files:**
- Create: `client/src/components/Sci2027Header.tsx`
- Create: `client/src/components/Sci2027Footer.tsx`
- Create: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/pages/Home.tsx`
- Modify: `client/src/index.css`
- Modify: `client/index.html`

**Step 1: Write the failing test**

Extend `sci2027Content.test.ts` with a source-level check that the homepage imports the SCI 2027 content module and renders the correct edition label. This is intentionally a low-coupling verification because the app currently has no React Testing Library setup.

**Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: FAIL because the page has not been replaced.

**Step 3: Implement the focused public shell**

Build a responsive, accessible header with anchor navigation to About, Tracks, Programme, Important Dates, Workshops, Registration, and Contact. Add a menu button at mobile sizes. Replace the old home content with an editorial SCI 2027 landing page that includes:

- Official logo lock-up and first-international-conference label.
- Hero with current dates, conference center, title, bilingual theme, official detailed poster, registration and brochure CTAs.
- About and institutional objectives, including the Faculty’s centenary context.
- Six track cards with bilingual titles and source-approved summaries.
- Call for abstracts requirements, deadline sequence, and an explicit notice that the official submission link will be announced.
- Programme-at-a-glance for 7–9 April, labelled as a preliminary programme and based on the Arabic brochure.
- Workshop and training overview based on the official brochure.
- Separate general attendee and speaker registration cards linked to the official Google Forms.
- Patronage, organizer, and contact section.
- A restrained SCI 2026 archive card that points to the preserved legacy gallery and certificate-request page.

Update global typography, spacing, color tokens, page-scroll offset, focus treatment, responsive layouts, and browser title/meta description. Do not use live 2026 workshop queries or old open/closed registration UI.

**Step 4: Run the test to verify it passes**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: PASS.

**Step 5: Run static validation**

Run: `pnpm check`

Expected: exit code 0.

**Step 6: Commit**

```bash
git add client/src/components/Sci2027Header.tsx client/src/components/Sci2027Footer.tsx client/src/pages/Sci2027Home.tsx client/src/pages/Home.tsx client/src/index.css client/index.html client/src/data/sci2027Content.test.ts
git commit -m "feat: rebuild public site for SCI 2027"
```

## Task 4: Add a dedicated SCI 2027 programme page and SCI 2026 archive page

**Files:**
- Create: `client/src/pages/Sci2027Programme.tsx`
- Create: `client/src/pages/Sci2026Archive.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Extend the test to assert that App routes `/programme` to the 2027 programme page and `/archive-2026` to the archive page.

**Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: FAIL because neither route exists.

**Step 3: Implement the pages and routes**

Create a detailed, accessible SCI 2027 programme page with the April 7, April 8, and April 9 outline, clear “preliminary” labelling, and concise workshop descriptions. Create a lightweight, honest SCI 2026 archive page that provides links to legacy gallery, certificates, and report resources without rendering old 2026 marketing content as current information. Update App routing and remove the global SCI 2026 `AnnouncementBanner` from the public shell to prevent old database announcements appearing in the 2027 experience. Keep old backend APIs and admin routes unchanged.

**Step 4: Run the test to verify it passes**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: PASS.

**Step 5: Run static validation**

Run: `pnpm check`

Expected: exit code 0.

**Step 6: Commit**

```bash
git add client/src/pages/Sci2027Programme.tsx client/src/pages/Sci2026Archive.tsx client/src/App.tsx client/src/data/sci2027Content.test.ts
git commit -m "feat: add SCI 2027 programme and legacy archive"
```

## Task 5: Verify visually, build, checkpoint, and publish

**Files:**
- Modify only if fixes are necessary from verification.

**Step 1: Run all new tests**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: PASS with zero failures.

**Step 2: Run typechecking and production build**

Run:

```bash
pnpm check
pnpm build
```

Expected: both exit code 0.

**Step 3: Check the running project**

Use `webdev_check_status` and inspect the deployed preview at desktop and mobile widths. Verify the actual visible page has no SCI 2026 dates, “registration closed” messaging, 2026 fees, or old calendar links in the new public navigation.

**Step 4: Validate source materials**

Check the brochure download paths return non-empty local files; open the official Google Form URLs and confirm their form titles remain “SCI 2027 – General Attendee Registration Form” and “SCI 2027 – Speaker Registration Form.”

**Step 5: Save checkpoint and publish**

Create a descriptive webdev checkpoint before deployment. Publish only after fresh verification evidence confirms the build, typecheck, new tests, and primary-page visual review.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: verify SCI 2027 public site"
```
