# Conference Organization Unit Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the complete Conference Organization Unit content from the SCI 2027 homepage to a dedicated public page, reachable from a top-navigation tab named “Conference Organization Unit” placed immediately after “About.”

**Architecture:** Keep the approved organization-unit data source unchanged. Create a presentation-only `Sci2027OrganizationUnit` route page that renders the existing unit logo, Unsplash meeting visual and attribution, description, official links, four objectives and nine-member roster. Register `/conference-organization-unit` in the Wouter router and add the route to the shared header navigation. Remove the entire Unit section and its roster from `Sci2027Home`, without adding a replacement home-page summary or link.

**Tech Stack:** React, TypeScript, Wouter, Tailwind CSS, Lucide React, Vitest.

---

### Task 1: Define the route-and-relocation regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Update Unit-related tests to require that:
- `client/src/pages/Sci2027OrganizationUnit.tsx` exists and renders the existing Unit data, logo, meeting visual, Unsplash attribution, official external links, objectives and roster;
- `App.tsx` imports the page and maps `/conference-organization-unit` to it;
- `Sci2027Header.tsx` exposes the label “Conference Organization Unit” immediately after “About” and points to the exact route;
- the homepage no longer references `conferenceOrganizationUnit`, “Meet the Unit”, “How the Unit works” or the Unit’s external-link labels; and
- current Unit roster, visual and styling contracts target the dedicated page, not the homepage.

**Step 2: Run the focused test and confirm it fails**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the standalone page and route/header entries do not yet exist, while Unit content still renders on the homepage.

### Task 2: Create the dedicated public Unit page and route

**Files:**
- Create: `client/src/pages/Sci2027OrganizationUnit.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/components/Sci2027Header.tsx`

**Step 1: Build the page**

Render a responsive English-only public page, using `Sci2027Header` and `Sci2027Footer`, that preserves the approved Unit content:
- a navy introductory hero with the official Unit logo and “Faculty of Science, Cairo University” / “Conference Organization Unit” identity;
- the Unsplash meeting visual with visible “Photography via Unsplash” attribution, approved Unit description and two official external links;
- the four existing objectives under “How the Unit works”; and
- the “Meet the Unit” heading, approved explanatory text and nine-member roster with the existing navy-and-gold director treatment.

Reuse `sci2027Content.conferenceOrganizationUnit` and `assets.conferenceUnitLogo`; do not duplicate names, roles or text strings.

**Step 2: Register the route**

Import the new page in `App.tsx` and add the exact Wouter route `/conference-organization-unit`.

**Step 3: Add the header tab**

Add `{ href: "/conference-organization-unit", label: "Conference Organization Unit" }` directly after the About item. Keep all existing navigation links. Use the wider desktop breakpoint for the expanded navigation so the long English label does not crowd the header; the menu button remains available at narrower viewport widths.

### Task 3: Remove the homepage Unit presentation

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Remove only the Unit section**

Delete the full Unit information/objectives/roster section. Remove now-unused destructured data references and icon imports. Do not change SCI 2027 introduction, patronage, venue, tracks, sponsorship, registration or other public content.

**Step 2: Run the focused test**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 4: Verify, document and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run complete release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 2: Browser and responsive checks**

At desktop and narrow-mobile widths, verify:
- the shared header opens the dedicated Unit page through the new tab;
- the Unit page contains the preserved content and working official external links;
- the homepage contains none of the Unit section or roster; and
- the responsive menu exposes the new navigation item without overflow.

**Step 3: Save checkpoint**

After marking the three tracked tasks complete, save a descriptive WebDev checkpoint.
