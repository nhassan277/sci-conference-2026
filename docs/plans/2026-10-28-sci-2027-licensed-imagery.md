# SCI 2027 Licensed Imagery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add real, professional, licensed photographic imagery to all six scientific track cards and the Conference Organization Unit and sponsorship sections, while preserving readable text and responsive performance.

**Architecture:** Store hosted visual metadata in `client/src/data/sci2027Content.ts`. Extend each `ResearchTrack` with a typed image record, and add separate typed visuals for the Unit and sponsorship sections. Render images as decorative, text-safe hero strips with a dark or brand-colour overlay inside existing cards and sections; keep full-resolution WebP assets on managed hosting rather than the local repository.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Vitest, Pillow for deterministic WebP conversion, managed CDN hosting.

**Visual direction:** Editorial scientific photography with a restrained, research-led tone. The cards retain their existing color identities and use a short image band at the top, overlaid with a gradient or tinted veil. The Unit and sponsorship images become broad, quiet-side visuals with strong contrast so headline, body copy and actions remain readable.

**Source and license record:** Eight real professional photographs selected from Unsplash search results. The official Unsplash License page states that Unsplash provides free images. The chosen source images were resized without crop to a maximum 1600 px side and re-encoded as WebP before managed hosting.

---

### Task 1: Add a failing visual-content contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require that all six tracks have hosted visual URLs, nonempty meaningful alternative text, and source/license metadata for Unsplash. Require hosted, nonempty visual records for the Unit and sponsorship sections. Require `Sci2027Home.tsx` to render `track.visual`, `conferenceOrganizationUnit.visual` and `sponsorship.visual`; require `Sci2027Sponsorship.tsx` to render `sponsorship.visual`.

**Step 2: Run the focused test to verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because no visual metadata or section renderers exist.

### Task 2: Add the verified visual metadata

**Files:**
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Add a typed `WebsiteVisual` record**

Use `{ url, alt, source, licenseUrl }` for image metadata. Extend `ResearchTrack` with `visual: WebsiteVisual`.

**Step 2: Add six track image records and two institutional images**

Use the following managed URLs:

- Life Sciences: `https://files.manuscdn.com/user_upload_by_module/session_file/118031311/IIyWFhzNhKAghqxI.webp`
- Environment & Earth: `https://files.manuscdn.com/user_upload_by_module/session_file/118031311/GxBQRIqhjIsSSUTK.webp`
- Materials & Chemistry: `https://files.manuscdn.com/user_upload_by_module/session_file/118031311/prIyrpSCbanWToHj.webp`
- Physics, Energy & Space: `https://files.manuscdn.com/user_upload_by_module/session_file/118031311/GWtOfWqYgdeJIukx.webp`
- AI & Data Science: `https://files.manuscdn.com/user_upload_by_module/session_file/118031311/IGnVWkilAOUeWAXC.webp`
- Innovation & Society: `https://files.manuscdn.com/user_upload_by_module/session_file/118031311/CFnMkGYppLXPJkBM.webp`
- Conference Organization Unit: `https://files.manuscdn.com/user_upload_by_module/session_file/118031311/pTwOOFPnqxSvPByJ.webp`
- Partnership & Sponsorship: `https://files.manuscdn.com/user_upload_by_module/session_file/118031311/HJojRwlLYsMbRRzK.webp`

Set `source` to `Unsplash` and `licenseUrl` to `https://unsplash.com/license` for each record.

### Task 3: Render images with accessible, text-safe treatments

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/pages/Sci2027Sponsorship.tsx`

**Step 1: Add image strips to the six track cards**

Render each `track.visual` as a 160–176 px image header. Keep existing color palette, number, name, focus and specialty list. Use a low-opacity color overlay and ensure each `img` has the supplied alternative text. Do not put text directly over the track photos.

**Step 2: Add the Unit image to the homepage section**

Use the Unit visual as an image block alongside the Unit identity and description. Keep the official Unit logo. Use a gradient overlay only as atmospheric treatment, with all text set in a separate high-contrast panel.

**Step 3: Add partnership imagery**

Use the partnership visual in the homepage partnership teaser and sponsorship-page hero as a background layer with a dark navy overlay. Keep all title, CTA and contact text above the overlay and fully readable.

**Step 4: Run the focused test to verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 4: Release verification and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Verify managed assets**

Run a request check against all eight image URLs and confirm that their bytes match the optimized local WebP sources. Confirm no local public image above 1 MB exists.

**Step 2: Run complete checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 3: Visual review**

Capture desktop and mobile screenshots of the track grid, Unit section, homepage partnership section and sponsorship-page hero. Verify images are relevant, no text is obscured, and there is no horizontal overflow.

**Step 4: Checkpoint**

Mark checklist items complete and save a WebDev checkpoint after all checks pass.
