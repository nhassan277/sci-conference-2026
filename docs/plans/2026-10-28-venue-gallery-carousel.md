# Venue Gallery Carousel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the tall eight-card `Explore the Venue` display with a compact, manual two-page gallery: four photographs in a 2×2 collage per page, with arrow and dot navigation.

**Architecture:** Keep the same eight hosted venue photographs and their alternative text in the central SCI 2027 data source. Remove the no-longer-required visible caption data. The homepage derives two pages from the existing ordered list (`0–3` and `4–7`) and stores only the current page index in React state. It renders the selected four images as a square 2×2 collage, with manually operated previous/next controls and page dots; no automatic rotation is introduced.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Vitest.

---

### Task 1: Define the compact carousel regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Replace the prior full-card test with expectations that:
- all eight supplied hosted photographs and their alternative text remain in `venueGallery`;
- the gallery records no longer expose caption data;
- the homepage slices the eight items into two ordered four-image pages;
- it uses local React state, manual previous/next arrow controls, and two accessible page dots;
- it renders the selected page in a `grid-cols-2` collage with square, cropped-to-fill thumbnails; and
- it does not render a gallery `figcaption` or automatic rotation mechanism.

**Step 2: Run the focused test and confirm it fails**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the existing gallery still has captions and renders all eight full-card figures at once.

### Task 2: Implement the manually controlled two-page gallery

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Remove the gallery-only captions**

Delete only the eight `venueGallery.caption` values. Preserve every hosted URL, source label and descriptive alternative text. Do not alter original uploads or their hosted derivatives.

**Step 2: Add compact carousel state and controls**

- Import `useState`, `ChevronLeft` and `ChevronRight`.
- Build exactly two pages by slicing the ordered gallery list at 4 images.
- Render the selected group as a 2×2 square collage. Use `object-cover` in equal square cells to achieve the organizer-approved compact collage appearance.
- Render previous/next buttons with clear English `aria-label` values; disable the unavailable direction at either endpoint.
- Render two labelled page dots. A click selects that page. Do not add timers, autoplay or swiping requirements.
- On every viewport width—including narrow mobile—keep the 2×2 arrangement to match the confirmed requirement.

**Step 3: Run the focused test**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Verify, document and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run the complete release verification**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 2: Visual and interaction review**

At desktop and 375 px mobile widths, verify that each page visibly contains exactly four equal collage cells, dots identify the active group, both arrow actions change the group in the appropriate direction, no captions are visible and no automatic movement occurs.

**Step 3: Save a WebDev checkpoint**

Mark the tracked carousel work as complete only after fresh verification, then save a descriptive checkpoint.
