# SCI 2027 English-only Student Registration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Present the SCI 2027 public experience in English only and add an official third registration option for student research, thesis and graduation-project submissions.

**Architecture:** Retain the source-of-truth `sci2027Content` module, add the validated student-registration form as a third registration record, and render only English properties in the SCI 2027 public pages. Remove the Arabic brochure action and all Arabic/RTL public text from the SCI 2027 homepage, shared header and footer, programme, and archive page without changing the separate SCI 2026 operational archive systems.

**Tech Stack:** React 19, TypeScript, Wouter, Tailwind CSS, Vitest, Vite.

---

### Task 1: Define the English-only public-content contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Write the failing test**

Add explicit assertions that:

```ts
expect(sci2027Content.registration.studentResearch.url).toBe(
  "https://forms.gle/fmXUzEQ85hbXnLFp8",
);
expect(sci2027Content.registration.studentResearch.name.en).toBe(
  "Student Research, Thesis & Graduation Project Registration",
);
expect(sci2027Content.registration.studentResearch.description.en).toBe(
  "For undergraduate and postgraduate students presenting student research, thesis work, or graduation projects.",
);
expect(sci2027Content.registration.studentResearch.notice.en).toBe(
  "Submission deadline and abstract requirements will be announced.",
);
```

**Step 2: Run test to verify it fails**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because `studentResearch` does not yet exist.

**Step 3: Write minimal implementation**

Add `registration.studentResearch` to `sci2027Content` using the supplied Google Form URL and the approved English copy. Keep data shape compatible with the current content module.

**Step 4: Run test to verify it passes**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add client/src/data/sci2027Content.ts client/src/data/sci2027Content.test.ts
git commit -m "feat: add SCI 2027 student research registration"
```

### Task 2: Enforce English-only presentation in public SCI 2027 routes

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/components/Sci2027Header.tsx`
- Modify: `client/src/components/Sci2027Footer.tsx`
- Modify: `client/src/pages/Sci2027Programme.tsx`
- Modify: `client/src/pages/Sci2026Archive.tsx`

**Step 1: Write the failing test**

Add a source-level public-page regression assertion for the five SCI 2027 shell/page files that checks they do not render Arabic/RTL presentation or the Arabic brochure asset:

```ts
for (const file of englishOnlyPublicFiles) {
  const source = readFileSync(projectPath(file), "utf8");
  expect(source).not.toMatch(/[\u0600-\u06FF]/u);
  expect(source).not.toContain('dir="rtl"');
  expect(source).not.toContain("brochureArabic");
}
```

**Step 2: Run test to verify it fails**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the current public routes still render Arabic text and the Arabic brochure.

**Step 3: Write minimal implementation**

Remove Arabic visual copy, `dir="rtl"` markup and Arabic-navigation subtitles from the English-only SCI 2027 header, homepage, programme, shared footer and archive page. Keep the English brochure only. Remove Arabic text from the programme schedule presentation while retaining the approved English schedule. Do not modify protected/admin or legacy archive service routes in this task.

**Step 4: Run test to verify it passes**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add client/src/pages/Sci2027Home.tsx client/src/components/Sci2027Header.tsx client/src/components/Sci2027Footer.tsx client/src/pages/Sci2027Programme.tsx client/src/pages/Sci2026Archive.tsx client/src/data/sci2027Content.test.ts
git commit -m "feat: make SCI 2027 public pages English only"
```

### Task 3: Add the third registration card to the public homepage

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Write the failing test**

Add assertions that the homepage renders `studentResearch`, uses a three-card wide-screen registration grid, and presents the announcement notice:

```ts
expect(homeSource).toContain("studentResearch");
expect(homeSource).toContain("lg:grid-cols-3");
expect(homeSource).toContain("option.notice.en");
```

**Step 2: Run test to verify it fails**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the homepage currently renders only the general and speaker cards.

**Step 3: Write minimal implementation**

Render the general, speaker and `studentResearch` records in the Register section. Use a responsive three-column desktop layout and retain a strong visual hierarchy. Include the exact deadline/abstract notice in the student card and use a graduation-cap icon to distinguish it from the attendee and speaker options.

**Step 4: Run test to verify it passes**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add client/src/pages/Sci2027Home.tsx client/src/data/sci2027Content.test.ts
git commit -m "feat: add student project registration card"
```

### Task 4: Verify the release and checkpoint it

**Files:**
- Modify: `todo.md`

**Step 1: Validate external destinations**

Run a read-only HTTP validation for all three Google Forms and verify titles:

- `SCI 2027 – General Attendee Registration Form`
- `SCI 2027 – Speaker Registration Form`
- `SCI 2027 – Student Research, Thesis & Graduation Project Registration Form`

**Step 2: Run complete verification**

Run:

```bash
pnpm test
pnpm check
pnpm build
```

Expected: tests pass, TypeScript emits no errors, and production build exits successfully.

**Step 3: Conduct visual review**

Capture desktop and mobile screenshots of `/`, `/programme` and `/archive-2026`. Confirm English-only text, no Arabic brochure action, working student-registration card, and responsive three-card registration layout.

**Step 4: Update tracking**

Mark the English-only conversion and student registration tasks complete in `todo.md`, leaving the distinct public-publishing task pending unless the current public domain independently verifies as SCI 2027.

**Step 5: Save checkpoint**

Use `webdev_save_checkpoint` only after all checks pass. Document the test/build results and checkpoint version in the user-facing completion note.
