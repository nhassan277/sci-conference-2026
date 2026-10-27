# SCI 2027 Promotional Videos Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Present the four supplied SCI 2027 promotional films through a homepage “Watch SCI 2027” preview and a dedicated English-only `/videos` page with click-to-play, accessible in-page players.

**Architecture:** Create faithful poster frames from the supplied films and host both MP4s and posters on a managed CDN, avoiding oversized local project assets. Extend `sci2027Content.ts` with four typed video records that supply hosted URLs, poster URLs, title, description, duration, language label, and display aspect. Add reusable visual card and player behavior to the videos page, then add a homepage preview and shared navigation links.

**Tech Stack:** React 19, TypeScript, Wouter, Tailwind CSS, Lucide React, FFmpeg/ffprobe, managed CDN, Vitest, Vite.

---

### Task 1: Prepare managed video assets and poster frames

**Files:**
- Source: `/home/ubuntu/upload/SCI2027_Promo_30s_CairoUniversity.mp4`
- Source: `/home/ubuntu/upload/SCI2027_science_across_scales_extended_45s_arabic_voiceover.mp4`
- Source: `/home/ubuntu/upload/32ecd58d-de4c-4e29-9330-26e2a1a6f515.mp4`
- Source: `/home/ubuntu/upload/SCI2027_Reel_EN.mp4`
- Create: `/home/ubuntu/sci2027-video-posters/*.jpg`

**Step 1: Establish factual metadata**

Use `ffprobe` and video analysis to establish duration, aspect ratio, audio language, content, and public-facing English titles. The approved records are:

- *Experience SCI 2027: Discover, Create, Connect* — 30 seconds, English, landscape.
- *SCI 2027: Science at the Core of Innovation* — 45 seconds, Arabic voice-over, landscape.
- *Looking Ahead to SCI 2027: Building on Innovation* — 47 seconds, instrumental, square.
- *SCI 2027: Save the Date & Conference Overview* — 29 seconds, English, vertical.

**Step 2: Extract poster candidates**

Use FFmpeg to extract a representative non-title frame for each video at a mid-clip timestamp. Preserve source aspect ratio and write new JPEG files rather than altering originals.

**Step 3: Validate poster images and asset integrity**

Read the extracted frames once and use `ffprobe` to confirm all supplied MP4s retain a playable H.264 video stream.

**Step 4: Upload and validate managed assets**

Upload the four MP4s and four poster JPEGs to managed public CDN storage. Verify every returned URL responds successfully and references a non-empty asset. Do not copy large MP4s into `client/public`.

### Task 2: Create the source-of-truth video records test-first

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Write the failing test**

Add a test requiring four hosted video records, the supplied titles, poster URLs, English-only public descriptions and language labels:

```ts
expect(sci2027Content.videos).toHaveLength(4);
expect(sci2027Content.videos.every((video) => video.url.startsWith("https://"))).toBe(true);
expect(sci2027Content.videos.every((video) => video.posterUrl.startsWith("https://"))).toBe(true);
expect(sci2027Content.videos.map((video) => video.title)).toContain("SCI 2027: Save the Date & Conference Overview");
expect(sci2027Content.videos.find((video) => video.language)?.language).toBe("Arabic voice-over");
```

**Step 2: Run test to verify it fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because no `videos` array exists.

**Step 3: Implement the content source**

Add four hosted video records to `sci2027Content`, using the verified names, summaries, language labels, durations, and aspect values. Store only managed URLs, never local MP4 paths.

**Step 4: Run test to verify it passes**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Add the videos page and homepage preview test-first

**Files:**
- Create: `client/src/pages/Sci2027Videos.tsx`
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/components/Sci2027Header.tsx`
- Modify: `client/src/components/Sci2027Footer.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing route and rendering test**

Require a videos page, a `/videos` route, homepage preview link, header/footer Videos navigation, use of every video record, and English-only rendering:

```ts
expect(existsSync(projectPath("client/src/pages/Sci2027Videos.tsx"))).toBe(true);
expect(appSource).toContain('path={"/videos"} component={Sci2027Videos}');
expect(homeSource).toContain('href="/videos"');
expect(videosSource).toContain("sci2027Content.videos");
expect(headerSource).toContain('label: "Videos"');
expect(footerSource).toContain('href="/videos"');
```

**Step 2: Run test to verify it fails**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the route and page do not exist.

**Step 3: Implement the public experience**

Create a responsive, English-only “Watch SCI 2027” page:

- A dark editorial video hero and a concise invitation to watch.
- Responsive cards that preserve the landscape, square, and portrait identities.
- Clickable poster cards that open a keyboard-accessible in-page overlay player using native video controls, `playsInline`, poster frames and no autoplay.
- A direct “Watch now” action for each record and a visible Arabic voice-over label where appropriate.
- A homepage preview featuring the English landscape film and a link to the full gallery.
- Videos links in the shared header and footer.

### Task 4: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Full release validation**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Additionally verify that no MP4 exists under `client/public`, and confirm every hosted video and poster URL returns a successful response.

**Step 2: Visual review**

Capture desktop and mobile screenshots of the homepage and `/videos` page. Open each modal player once to confirm its matching video source loads and controls are reachable.

**Step 3: Track and checkpoint**

Mark the video tasks complete in `todo.md` and save a WebDev checkpoint after all verification passes.
