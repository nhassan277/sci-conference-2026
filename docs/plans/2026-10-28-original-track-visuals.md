# SCI 2027 Original Track Visuals Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the six existing track photographs with six original, professional SCI 2027 editorial science visuals, each matched to its research track and designed for readable website cards.

**Architecture:** Generate six 16:9, text-free editorial composites sharing one premium scientific-art direction and reserved low-detail space for the card overlay. Re-encode selected artwork to web-efficient WebP assets, publish through managed storage, then change only the `tracks[].visual` data and the source caption rule. Existing Unsplash imagery in the Conference Organization Unit and partnership sections remains unchanged and attributed.

**Tech Stack:** Built-in image generation, Pillow WebP re-encoding, managed public asset storage, TypeScript source-of-truth content, React/Tailwind, Vitest.

---

### Task 1: Source and UI regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

1. Add one failing test that requires all six track visuals to be hosted original SCI 2027 assets, with non-empty descriptive alt text and no Unsplash license field.
2. Require Unit and sponsorship visuals to remain Unsplash assets with valid attribution metadata.
3. Require the track-card caption to use the original-visual label rather than the Unsplash wording.
4. Run the focused Vitest test and confirm it fails because the tracks still reference Unsplash.

### Task 2: Original visual production and hosting

**Files:**
- Create temporarily: `/home/ubuntu/sci2027-track-visuals/*.png`
- Create temporarily: `/home/ubuntu/sci2027-track-visuals/web/*.webp`

1. Generate six separate 16:9, no-text, no-logo visual assets in the approved premium editorial-composite style.
2. Preserve the user-approved conceptual content: biodiversity/DNA/cells; climate/water/mountains/maps/renewables; molecules/crystals/materials/energy; space/telescope/physics/renewables; data/networks/robotics/computing; researchers/industry/prototypes/social impact.
3. Review each generated image visually against composition, realism, readable overlay areas, absence of text and track fidelity.
4. Re-encode the accepted assets to optimized WebP without cropping or changing subject content. Upload them to managed public storage and verify HTTP accessibility and checksums.

### Task 3: Website integration

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

1. Extend the visual type to distinguish `SCI 2027 Original` from `Unsplash`, retaining optional license information only where relevant.
2. Replace only six track URLs, alt text and source fields with verified managed-hosting URLs.
3. Render “Original SCI 2027 visual” in track cards while retaining “Photography via Unsplash” in Unit and partnership figures.
4. Run focused tests and verify they pass.

### Task 4: Release verification and checkpoint

**Files:**
- Modify: `todo.md`

1. Run all tests, TypeScript, production build and whitespace check.
2. Verify all six hosted visual responses, correct source metadata, track card captions and mobile/desktop screenshots.
3. Clean only temporary generation and conversion workspaces, mark the task complete and save a WebDev checkpoint.
