# SCI 2027 Expanded Track Specialties Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand all six SCI 2027 conference tracks to ten visible, English-only specialty areas each, balancing core research disciplines with applied and industry-relevant areas.

**Architecture:** Extend the existing `topics` arrays in `sci2027Content.ts`; no new data model or route is required. Update the homepage track cards to map every topic rather than truncating the first three, while preserving the existing colour system, responsive grid, and English-only public site.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vitest, Vite.

---

### Task 1: Create a failing track-specialties regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require all six tracks to have ten topics and verify representative new specialties such as `Synthetic biology and biodesign`, `Circular economy and resource recovery`, `Chemical sensors, spectroscopy and surface science`, `Quantum science and technology`, `Robotics, automation and intelligent systems`, and `Research commercialization and startup development`.

Require `Sci2027Home.tsx` to render `track.topics.map(...)` and prohibit the existing `track.topics.slice(0, 3)` truncation.

**Step 2: Run the test and observe the expected failure**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the existing topic arrays contain five or six items and the homepage truncates them.

### Task 2: Expand the six specialty lists

**Files:**
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Add ten balanced specialties per track**

- Track 1: Life Sciences and Biodiversity, including synthetic biology, biodesign, plant/agricultural biotechnology, ecosystem restoration and bioremediation.
- Track 2: Environment and Earth Sciences, including soil and land systems, circular economy/resource recovery, coastal and freshwater systems, and resilience.
- Track 3: Materials and Chemistry, including medicinal/bioanalytical chemistry and chemical sensors/spectroscopy/surface science.
- Track 4: Physics, Energy and Space Sciences, including condensed-matter/nanophysics, quantum science, plasma/fusion, astronomy instrumentation and data analysis.
- Track 5: AI, Data Science and Computational Science, including computer vision/NLP, digital twins, trustworthy AI, robotics and AI applications across scientific and industrial contexts.
- Track 6: Innovation, Entrepreneurship and Science for Society, including research commercialization, innovation funding/incubation, social innovation and digital transformation.

Keep all labels English-only and avoid claims about specific future workshop or speaker content.

### Task 3: Show every specialty directly in the homepage track cards

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Remove truncation**

Replace `track.topics.slice(0, 3).map(...)` with `track.topics.map(...)`.

**Step 2: Refine the card layout for denser visible topic lists**

Use a compact label row headed `Specialties` and a flexible set of accessible visual tags. Retain readable spacing, the existing colour variants, and mobile wrapping without introducing accordions or hidden details.

### Task 4: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run full release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Use a data assertion to prove six tracks with ten topics each, and a source check to confirm the homepage does not truncate topics.

**Step 2: Review desktop and mobile layouts**

Capture the homepage at desktop and mobile sizes. Confirm all ten specialties for every track appear directly in their cards without clipping, overlap, hidden menus or horizontal scrolling.

**Step 3: Checkpoint**

Mark the checklist entries complete and save a WebDev checkpoint after verification succeeds.
